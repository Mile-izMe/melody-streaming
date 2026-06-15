import { useAuthStore } from "@/store/authStore";
import { clearTokenCookie, setTokenCookie } from "../cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildHeaders(token?: string, isJson = true) {
  return {
    ...(isJson && { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ─── Shared error handler ─────────────────────────────────────
async function handleResponse(res: Response) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── RefreshToken Rotation ────────────────────────────────────
async function fetchWithRefresh(
  endpoint: string,
  options: RequestInit,
  accessToken: string,
): Promise<Response> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
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
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) throw new Error();

      const { accessToken: newAccessToken } = await refreshRes.json();

      setTokens(newAccessToken, refreshToken);
      setTokenCookie(newAccessToken);

      return fetch(`${BASE_URL}${endpoint}`, {
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
        : fetch(`${BASE_URL}${endpoint}`, { headers: buildHeaders() }).then(
            handleResponse,
          ),

    post: (endpoint: string, body: unknown) =>
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
        : fetch(`${BASE_URL}${endpoint}`, {
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
