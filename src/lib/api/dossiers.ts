import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";
import { getTokens } from "./client";

export function listMyDossiers() {
  return apiFetch<{ dossiers: Dossier[] }>("/api/patient/dossiers");
}

export function getDossier(id: string) {
  return apiFetch<{ dossier: Dossier }>(`/api/patient/dossiers/${id}`);
}

export function createDraftDossier() {
  return apiFetch<{ dossier: Dossier }>("/api/patient/dossiers", { method: "POST" });
}

export function uploadDossierPhoto(dossierId: string, file: File) {
  const formData = new FormData();
  formData.append("photo", file);
  return apiFetch<{ photo: { id: string; url: string } }>(`/api/patient/dossiers/${dossierId}/photos`, {
    method: "POST",
    body: formData,
  });
}

export function deleteDossierPhoto(dossierId: string, photoId: string) {
  return apiFetch<{ message: string }>(`/api/patient/dossiers/${dossierId}/photos/${photoId}`, {
    method: "DELETE",
  });
}

export function submitDossier(dossierId: string, payload: Record<string, unknown>) {
  return apiFetch<{ message: string; dossier: Dossier }>(`/api/patient/dossiers/${dossierId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchDossierPdfBlob(dossierId: string): Promise<Blob> {
  const tokens = getTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/dossiers/${dossierId}/pdf`, {
    headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {},
  });
  if (!res.ok) throw new Error("Impossible de charger le rapport PDF.");
  return res.blob();
}