import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";
import { getTokens } from "./client";

export interface AdminDossierFilters {
  statut?: string;
  niveauPriorite?: string;
  medecinEvaluateurId?: string;
  dateDebut?: string;
  dateFin?: string;
}

export function listAllDossiers(filters: AdminDossierFilters = {}) {
  const params = new URLSearchParams();
  if (filters.statut) params.set("statut", filters.statut);
  if (filters.niveauPriorite) params.set("niveauPriorite", filters.niveauPriorite);
  if (filters.medecinEvaluateurId) params.set("medecinEvaluateurId", filters.medecinEvaluateurId);
  if (filters.dateDebut) params.set("dateDebut", filters.dateDebut);
  if (filters.dateFin) params.set("dateFin", filters.dateFin);

  const qs = params.toString();
  return apiFetch<{ dossiers: Dossier[]; count: number }>(`/api/admin/dossiers${qs ? `?${qs}` : ""}`);
}

export function getAdminDossierDetail(id: string) {
  return apiFetch<{ dossier: Dossier & { patient: any; medecinEvaluateur: any }; readOnly: boolean }>(`/api/admin/dossiers/${id}`);
}

export async function exportDossiersCsv(dateDebut?: string, dateFin?: string) {
  const { getTokens } = await import("./client");
  const tokens = getTokens();
  const params = new URLSearchParams();
  if (dateDebut) params.set("dateDebut", dateDebut);
  if (dateFin) params.set("dateFin", dateFin);
  const qs = params.toString();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dossiers/export/csv${qs ? `?${qs}` : ""}`, {
    headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {},
  });
  if (!res.ok) throw new Error("Échec de l'export.");
  return res.blob();
}

export async function fetchAdminDossierPdfBlob(dossierId: string): Promise<Blob> {
  const tokens = getTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dossiers/${dossierId}/pdf`, {
    headers: tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {},
  });
  if (!res.ok) throw new Error("Impossible de charger le rapport PDF.");
  return res.blob();
}