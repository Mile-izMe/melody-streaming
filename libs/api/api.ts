import { useAuthStore } from "@/store/authStore";
import { clearTokenCookie, setTokenCookie } from "../cookie";
import { ApiError } from "../errors";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const API_URL = process.env.API_URL?.replace(/\/$/, "");
const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

function resolveBaseUrl() {
  if (typeof window !== "undefined") {
    return NEXT_PUBLIC_API_URL || "";
  }

  const resolved =
    NEXT_PUBLIC_API_URL || API_URL || VERCEL_URL || "http://localhost:3000";
  return resolved;
}

function buildUrl(endpoint: string) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  return `${resolveBaseUrl()}${normalizedEndpoint}`;
}

function buildHeaders(token?: string, isJson = true) {
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ─── Shared error handler ─────────────────────────────────────
async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError({
      status: body.status ?? res.status,
      detail: body.detail ?? "An unexpected error occurred",
      title: body.title ?? "Error",
      instance: body.instance ?? "",
    });
  }
  return res.json();
}

// ─── RefreshToken Rotation ────────────────────────────────────
async function fetchWithRefresh(
  endpoint: string,
  options: RequestInit,
  accessToken: string,
): Promise<Response> {
  const res = await fetch(buildUrl(endpoint), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();

    if (!refreshToken) {
      logout();
      throw new Error("Your session has expired. Please log in again.");
    }

    try {
      const refreshRes = await fetch(buildUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) throw new Error();

      const { accessToken: newAccessToken } = await refreshRes.json();

      setTokens(newAccessToken, refreshToken);
      setTokenCookie(newAccessToken);

      return fetch(buildUrl(endpoint), {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch {
      logout();
      clearTokenCookie();
      throw new Error("Your session has expired. Please log in again.");
    }
  }

  return res;
}

// ─── Factory ──────────────────────────────────────────────────
function createClient(accessToken?: string) {
  return {
    get: (endpoint: string) =>
      accessToken
        ? fetchWithRefresh(
            endpoint,
            { headers: buildHeaders(accessToken) },
            accessToken,
          ).then(handleResponse)
        : fetch(buildUrl(endpoint), { headers: buildHeaders() }).then(
            handleResponse,
          ),

    post: (endpoint: string, body?: unknown) =>
      accessToken
        ? fetchWithRefresh(
            endpoint,
            {
              method: "POST",
              headers: buildHeaders(accessToken),
              body: JSON.stringify(body),
            },
            accessToken,
          ).then(handleResponse)
        : fetch(buildUrl(endpoint), {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify(body),
          }).then(handleResponse),

    put: (endpoint: string, body: unknown) =>
      fetchWithRefresh(
        endpoint,
        {
          method: "PUT",
          headers: buildHeaders(accessToken),
          body: JSON.stringify(body),
        },
        accessToken!,
      ).then(handleResponse),

    delete: (endpoint: string) =>
      fetchWithRefresh(
        endpoint,
        {
          method: "DELETE",
          headers: buildHeaders(accessToken),
        },
        accessToken!,
      ).then(handleResponse),

    upload: (endpoint: string, formData: FormData) =>
      fetchWithRefresh(
        endpoint,
        {
          method: "POST",
          headers: buildHeaders(accessToken, false),
          body: formData,
        },
        accessToken!,
      ).then(handleResponse),
  };
}

// ─── Export 2 client ──────────────────────────────────────────
export const publicApi = createClient();
export const privateApi = (token: string) => createClient(token);
