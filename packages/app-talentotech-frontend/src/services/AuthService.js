const API_URL = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");
const SESSION_TOKEN_KEY = "talentotech.firebaseIdToken";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const responseText = await response.text();
  let body = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("La API devolvió una respuesta JSON inválida.");
      }
      body = responseText;
    }
  }

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? body ?? response.statusText;
    const error = new Error(
      `Error de autenticación (${response.status}): ${message}`,
    );
    error.status = response.status;
    throw error;
  }

  return body;
}

const postCredentials = (path, email, password) =>
  request(`/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

export const signIn = (email, password) =>
  postCredentials("login", email, password);

export const register = (email, password) =>
  postCredentials("register", email, password);

export const getCurrentSession = (idToken) =>
  request("/auth/session", {
    headers: { Authorization: `Bearer ${idToken}` },
  });

export const getStoredIdToken = () =>
  globalThis.sessionStorage?.getItem(SESSION_TOKEN_KEY) ?? "";

export const storeIdToken = (idToken) =>
  globalThis.sessionStorage?.setItem(SESSION_TOKEN_KEY, idToken);

export const clearStoredIdToken = () =>
  globalThis.sessionStorage?.removeItem(SESSION_TOKEN_KEY);
