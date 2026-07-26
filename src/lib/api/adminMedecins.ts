import { apiFetch } from "./client";
import { Medecin } from "@/lib/types";

export function listPendingMedecins() {
  return apiFetch<{ medecins: Medecin[] }>("/api/admin/medecins/pending");
}

export function validateMedecin(id: string) {
  return apiFetch<{ message: string; medecin: Medecin }>(`/api/admin/medecins/${id}/validate`, { method: "POST" });
}

export function rejectMedecin(id: string, motif: string) {
  return apiFetch<{ message: string; medecin: Medecin }>(`/api/admin/medecins/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ motif }),
  });
}

export function setReferencee(id: string, referencee: boolean) {
  return apiFetch<{ message: string; medecin: Medecin }>(`/api/admin/medecins/${id}/referencee`, {
    method: "POST",
    body: JSON.stringify({ referencee }),
  });
}

export function deactivateMedecin(id: string, motif: string) {
  return apiFetch<{ message: string; medecin: Medecin }>(`/api/admin/medecins/${id}/deactivate`, {
    method: "POST",
    body: JSON.stringify({ motif }),
  });
}

export function reactivateMedecin(id: string) {
  return apiFetch<{ message: string; medecin: Medecin }>(`/api/admin/medecins/${id}/reactivate`, { method: "POST" });
}

export interface MedecinFilters {
  statut?: string;
  referencee?: boolean;
}

export function listAllMedecins(filters: MedecinFilters = {}) {
  const params = new URLSearchParams();
  if (filters.statut) params.set("statut", filters.statut);
  if (filters.referencee !== undefined) params.set("referencee", String(filters.referencee));
  const qs = params.toString();
  return apiFetch<{ medecins: Medecin[]; count: number }>(`/api/admin/medecins${qs ? `?${qs}` : ""}`);
}