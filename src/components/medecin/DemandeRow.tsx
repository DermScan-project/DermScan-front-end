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

export default function DemandeRow({ dossier }: { dossier: Dossier & { patient?: { dateNaissance: string } } }) {
  const zonesLabel = labelZones(dossier.zones).replace(/Face : |Dos : /g, "").replace("  |  ", ", ");
  const age = dossier.patient?.dateNaissance ? calculateAge(dossier.patient.dateNaissance) : null;

  const badge =
    dossier.statut === "EVALUE"
      ? { label: "Évalué", cls: "bg-sauge-clair text-sauge" }
      : dossier.niveauPriorite === "URGENT"
      ? { label: "Urgent", cls: "bg-urgent-fond text-urgent-doux" }
      : { label: "En attente", cls: "bg-[#FBF3DD] text-modere" };

  return (
    <Link
      href={`/medecin/dossiers/${dossier.id}`}
      className="flex items-center gap-3 rounded-2xl border border-ardoise/10 bg-white px-4 py-3.5 hover:border-sauge/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-encre">Votre dossier{age ? `, ${age} ans` : ""}</p>
        <p className="text-xs text-ardoise truncate">Lésion soumise via portail patient · {zonesLabel}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
    </Link>
  );
}