import { apiFetch } from "./client";

export interface Creneau {
  id: string;
  startDateTime: string;
  endDateTime: string;
  statut: "DISPONIBLE" | "RESERVE";
  regleId: string | null;
}

export interface DisponibiliteRegle {
  id: string;
  jourSemaine: number;
  heureDebut: string;
  heureFin: string;
  dureeSlotMinutes: number;
  dateDebut: string;
  dateFin: string;
}

export interface RendezVousMedecin {
  id: string;
  createdAt: string;
  creneau: { startDateTime: string; endDateTime: string };
  patient: { prenom: string; nom: string; email: string; telephone: string; dateNaissance: string };
}

export function createRegle(payload: {
  jourSemaine: number; heureDebut: string; heureFin: string; dureeSlotMinutes: number; dateDebut: string; dateFin: string;
}) {
  return apiFetch<{ message: string; regle: DisponibiliteRegle }>("/api/medecin/calendar/regles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteRegle(id: string) {
  return apiFetch<{ message: string }>(`/api/medecin/calendar/regles/${id}`, { method: "DELETE" });
}

export function createOneOffCreneau(startDateTime: string, endDateTime: string) {
  return apiFetch<{ creneau: Creneau }>("/api/medecin/calendar/creneaux", {
    method: "POST",
    body: JSON.stringify({ startDateTime, endDateTime }),
  });
}

export function listMyCreneaux() {
  return apiFetch<{ creneaux: Creneau[] }>("/api/medecin/calendar/creneaux");
}

export function deleteCreneau(id: string) {
  return apiFetch<{ message: string }>(`/api/medecin/calendar/creneaux/${id}`, { method: "DELETE" });
}

export function listMyRendezVousMedecin() {
  return apiFetch<{ rendezVous: RendezVousMedecin[] }>("/api/medecin/rendezvous");
}