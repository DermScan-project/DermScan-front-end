"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import { listMyRendezVous, RendezVous } from "@/lib/api/rendezvous";

// ─── Assure-toi que l'interface RendezVous dans @/lib/api/rendezvous a ces champs :
// statutPresence: "EN_ATTENTE" | "EFFECTUE" | "ABSENCE_PATIENT" | "ABSENCE_MEDECIN"
// raisonAbsence?: string | null
// presenceMarqueeAt?: string | null

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatHeure(startStr: string, endStr: string) {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${new Date(startStr).toLocaleTimeString("en-US", opts)} - ${new Date(endStr).toLocaleTimeString("en-US", opts)}`;
}

function isPast(endStr: string) {
  return new Date(endStr) < new Date();
}

// ─────────────────────────────────────────────────────────────────────────────
// Bloc statut de présence — affiché uniquement sur les RDV passés
// ─────────────────────────────────────────────────────────────────────────────
function PresenceStatus({ r }: { r: RendezVous }) {
  const past = isPast(r.creneau.endDateTime);
  if (!past) return null;

  const statut = r.statutPresence ?? "EN_ATTENTE";

  if (statut === "EN_ATTENTE") {
    return (
      <div className="flex items-center gap-2 bg-ardoise/5 rounded-xl px-3 py-2 mt-2">
        <span className="text-ardoise/40 text-sm">⏳</span>
        <p className="text-xs text-ardoise/70">En attente de confirmation par le médecin.</p>
      </div>
    );
  }

  const map: Record<string, { icon: string; label: string; bg: string; text: string; iconBg: string }> = {
    EFFECTUE: {
      icon: "✓",
      label: "Consultation effectuée",
      bg: "bg-[#E6F4ED]",
      text: "text-[#1B3A2D]",
      iconBg: "bg-white/60",
    },
    ABSENCE_PATIENT: {
      icon: "✗",
      label: "Vous étiez absent(e)",
      bg: "bg-amber-50",
      text: "text-amber-900",
      iconBg: "bg-amber-100",
    },
    ABSENCE_MEDECIN: {
      icon: "✗",
      label: "Médecin absent",
      bg: "bg-red-50",
      text: "text-red-900",
      iconBg: "bg-red-100",
    },
  };

  const s = map[statut];
  if (!s) return null;

  return (
    <div className={`rounded-xl px-3 py-2.5 mt-2 ${s.bg}`}>
      <div className="flex items-center gap-2">
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${s.iconBg} ${s.text}`}>
          {s.icon}
        </span>
        <p className={`text-xs font-medium ${s.text}`}>{s.label}</p>
      </div>

      {/* Raison de l'absence */}
      {r.raisonAbsence && (
        <p className={`text-xs mt-1 ml-7 ${s.text} opacity-80`}>{r.raisonAbsence}</p>
      )}

      {/* Message spécial si c'est le médecin qui était absent */}
      {statut === "ABSENCE_MEDECIN" && (
        <p className={`text-xs mt-1.5 ml-7 ${s.text} opacity-70`}>
          Veuillez recontacter le cabinet pour reprogrammer un rendez-vous.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Carte RDV patient
// ─────────────────────────────────────────────────────────────────────────────
function RdvCard({ r }: { r: RendezVous }) {
  const passed = isPast(r.creneau.endDateTime);

  return (
    <div className={`rounded-2xl border p-5 ${passed ? "bg-ardoise/5 border-ardoise/10" : "bg-white border-ardoise/10"}`}>
      {/* En-tête médecin */}
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

      {/* Date & heure */}
      <p className="text-sm text-encre capitalize mb-1">{formatDate(r.creneau.startDateTime)}</p>
      <p className="text-sm text-ardoise">{formatHeure(r.creneau.startDateTime, r.creneau.endDateTime)}</p>

      {/* Adresse */}
      {r.medecin.adresseCabinet && (
        <p className="text-xs text-ardoise mt-2">{r.medecin.adresseCabinet}</p>
      )}

      {/* Statut de présence (RDV passés uniquement) */}
      <PresenceStatus r={r} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────────────────────
export default function RendezVousPage() {
  const [rdv, setRdv] = useState<RendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"venir" | "passe">("venir");

  useEffect(() => {
    listMyRendezVous()
      .then((data) => setRdv(data.rendezVous))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = rdv.filter((r) => !isPast(r.creneau.endDateTime));
  const past     = rdv.filter((r) =>  isPast(r.creneau.endDateTime));

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="Mes rendez-vous"
        subtitle="Portail Patient"
        onBack={() => (window.location.href = "/patient/dashboard")}
      />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
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

        {!loading && rdv.length > 0 && (
          <>
            {/* Filtre À venir / Passés */}
            <div className="flex gap-1 bg-white rounded-full border border-ardoise/10 p-1 self-start">
              <button
                onClick={() => setSubTab("venir")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${subTab === "venir" ? "bg-sauge text-white" : "text-ardoise"}`}
              >
                À venir {upcoming.length > 0 && `(${upcoming.length})`}
              </button>
              <button
                onClick={() => setSubTab("passe")}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${subTab === "passe" ? "bg-sauge text-white" : "text-ardoise"}`}
              >
                Passés {past.length > 0 && `(${past.length})`}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {subTab === "venir" && (
                upcoming.length > 0
                  ? upcoming.map((r) => <RdvCard key={r.id} r={r} />)
                  : <p className="text-sm text-ardoise text-center py-10">Aucun rendez-vous à venir.</p>
              )}

              {subTab === "passe" && (
                past.length > 0
                  ? past.map((r) => <RdvCard key={r.id} r={r} />)
                  : <p className="text-sm text-ardoise text-center py-10">Aucun rendez-vous passé.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}