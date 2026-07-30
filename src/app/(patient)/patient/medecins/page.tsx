"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import { listAvailableMedecins, bookCreneau, MedecinAvecCreneaux, Creneau } from "@/lib/api/rendezvous";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";

const MedecinMap = dynamic(() => import("@/components/patient/MedecinMap"), { ssr: false });

function formatHeure12(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatCreneau(c: Creneau) {
  const start = new Date(c.startDateTime);
  const jour = start.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  const heure = `${formatHeure12(c.startDateTime)} - ${formatHeure12(c.endDateTime)}`;
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
    
     {(medecin.distanceKm !== null || medecin.dureeMin !== null) && (
      <p className="text-xs text-ardoise mb-3 flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {medecin.distanceKm} km {medecin.dureeMin ? `· ~${medecin.dureeMin} min en voiture` : ""}
      </p>
    )}

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
  const { coords, status } = useGeolocation();
  const [medecins, setMedecins] = useState<MedecinAvecCreneaux[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listAvailableMedecins(undefined, coords)
      .then((data) => setMedecins(data.medecins))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (status === "granted" || status === "denied" || status === "unsupported") {
      load();
    }
  }, [status, coords]);

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Médecins référencés" subtitle="Créneaux disponibles" onBack={() => (window.location.href = "/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-3">
        {status === "denied" && (
          <p className="text-xs text-modere bg-[#FBF3DD] rounded-lg px-3 py-2">
            Localisation refusée — les distances ne peuvent pas être affichées, mais tous les médecins référencés restent visibles.
          </p>
        )}

        {coords && medecins.length > 0 && (
          <MedecinMap patientCoords={coords} medecins={medecins} />
        )}

        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}

        {!loading && medecins.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 gap-2">
            <p className="text-sm font-medium text-ardoise">Aucun médecin disponible dans un rayon de 2h.</p>
          </div>
        )}

        {!loading && medecins.map((m) => <MedecinCard key={m.id} medecin={m} onBooked={load} />)}
      </div>
    </div>
  );
}