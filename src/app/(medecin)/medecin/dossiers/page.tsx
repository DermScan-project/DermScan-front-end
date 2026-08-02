"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import HeaderActions from "@/components/ui/HeaderActions";
import MedecinNav from "@/components/medecin/MedecinNav";
import DossierPoolCard from "@/components/medecin/DossierPoolCard";
import { useAuth } from "@/context/AuthContext";
import { getMedecinPool} from "@/lib/api/medecinDossiers";
import { Dossier } from "@/lib/types";

type DossierWithPatient = Dossier & { patient?: { dateNaissance: string; sexe: string } };

type Filtre = "tous" | "en_attente" | "evalue" | "urgent";

const FILTRES: { key: Filtre; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "en_attente", label: "En attente" },
  { key: "evalue", label: "Évalués" },
  { key: "urgent", label: "Urgents" },
];

export default function MedecinDossiersPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const medecin = user as any;

  const initialFiltre = (searchParams.get("filtre") as Filtre) || "tous";
  const [filtre, setFiltre] = useState<Filtre>(initialFiltre);
  const [dossiers, setDossiers] = useState<DossierWithPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [urgentCount, setUrgentCount] = useState(0);
 const [search, setSearch] = useState("");
  const load = useCallback(async () => {
    try {
      const res = await getMedecinPool();
      setDossiers(res.dossiers);
      setUrgentCount(res.dossiers.filter((d) => d.niveauPriorite === "URGENT").length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Poll every 30s for real-time feel
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = dossiers.filter((d) => {
  const matchesFiltre = (() => {
    if (filtre === "tous") return true;
    if (filtre === "en_attente") return d.statut === "EN_ATTENTE" || d.statut === "EN_COURS";
    if (filtre === "evalue") return d.statut === "EVALUE";
    if (filtre === "urgent") return d.niveauPriorite === "URGENT";
    return true;
  })();

  const matchesSearch = search.trim() === "" || (
    `${d.patient?.prenom ?? ""} ${d.patient?.nom ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return matchesFiltre && matchesSearch;
});


  const counts: Record<Filtre, number> = {
    tous: dossiers.length,
    en_attente: dossiers.filter((d) => d.statut === "EN_ATTENTE" || d.statut === "EN_COURS").length,
    evalue: dossiers.filter((d) => d.statut === "EVALUE").length,
    urgent: dossiers.filter((d) => d.niveauPriorite === "URGENT").length,
  };

  // A dossier is "new" if it's EN_ATTENTE and created in the last 10 minutes
  const isNew = (d: DossierWithPatient) => {
    if (d.statut !== "EN_ATTENTE") return false;
    return Date.now() - new Date(d.createdAt).getTime() < 10 * 60 * 1000;
  };
return (
  <div className="min-h-screen bg-papier flex flex-col">
    <PortalHeader
      title="DermScan Pro"
      subtitle={medecin?.nomComplet || ""}
      onBack={() => (window.location.href = "/")}
      right={<HeaderActions hasUnread={urgentCount > 0} />}
    />
    <MedecinNav dossiersBadge={counts.tous} />

    <div className="sticky top-[113px] z-[5] bg-papier px-5 pt-5 pb-3 flex flex-col gap-4 border-b border-ardoise/10">
      <div className="flex items-center justify-between max-w-full mx-auto w-full">
        <div>
          <h1 className="text-base font-semibold text-encre">Dossiers</h1>
          <p className="text-xs text-ardoise/60 mt-0.5">
            {counts.tous} dossier{counts.tous !== 1 ? "s" : ""} · {FILTRES.find((f) => f.key === filtre)?.label}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-sauge font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-sauge animate-pulse" />
          Temps réel
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none max-w-full mx-auto w-full">
        {FILTRES.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltre(f.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtre === f.key
                ? "bg-encre text-white"
                : "bg-white border border-ardoise/15 text-ardoise hover:border-sauge/30 hover:text-sauge"
            }`}
          >
            {f.label}
            <span
              className={`text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ${
                filtre === f.key ? "bg-white/20 text-white" : "bg-ardoise/8 text-ardoise/60"
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>
      <div className="relative max-w-full mx-auto w-full">
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 text-ardoise/40"
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
  <input
    type="text"
    placeholder="Rechercher par nom..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-8 pr-4 py-2 rounded-xl border border-ardoise/15 bg-white text-sm text-encre placeholder:text-ardoise/40 outline-none focus:border-sauge/40 transition-colors"
  />
  {search && (
    <button
      onClick={() => setSearch("")}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-ardoise/40 hover:text-ardoise"
    >
      ✕
    </button>
  )}
</div>
    </div>

    <div className="flex-1 overflow-y-auto px-5 py-4">
      <div className="max-w-full mx-auto flex flex-col gap-3">
        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-ardoise/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M9 12h6M9 16h6M9 8h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-ardoise/50">Aucun dossier dans cette catégorie.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && filtered.map((d) => (
          <DossierPoolCard key={d.id} dossier={d} isNew={isNew(d)} />
        ))}
      </div>
    </div>
  </div>
);
}