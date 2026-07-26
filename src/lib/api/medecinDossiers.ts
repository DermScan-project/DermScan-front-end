import { apiFetch } from "./client";
import { Dossier } from "@/lib/types";

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