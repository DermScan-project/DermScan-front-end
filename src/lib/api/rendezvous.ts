import { apiFetch } from "./client";
import { Medecin } from "@/lib/types";

export interface Creneau {
  id: string;
  startDateTime: string;
  endDateTime: string;
  statut: "DISPONIBLE" | "RESERVE";
}

export interface MedecinAvecCreneaux extends Pick<Medecin, "id" | "nomComplet" | "specialite" | "adresseCabinet"> {
  creneaux: Creneau[];
}

export function listAvailableMedecins(specialite?: string) {
  const query = specialite ? `?specialite=${encodeURIComponent(specialite)}` : "";
  return apiFetch<{ medecins: MedecinAvecCreneaux[] }>(`/api/patient/rendezvous/medecins${query}`);
}

export function bookCreneau(creneauId: string) {
  return apiFetch<{ message: string; rendezVous: unknown }>("/api/patient/rendezvous", {
    method: "POST",
    body: JSON.stringify({ creneauId }),
  });
}

export interface RendezVous {
  id: string;
  createdAt: string;
  creneau: { startDateTime: string; endDateTime: string };
  medecin: { nomComplet: string; specialite: string; adresseCabinet: string | null };
}

export function listMyRendezVous() {
  return apiFetch<{ rendezVous: RendezVous[] }>("/api/patient/rendezvous");
}