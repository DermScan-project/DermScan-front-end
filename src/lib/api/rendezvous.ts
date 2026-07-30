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
  cabinetLat: number | null;
  cabinetLng: number | null;
  distanceKm: number | null;
  dureeMin: number | null;
}

export function listAvailableMedecins(specialite?: string, coords?: { lat: number; lng: number } | null) {
  const params = new URLSearchParams();
  if (specialite) params.set("specialite", specialite);
  if (coords) {
    params.set("lat", String(coords.lat));
    params.set("lng", String(coords.lng));
  }
  const qs = params.toString();
  return apiFetch<{ medecins: MedecinAvecCreneaux[] }>(`/api/patient/rendezvous/medecins${qs ? `?${qs}` : ""}`);
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