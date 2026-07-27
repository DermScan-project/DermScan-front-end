"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAllDossiers, exportDossiersCsv } from "@/lib/api/adminDossiers";
import { labelZones } from "@/lib/labels";
import { Dossier } from "@/lib/types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

type StatutFiltre = "TOUS" | "EN_ATTENTE" | "EN_COURS" | "EVALUE";
type PrioriteFiltre = "TOUS" | "URGENT" | "MOYENNEMENT_URGENT" | "PAS_URGENT";

export default function AdminDossiersPage() {
  const [dossiers, setDossiers] = useState<(Dossier & { patient: any; medecinEvaluateur: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [statutFiltre, setStatutFiltre] = useState<StatutFiltre>("TOUS");
  const [prioriteFiltre, setPrioriteFiltre] = useState<PrioriteFiltre>("TOUS");
  const [exporting, setExporting] = useState(false);
 const [exportOpen, setExportOpen] = useState(false);
const [exportDebut, setExportDebut] = useState("");
const [exportFin, setExportFin] = useState("");


  function load() {
    setLoading(true);
    listAllDossiers({
      statut: statutFiltre !== "TOUS" ? statutFiltre : undefined,
      niveauPriorite: prioriteFiltre !== "TOUS" ? prioriteFiltre : undefined,
    })
      .then((data) => setDossiers(data.dossiers as any))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statutFiltre, prioriteFiltre]);

 async function handleExport() {
  setExporting(true);
  try {
    const blob = await exportDossiersCsv(exportDebut || undefined, exportFin || undefined);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dermscan-dossiers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  } catch {
    alert("Échec de l'export.");
  } finally {
    setExporting(false);
  }
} 

  const statutBadge = (statut: string) => {
    const map: Record<string, string> = {
      EN_ATTENTE: "bg-[#FBF3DD] text-modere",
      EN_COURS: "bg-[#FBF3DD] text-modere",
      EVALUE: "bg-sauge-clair text-sauge",
    };
    return map[statut] || "bg-ardoise/10 text-ardoise";
  };

  const prioriteBadge = (p: string | null) => {
    if (p === "URGENT") return "bg-urgent-fond text-urgent-doux";
    if (p === "MOYENNEMENT_URGENT") return "bg-[#FBF3DD] text-modere";
    return "bg-sauge-clair text-sauge";
  };

  return (
    <div className="max-w-full mx-6">
    <AdminPageHeader
      title="Dossiers"
      subtitle={`${dossiers.length} dossier${dossiers.length !== 1 ? "s" : ""}`}
      right={
       <div className="relative flex items-center gap-3">
  <button onClick={() => setExportOpen((v) => !v)} className="text-xs font-medium px-4 py-2 rounded-full bg-sauge text-white hover:bg-sauge/90">
    Exporter en CSV
  </button>
  <AdminNotificationBell />

  {exportOpen && (
    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-ardoise/10 shadow-lg p-4 z-20">
      <p className="text-xs font-medium text-encre mb-3">Filtrer par période (facultatif)</p>
      <div className="flex flex-col gap-2 mb-3">
        <input type="date" value={exportDebut} onChange={(e) => setExportDebut(e.target.value)} className="rounded-lg border border-ardoise/20 px-3 py-1.5 text-xs" placeholder="Du" />
        <input type="date" value={exportFin} onChange={(e) => setExportFin(e.target.value)} className="rounded-lg border border-ardoise/20 px-3 py-1.5 text-xs" placeholder="Au" />
      </div>
      <button onClick={handleExport} disabled={exporting} className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-sauge text-white hover:bg-sauge/90 disabled:opacity-50">
        {exporting ? "Export..." : "Télécharger le CSV"}
      </button>
    </div>
  )}
</div>
      }
    />
<div className="p-8 pt-6">
      <div className="flex gap-3 mb-5">
        <select
          value={statutFiltre}
          onChange={(e) => setStatutFiltre(e.target.value as StatutFiltre)}
          className="rounded-lg border border-ardoise/20 bg-white px-3 py-2 text-sm text-ardoise focus:outline-none focus:border-sauge"
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="EN_ATTENTE">En attente</option>
          <option value="EN_COURS">En cours</option>
          <option value="EVALUE">Évalué</option>
        </select>
        <select
          value={prioriteFiltre}
          onChange={(e) => setPrioriteFiltre(e.target.value as PrioriteFiltre)}
          className="rounded-lg border border-ardoise/20 bg-white px-3 py-2 text-sm text-ardoise focus:outline-none focus:border-sauge"
        >
          <option value="TOUS">Toutes priorités</option>
          <option value="URGENT">Urgent</option>
          <option value="MOYENNEMENT_URGENT">Modéré</option>
          <option value="PAS_URGENT">Faible</option>
        </select>
      </div>
</div>
      <div className="flex flex-col gap-2">
        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}
        {!loading && dossiers.length === 0 && <p className="text-sm text-ardoise text-center py-8">Aucun dossier.</p>}
        {!loading && dossiers.map((d) => {
          const zonesLabel = labelZones(d.zones).replace(/Face : |Dos : /g, "").replace("  |  ", ", ");
          return (
            <Link
              key={d.id}
              href={`/admin/dossiers/${d.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-ardoise/10 px-5 py-3.5 hover:border-sauge/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-encre">
                  {d.patient?.prenom} {d.patient?.nom}
                  {d.medecinEvaluateur && <span className="text-ardoise font-normal"> · évalué par Dr. {d.medecinEvaluateur.nomComplet}</span>}
                </p>
                <p className="text-xs text-ardoise truncate">{zonesLabel}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statutBadge(d.statut)}`}>{d.statut.replace(/_/g, " ")}</span>
              {d.niveauPriorite && (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${prioriteBadge(d.niveauPriorite)}`}>{d.niveauPriorite.replace(/_/g, " ")}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}