import { apiFetch, setTokens, clearTokens,getTokens  } from "./client";

export interface Admin {
  id: string;
  email: string;
}

export async function loginAdmin(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; refreshToken: string; admin: Admin }>(
    "/api/admin/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
  );
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "admin" });
  return data.admin;
}

export function forgotAdminPassword(email: string) {
  return apiFetch<{ message: string }>("/api/admin/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

export function resetAdminPassword(token: string, newPassword: string) {
  return apiFetch<{ message: string }>("/api/admin/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
    skipAuth: true,
  });
}

export async function logoutAdmin() {
  const tokens = getTokens();
  if (tokens?.refreshToken) {
    await apiFetch("/api/admin/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      skipAuth: true,
    }).catch(() => {});
  }
  clearTokens();
}

export function getMyAdminProfile() {
  return apiFetch<{ admin: Admin }>("/api/admin/me");
}