"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import { listAvailableMedecins, bookCreneau, MedecinAvecCreneaux, Creneau } from "@/lib/api/rendezvous";

function formatCreneau(c: Creneau) {
  const start = new Date(c.startDateTime);
  const end = new Date(c.endDateTime);
  const jour = start.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const heure = `${start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  return { jour, heure };
}

function MedecinCard({ medecin, onBooked }: { medecin: MedecinAvecCreneaux; onBooked: () => void }) {
  const [booking, setBooking] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  async function handleBook(creneauId: string) {
    setBooking(creneauId);
    setMessage("");
    try {
      await bookCreneau(creneauId);
      setMessage("Rendez-vous confirmé !");
      onBooked();
    } catch (err: any) {
      setMessage(err.error || "Ce créneau vient d'être réservé.");
    } finally {
      setBooking(null);
    }
  }

  const visibleCreneaux = expanded ? medecin.creneaux : medecin.creneaux.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
            <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
            <circle cx="19" cy="17" r="2.5" />
          </svg>
        </div>
        <div>
          <p className="font-display text-lg text-encre">Dr. {medecin.nomComplet}</p>
          <p className="text-xs text-ardoise">{medecin.specialite}{medecin.adresseCabinet ? ` · ${medecin.adresseCabinet}` : ""}</p>
        </div>
      </div>

      {medecin.creneaux.length === 0 && (
        <p className="text-xs text-ardoise/70">Aucun créneau disponible pour le moment.</p>
      )}

      {medecin.creneaux.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {visibleCreneaux.map((c) => {
            const { jour, heure } = formatCreneau(c);
            return (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-papier px-3.5 py-2.5">
                <span className="text-sm text-encre capitalize">{jour} · {heure}</span>
                <button
                  onClick={() => handleBook(c.id)}
                  disabled={booking === c.id}
                  className="rounded-full bg-sauge text-white text-xs font-medium px-3.5 py-1.5 hover:bg-sauge/90 disabled:opacity-50"
                >
                  {booking === c.id ? "..." : "Réserver"}
                </button>
              </div>
            );
          })}
          {medecin.creneaux.length > 3 && !expanded && (
            <button onClick={() => setExpanded(true)} className="text-xs text-sauge font-medium self-start mt-1 hover:underline">
              Voir {medecin.creneaux.length - 3} créneaux de plus
            </button>
          )}
        </div>
      )}

      {message && <p className="text-xs text-sauge mt-3">{message}</p>}
    </div>
  );
}

export default function TrouverMedecinPage() {
  const [medecins, setMedecins] = useState<MedecinAvecCreneaux[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listAvailableMedecins()
      .then((data) => setMedecins(data.medecins))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Médecins référencés" subtitle="Créneaux disponibles" onBack={() => (window.location.href = "/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-3">
        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}

        {!loading && medecins.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 gap-2">
            <div className="w-12 h-12 rounded-full bg-sauge-clair flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
                <circle cx="19" cy="17" r="2.5" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ardoise">Aucun médecin référencé</p>
            <p className="text-xs text-ardoise/70">Aucun praticien n'est encore référencé sur la plateforme.</p>
          </div>
        )}

        {!loading && medecins.map((m) => <MedecinCard key={m.id} medecin={m} onBooked={load} />)}
      </div>
    </div>
  );
}