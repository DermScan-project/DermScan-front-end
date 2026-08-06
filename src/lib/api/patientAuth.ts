import { apiFetch, setTokens, clearTokens } from "./client";
import { Patient } from "@/lib/types";

interface RegisterPayload {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  sexe: "H" | "F" ;
  dateNaissance: string;
  telephone: string;
  consentementRGPD: boolean;
}

export function registerPatient(payload: RegisterPayload) {
  return apiFetch<{ message: string; patient: Patient }>("/api/patient/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
    skipAuth: true,
  });
}

export function verifyPatientEmail(token: string) {
  return apiFetch<{ message: string }>(`/api/patient/auth/verify-email?token=${token}`, {
    skipAuth: true,
  });
}

export async function loginPatient(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; refreshToken: string; patient: Patient }>(
    "/api/patient/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }), skipAuth: true }
  );
  setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, role: "patient" });
  return data.patient;
}

export function forgotPatientPassword(email: string) {
  return apiFetch<{ message: string }>("/api/patient/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

export function resetPatientPassword(token: string, newPassword: string) {
  return apiFetch<{ message: string }>("/api/patient/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
    skipAuth: true,
  });
}

export function logoutPatient() {
  clearTokens();
}

export function getMyPatientProfile() {
  return apiFetch<{ patient: Patient }>("/api/patient/me");
}

export function changePatientPassword(currentPassword: string, newPassword: string) {
  return apiFetch<{ message: string }>("/api/patient/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function updateMyProfile(payload: { prenom?: string; nom?: string; telephone?: string; numeroSecuriteSociale?: string }) {
  return apiFetch<{ patient: Patient }>("/api/patient/me", { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteMyAccount(password: string) {
  return apiFetch<{ message: string }>("/api/patient/me", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}


export interface PatientDocument {
  id: string;
  url: string;
  nom: string;
  categorie: "ORDONNANCE" | "BILAN" | "IMAGERIE" | "LETTRE_MEDECIN";
  createdAt: string;
}

export function uploadDocument(file: File, categorie: string) {
  const form = new FormData();
  form.append("document", file);
  form.append("categorie", categorie);
  return apiFetch<{ document: PatientDocument }>("/api/patient/documents", { method: "POST", body: form });
}

export function listMyDocuments() {
  return apiFetch<{ documents: PatientDocument[] }>("/api/patient/documents");
}

export function deleteDocument(id: string) {
  return apiFetch<{ message: string }>(`/api/patient/documents/${id}`, { method: "DELETE" });
}
export function getDocumentDownloadUrl(id: string) {
  return apiFetch<{ url: string }>(`/api/patient/documents/${id}/download`);
}