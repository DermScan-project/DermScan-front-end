"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import { listMyRendezVous, RendezVous } from "@/lib/api/rendezvous";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatHeure(startStr: string, endStr: string) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  return `${start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}

function isPast(endStr: string) {
  return new Date(endStr) < new Date();
}

export default function RendezVousPage() {
  const [rdv, setRdv] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyRendezVous()
      .then((data) => setRdv(data.rendezVous))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = rdv.filter((r) => !isPast(r.creneau.endDateTime));
  const past = rdv.filter((r) => isPast(r.creneau.endDateTime));

  function RdvCard({ r }: { r: RendezVous }) {
    const passed = isPast(r.creneau.endDateTime);
    return (
      <div className={`rounded-2xl border p-5 ${passed ? "bg-ardoise/5 border-ardoise/10" : "bg-white border-ardoise/10"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${passed ? "bg-ardoise/10" : "bg-sauge-clair"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={passed ? "#6B7268" : "#1B3A2D"} strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg text-encre">Dr. {r.medecin.nomComplet}</p>
            <p className="text-xs text-ardoise">{r.medecin.specialite}</p>
          </div>
        </div>
        <p className="text-sm text-encre capitalize mb-1">{formatDate(r.creneau.startDateTime)}</p>
        <p className="text-sm text-ardoise">{formatHeure(r.creneau.startDateTime, r.creneau.endDateTime)}</p>
        {r.medecin.adresseCabinet && <p className="text-xs text-ardoise mt-2">{r.medecin.adresseCabinet}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Mes rendez-vous" subtitle="Portail Patient" onBack={() => (window.location.href = "/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-6">
        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}

        {!loading && rdv.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 gap-2">
            <div className="w-12 h-12 rounded-full bg-sauge-clair flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ardoise">Aucun rendez-vous</p>
            <p className="text-xs text-ardoise/70">Réservez un créneau via "Trouver un médecin".</p>
          </div>
        )}

        {!loading && upcoming.length > 0 && (
          <section className="flex flex-col gap-3">
            <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium">À venir</p>
            {upcoming.map((r) => <RdvCard key={r.id} r={r} />)}
          </section>
        )}

        {!loading && past.length > 0 && (
          <section className="flex flex-col gap-3">
            <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium">Passés</p>
            {past.map((r) => <RdvCard key={r.id} r={r} />)}
          </section>
        )}
      </div>
    </div>
  );
}