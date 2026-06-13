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

// ─── Factory ──────────────────────────────────────────────────
function createClient(token?: string) {
  return {
    get: (endpoint: string) =>
      fetch(`${BASE_URL}${endpoint}`, {
        headers: buildHeaders(token),
      }).then(handleResponse),

    post: (endpoint: string, body: unknown) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(body),
      }).then(handleResponse),

    put: (endpoint: string, body: unknown) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: buildHeaders(token),
        body: JSON.stringify(body),
      }).then(handleResponse),

    delete: (endpoint: string) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: buildHeaders(token),
      }).then(handleResponse),

    upload: (endpoint: string, formData: FormData) =>
      fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: buildHeaders(token, false), // no Content-Type
        body: formData,
      }).then(handleResponse),
  };
}

// ─── Export 2 client ──────────────────────────────────────────
export const publicApi = createClient();
export const privateApi = (token: string) => createClient(token);
