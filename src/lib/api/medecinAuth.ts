import { apiFetch, setTokens, clearTokens } from "./client";
import { Medecin } from "@/lib/types";

interface RegisterPayload {
  nomComplet: string;
  specialite: string;
  rpps: string;
  telephone: string;
  email: string;
  password: string;
  adresseCabinet?: string;
}

export function registerMedecin(payload: RegisterPayload) {
  return apiFetch<{ message: string; medecin: Medecin }>("/api/medecin/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export function verifyMedecinEmail(token: string) {
  return apiFetch<{ message: string }>(`/api/medecin/auth/verify-email?token=${token}`, { skipAuth: true });
}

export async function loginMedecinPassword(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; refreshToken: string; medecin: Medecin }>(
    "/api/medecin/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
  );
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "medecin" });
  return data.medecin;
}

export function requestMedecinOtp(rpps: string) {
  return apiFetch<{ message: string }>("/api/medecin/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ rpps }),
    skipAuth: true,
  });
}

export async function verifyMedecinOtp(rpps: string, code: string) {
  const data = await apiFetch<{ accessToken: string; refreshToken: string; medecin: Medecin }>(
    "/api/medecin/auth/otp/verify",
    { method: "POST", body: JSON.stringify({ rpps, code }), skipAuth: true }
  );
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "medecin" });
  return data.medecin;
}

export function forgotMedecinPassword(email: string) {
  return apiFetch<{ message: string }>("/api/medecin/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

export function resetMedecinPassword(token: string, newPassword: string) {
  return apiFetch<{ message: string }>("/api/medecin/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
    skipAuth: true,
  });
}

export function logoutMedecin() {
  clearTokens();
}

export function getMyMedecinProfile() {
  return apiFetch<{ medecin: Medecin }>("/api/medecin/me");
}