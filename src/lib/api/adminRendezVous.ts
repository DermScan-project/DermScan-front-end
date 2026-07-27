import { apiFetch } from "./client";

export interface AdminRendezVous {
  id: string;
  createdAt: string;
  creneau: { startDateTime: string; endDateTime: string };
  patient: { prenom: string; nom: string; email: string };
  medecin: { nomComplet: string; specialite: string };
}

export function listAllRendezVous() {
  return apiFetch<{ rendezVous: AdminRendezVous[]; count: number }>("/api/admin/rendezvous");
}