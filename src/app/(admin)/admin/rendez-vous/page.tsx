"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";
import { listAllRendezVous, AdminRendezVous } from "@/lib/api/adminRendezVous";

function isPast(endStr: string) {
  return new Date(endStr) < new Date();
}

function PresenceBadge({ statut }: { statut: string }) {
  if (!statut || statut === "EN_ATTENTE") return null;
  const map: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    EFFECTUE:        { label: "Effectué",       bg: "bg-[#E6F4ED]", text: "text-[#1B3A2D]", icon: "✓" },
    ABSENCE_PATIENT: { label: "Patient absent", bg: "bg-[#FEF3C7]", text: "text-[#92400E]", icon: "!" },
    ABSENCE_MEDECIN: { label: "Médecin absent", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", icon: "!" },
  };
  const s = map[statut];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${s.bg} ${s.text}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function AdminRendezVousPage() {
  const [rdv, setRdv] = useState<AdminRendezVous[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState<"TOUS" | "A_VENIR" | "PASSES">("TOUS");

  useEffect(() => {
    listAllRendezVous()
      .then((data) => setRdv(data.rendezVous))
      .finally(() => setLoading(false));
  }, []);

  const filtered = rdv.filter((r) => {
    if (filtre === "A_VENIR") return !isPast(r.creneau.endDateTime);
    if (filtre === "PASSES") return isPast(r.creneau.endDateTime);
    return true;
  });

  return (
    <div className="max-w-full mx-6">
      <AdminPageHeader title="Rendez-vous" subtitle={`${rdv.length} rendez-vous au total`} right={<AdminNotificationBell />} />

      <div className="p-8 pt-6">
        <div className="flex gap-2 mb-5">
          {(["TOUS", "A_VENIR", "PASSES"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filtre === f ? "bg-sauge text-white" : "bg-white border border-ardoise/15 text-ardoise hover:border-sauge/30"
              }`}
            >
              {f === "TOUS" ? "Tous" : f === "A_VENIR" ? "À venir" : "Passés"}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}
          {!loading && filtered.length === 0 && <p className="text-sm text-ardoise text-center py-8">Aucun rendez-vous.</p>}

          {!loading && filtered.map((r) => {
            const start = new Date(r.creneau.startDateTime);
            const end = new Date(r.creneau.endDateTime);
            const passed = isPast(r.creneau.endDateTime);
            const statut = r.statutPresence ?? "EN_ATTENTE";
            return (
              <div key={r.id} className={`flex flex-col gap-2 bg-white rounded-2xl border px-5 py-3.5 ${passed ? "border-ardoise/10 opacity-60" : "border-ardoise/10"}`}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-encre">
                      {r.patient.prenom} {r.patient.nom} <span className="text-ardoise font-normal">avec Dr. {r.medecin.nomComplet}</span>
                    </p>
                    <p className="text-xs text-ardoise">{r.medecin.specialite} · {r.patient.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-encre capitalize">{start.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</p>
                    <p className="text-xs text-ardoise">
                      {start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {passed && <PresenceBadge statut={statut} />}
                </div>

                {/* Raison d'absence, si renseignée */}
                {r.raisonAbsence && (
                  <p className="text-xs text-ardoise/70 bg-ardoise/5 rounded-xl px-3 py-2 ml-[52px]">
                    💬 {r.raisonAbsence}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}