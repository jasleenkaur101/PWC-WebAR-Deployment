// src/api.js
// Use relative paths by default (same origin as frontend)
// Or use VITE_API_URL environment variable for custom API endpoints
const BASE =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "")) ||
  "/api";

function authHeaders() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${msg}`.trim());
  }
  return res.status === 204 ? null : res.json();
}

export default {
  // Auth
  login: (data) => http("POST", "/auth/login", data),
  register: (data) => http("POST", "/auth/register", data),

  // expose both names to avoid breaking components
  me: () => http("GET", "/auth/me"),
  getMe: () => http("GET", "/auth/me"),

  checkEmail: (email) =>
    http("GET", `/auth/check-email?email=${encodeURIComponent(email)}`),
  getSecurityQuestions: (email) =>
    http("GET", `/auth/security-questions?email=${encodeURIComponent(email)}`),
  resetWithSecurityAnswers: (data) =>
    http("POST", "/auth/reset-with-security-answers", data),

  // User/Profile
  getProfile: () => http("GET", "/user/profile"),
  updateProfile: (data) => http("PATCH", "/user/profile", data),

  // Experience / links
  generate8thWallUrl: () => http("POST", "/links/generate"),

    // Experience / links
  generate8thWallUrl: () => http("POST", "/links/generate"),

  // Admin functions
  getAllUsers: () => http("GET", "/user/admin/all"),
  deleteUser: (userId) => http("DELETE", `/user/admin/${userId}`),
};

