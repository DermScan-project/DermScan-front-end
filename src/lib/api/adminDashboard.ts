import { apiFetch } from "./client";

export interface AdminDashboardData {
  totalPatients: number;
  totalMedecins: number;
  medecinsParStatut: { EN_ATTENTE: number; ACTIF: number; REJETE: number; DESACTIVE: number };
  medecinsReferences: number;
  totalDossiers: number;
  dossiersParStatut: { EN_ATTENTE: number; EN_COURS: number; EVALUE: number };
  dossiersParPriorite: { URGENT: number; MOYENNEMENT_URGENT: number; PAS_URGENT: number };
  pendingMedecins: { id: string; nomComplet: string; specialite: string; createdAt: string }[];
  urgentDossiers: { id: string; createdAt: string; patient: { prenom: string; nom: string } }[];
  trend7Jours: { date: string; count: number }[];
}

export function getAdminDashboard() {
  return apiFetch<AdminDashboardData>("/api/admin/dashboard");
}