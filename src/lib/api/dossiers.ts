import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";

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