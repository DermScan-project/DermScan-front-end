"use client";

import Link from "next/link";
import { Dossier } from "@/lib/types";
import { labelZones } from "@/lib/labels";

function calculateAge(dateNaissance: string) {
  const today = new Date();
  const birth = new Date(dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
}

type DossierWithPatient = Dossier & { patient?: { dateNaissance: string; sexe: string; prenom: string; nom: string } };

export default function DossierPoolCard({ dossier, isNew }: { dossier: DossierWithPatient; isNew?: boolean }) {
  const age = dossier.patient?.dateNaissance ? calculateAge(dossier.patient.dateNaissance) : null;
  const zonesLabel = labelZones(dossier.zones).replace(/Face : |Dos : /g, "").replace("  |  ", ", ");
  const isEvalue = dossier.statut === "EVALUE";
  const isUrgent = dossier.niveauPriorite === "URGENT";
  const isEnAttente = dossier.statut === "EN_ATTENTE";

  const statusBadge = isEvalue
    ? { label: "Évalué", cls: "bg-sauge-clair text-sauge" }
    : isUrgent
    ? { label: "Urgent", cls: "bg-urgent-fond text-urgent-doux" }
    : { label: "En attente", cls: "bg-[#FBF3DD] text-modere" };

  return (
    <Link
      href={`/medecin/dossiers/${dossier.id}`}
      className={`block rounded-2xl border bg-white transition-all hover:shadow-sm ${
        isEnAttente ? "border-sauge/30 shadow-sm" : "border-ardoise/10"
      } ${isEvalue ? "opacity-70" : ""}`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isEvalue ? "bg-sauge-clair/60" : "bg-sauge-clair"}`}>
          {isEvalue ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-encre">
              {dossier.patient?.prenom} {dossier.patient?.nom}
              {age ? <span className="font-normal text-ardoise/70 ml-1">{age} ans</span> : null}
            </p>
            {isNew && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sauge text-white tracking-wide uppercase">
                Nouveau
              </span>
            )}
          </div>
          <p className="text-xs text-ardoise truncate mt-0.5">
            Lésion soumise via portail patient · {zonesLabel}
          </p>
          <div className="mt-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge.cls}`}>
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[11px] text-ardoise/50">{timeAgo(dossier.createdAt)}</span>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
              isEvalue ? "bg-papier text-ardoise" : "bg-encre text-white"
            }`}
          >
            {isEvalue ? "Voir" : "Évaluer"}
          </span>
        </div>
      </div>
    </Link>
  );
}