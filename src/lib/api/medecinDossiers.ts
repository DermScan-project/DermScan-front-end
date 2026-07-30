import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";
import { getTokens } from "./client";
import { PatientDocument } from "@/lib/api/patientAuth";
export interface DashboardStats {
  demandes: number;
  urgentes: number;
  enAttente: number;
  evaluees: number;
  dernieresDemandes: Dossier[];
}

export interface PoolResponse {
  dossiers: (Dossier & { patient: { dateNaissance: string; sexe: string } })[];
}

export function getMedecinDashboard() {
  return apiFetch<DashboardStats>("/api/medecin/dossiers/dashboard");
}

export function getMedecinPool() {
  return apiFetch<PoolResponse>("/api/medecin/dossiers/pool");
}

export function claimDossier(id: string) {
  return apiFetch<{ dossier: Dossier }>(`/api/medecin/dossiers/${id}/claim`, {
    method: "POST",
  });
}

export function getMedecinDossierDetail(id: string) {
  return apiFetch<{ dossier: Dossier & { patient: any }; readOnly: boolean }>(`/api/medecin/dossiers/${id}`);
}

export function evaluateDossier(id: string, avis: string, commentaire?: string) {
  return apiFetch<{ message: string; dossier: Dossier }>(`/api/medecin/dossiers/${id}/evaluate`, {
    method: "POST",
    body: JSON.stringify({ avis, commentaire }),
  });
}


export async function fetchMedecinDossierPdfBlob(dossierId: string): Promise<Blob> {
  const tokens = getTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medecin/dossiers/${dossierId}/pdf`, {
    headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {},
  });
  if (!res.ok) throw new Error("Impossible de charger le rapport PDF.");
  return res.blob();
}

export interface PatientLookupResult {
  patient: { id: string; prenom: string; nom: string; dateNaissance: string; sexe: string };
  documents: PatientDocument[];
  dossiers: {
    id: string;
    createdAt: string;
    statut: string;
    niveauPriorite: string | null;
    medecinEvaluateur?: { nomComplet: string; specialite: string } | null;
  }[];
}

export function lookupPatientByNumeroSecu(numeroSecu: string) {
  return apiFetch<PatientLookupResult>(`/api/medecin/patient-lookup?numeroSecu=${encodeURIComponent(numeroSecu)}`);
}

export function getMedecinDocumentDownloadUrl(id: string) {
  return apiFetch<{ url: string }>(`/api/medecin/patient-lookup/documents/${id}/download`);
}