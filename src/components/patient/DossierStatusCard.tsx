import Link from "next/link";
import { Dossier } from "@/lib/types";
import { labelZones } from "@/lib/labels";
import { STATUS_CONFIG, DossierStatus } from "@/lib/dossierStatus";
import { formatRelativeTime } from "@/lib/dates";

export default function DossierStatusCard({ dossier }: { dossier: Dossier }) {
  const config = STATUS_CONFIG[dossier.statut as DossierStatus] || STATUS_CONFIG.EN_ATTENTE;
  const zonesLabel = labelZones(dossier.zones).replace(/Face : |Dos : /g, "").replace("  |  ", ", ");

  return (
    <Link
      href={`/patient/dossiers/${dossier.id}`}
      className={`group flex items-center gap-3 rounded-2xl ${config.cardBg} border border-ardoise/10 border-l-4 ${config.accent} px-4 py-3.5 transition-all hover:shadow-[0_2px_12px_rgba(27,58,45,0.08)] hover:-translate-y-0.5`}
    >
      <div className={`w-9 h-9 rounded-full ${config.badgeBg} flex items-center justify-center shrink-0`}>
        {config.icon === "check" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={config.text}>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : config.icon === "draft" ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={config.text}>
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={config.text}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.text}`}>{config.label}</p>
        <p className="text-xs text-ardoise truncate">{zonesLabel}</p>
        {dossier.createdAt && (
          <p className="text-[11px] text-ardoise/50 flex items-center gap-1 mt-0.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {formatRelativeTime(dossier.createdAt)}
          </p>
        )}
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-ardoise/40 shrink-0 transition-transform group-hover:translate-x-0.5"
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}