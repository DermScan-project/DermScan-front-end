import { apiFetch } from "./client";

export interface AdminRendezVous {
  id: string;
  createdAt: string;
  creneau: { startDateTime: string; endDateTime: string };
  patient: { prenom: string; nom: string; email: string };
  medecin: { nomComplet: string; specialite: string };
  statutPresence: "EN_ATTENTE" | "EFFECTUE" | "ABSENCE_PATIENT" | "ABSENCE_MEDECIN";
  raisonAbsence?: string | null;
  presenceMarqueeAt?: string | null;
}

export function listAllRendezVous() {
  return apiFetch<{ rendezVous: AdminRendezVous[]; count: number }>("/api/admin/rendezvous");
}