"use client";

import { useEffect, useMemo, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import DossierStatusCard from "@/components/patient/DossierStatusCard";
import { listMyDossiers } from "@/lib/api/dossiers";
import { Dossier } from "@/lib/types";
import { STATUS_FILTERS, DossierStatus } from "@/lib/dossierStatus";

type DateFilter = "TOUS" | "7J" | "30J" | "ANNEE";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "TOUS", label: "Toutes les dates" },
  { value: "7J", label: "7 derniers jours" },
  { value: "30J", label: "30 derniers jours" },
  { value: "ANNEE", label: "Cette année" },
];

function isWithinDateFilter(dateStr: string, filter: DateFilter) {
  if (filter === "TOUS") return true;
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / 86_400_000;
  if (filter === "7J") return diffDays <= 7;
  if (filter === "30J") return diffDays <= 30;
  if (filter === "ANNEE") return date.getFullYear() === now.getFullYear();
  return true;
}

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-ardoise/10 bg-white px-4 py-3.5 flex items-center gap-3 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-ardoise/10 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 bg-ardoise/10 rounded" />
            <div className="h-2.5 w-44 bg-ardoise/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PatientDossiersHistory() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DossierStatus | "TOUS">("TOUS");
  const [dateFilter, setDateFilter] = useState<DateFilter>("TOUS");

  useEffect(() => {
    listMyDossiers()
      .then((data) => setDossiers(data.dossiers))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return dossiers
      .filter((d) => statusFilter === "TOUS" || d.statut === statusFilter)
      .filter((d) => isWithinDateFilter(d.createdAt, dateFilter))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [dossiers, statusFilter, dateFilter]);

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="Mes analyses"
        subtitle={`${dossiers.length} dossier${dossiers.length !== 1 ? "s" : ""} au total`}
        onBack={() => (window.location.href = "/patient/dashboard")}
      />

      <div className="p-5 flex flex-col gap-4 max-w-full mx-auto">
       
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${
                statusFilter === f.value
                  ? "bg-sauge text-white border-sauge"
                  : "bg-white text-ardoise border-ardoise/15 hover:border-ardoise/30"
              }`}
            >
              {f.label}
            </button>
          ))}
            <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="self-start rounded-lg border border-ardoise/15 bg-white text-xs text-ardoise px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sauge"
        >
          {DATE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        </div>

      

        <div className="flex flex-col gap-3 mt-1">
          {loading && <HistorySkeleton />}
          {!loading && filtered.length === 0 && (
            <p className="text-sm text-ardoise/70 text-center py-8">
              Aucun dossier ne correspond à ces filtres.
            </p>
          )}
          {!loading && filtered.map((d) => <DossierStatusCard key={d.id} dossier={d} />)}
        </div>
      </div>
    </div>
  );
}