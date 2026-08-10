import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";

interface PatientInfo {
  prenom: string;
  nom: string;
  email: string;
  sexe: "H" | "F" | "AUTRE";
  dateNaissance: string;
  telephone: string;
}

export function findOrCreatePatient(payload: PatientInfo) {
  return apiFetch<{ patient: { id: string; prenom: string; nom: string; email: string } }>(
    "/api/medecin/patients",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function createDraftForPatient(patientId: string) {
  return apiFetch<{ dossier: Dossier }>("/api/medecin/dossiers-for-patient", {
    method: "POST",
    body: JSON.stringify({ patientId }),
  });
}

export function uploadPhotoForPatient(dossierId: string, file: File) {
  const form = new FormData();
  form.append("photo", file);
  return apiFetch<{ photo: { id: string; url: string } }>(
    `/api/medecin/dossiers-for-patient/${dossierId}/photos`,
    { method: "POST", body: form }
  );
}

export function submitForPatient(dossierId: string, payload: Record<string, unknown>) {
  return apiFetch<{ message: string; dossier: Dossier }>(
    `/api/medecin/dossiers-for-patient/${dossierId}/submit`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}