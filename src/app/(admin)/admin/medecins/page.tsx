"use client";

import { useEffect, useState, useCallback } from "react";
import StatutBadge from "@/components/admin/StatutBadge";
import {
  listAllMedecins, validateMedecin, rejectMedecin, setReferencee, deactivateMedecin, reactivateMedecin,
} from "@/lib/api/adminMedecins";
import { Medecin } from "@/lib/types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

type Filtre = "TOUS" | "EN_ATTENTE" | "ACTIF" | "REJETE" | "DESACTIVE";

const FILTRES: { key: Filtre; label: string }[] = [
  { key: "TOUS", label: "Tous" },
  { key: "EN_ATTENTE", label: "En attente" },
  { key: "ACTIF", label: "Actifs" },
  { key: "REJETE", label: "Rejetés" },
  { key: "DESACTIVE", label: "Désactivés" },
];

function MedecinRow({ medecin, onChanged }: { medecin: Medecin; onChanged: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [motif, setMotif] = useState("");
  const [showMotifFor, setShowMotifFor] = useState<"reject" | "deactivate" | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleValidate() {
    setBusy(true);
    await validateMedecin(medecin.id).catch(() => {});
    setBusy(false);
    onChanged();
  }

  async function handleReject() {
    if (!motif.trim()) return;
    setBusy(true);
    await rejectMedecin(medecin.id, motif).catch(() => {});
    setBusy(false);
    setShowMotifFor(null);
    setMotif("");
    onChanged();
  }

  async function handleDeactivate() {
    setBusy(true);
    await deactivateMedecin(medecin.id, motif || undefined).catch(() => {});
    setBusy(false);
    setShowMotifFor(null);
    setMotif("");
    onChanged();
  }

  async function handleReactivate() {
    setBusy(true);
    await reactivateMedecin(medecin.id).catch(() => {});
    setBusy(false);
    onChanged();
  }

  async function handleToggleReferencee() {
    setBusy(true);
    await setReferencee(medecin.id, !medecin.referencee).catch(() => {});
    setBusy(false);
    onChanged();
  }

  return (
    <div className="bg-white rounded-2xl border  border-ardoise/10 overflow-hidden">
      <button onClick={() => setExpanded((v) => !v)} className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-sauge-clair/20 transition-colors">
        <div className="w-10 h-10 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
            <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
            <circle cx="19" cy="17" r="2.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0 ">
          <p className="text-sm font-medium text-encre">Dr. {medecin.nomComplet}</p>
          <p className="text-xs text-ardoise">{medecin.specialite} · RPPS {medecin.rpps}</p>
        </div>
        <StatutBadge statut={medecin.statut} />
        {medecin.referencee && (
          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-sauge text-white">Référencé</span>
        )}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`text-ardoise/50 transition-transform ${expanded ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-ardoise/8 pt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <p className="text-ardoise">Email : <span className="text-encre">{medecin.email}</span></p>
            <p className="text-ardoise">Téléphone : <span className="text-encre">{medecin.telephone}</span></p>
            <p className="text-ardoise">Cabinet : <span className="text-encre">{medecin.adresseCabinet || "—"}</span></p>
            <p className="text-ardoise">Email vérifié : <span className="text-encre">{medecin.emailVerified ? "Oui" : "Non"}</span></p>
          </div>
          {medecin.motifRejet && <p className="text-xs text-urgent-doux">Motif de rejet : {medecin.motifRejet}</p>}
          {medecin.motifDesactivation && <p className="text-xs text-urgent-doux">Motif de désactivation : {medecin.motifDesactivation}</p>}

          {showMotifFor && (
            <div className="flex flex-col gap-2">
              <textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder={showMotifFor === "reject" ? "Motif du rejet..." : "Motif de désactivation (facultatif)..."}
                rows={2}
                className="rounded-lg border border-ardoise/25 bg-white px-3 py-2 text-sm outline-none focus:border-sauge"
              />
              <div className="flex gap-2">
                <button
                  onClick={showMotifFor === "reject" ? handleReject : handleDeactivate}
                  disabled={busy || (showMotifFor === "reject" && !motif.trim())}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-urgent text-white disabled:opacity-50"
                >
                  Confirmer
                </button>
                <button onClick={() => { setShowMotifFor(null); setMotif(""); }} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-ardoise/10 text-ardoise">
                  Annuler
                </button>
              </div>
            </div>
          )}

          {!showMotifFor && (
            <div className="flex flex-wrap gap-2">
              {medecin.statut === "EN_ATTENTE" && (
                <>
                  <button onClick={handleValidate} disabled={busy} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sauge text-white hover:bg-sauge/90">
                    Valider
                  </button>
                  <button onClick={() => setShowMotifFor("reject")} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-urgent-fond text-urgent-doux hover:opacity-80">
                    Rejeter
                  </button>
                </>
              )}
              {medecin.statut === "ACTIF" && (
                <>
                  <button onClick={handleToggleReferencee} disabled={busy} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sauge-clair text-sauge hover:bg-sauge-clair/70">
                    {medecin.referencee ? "Retirer le référencement" : "Référencer"}
                  </button>
                  <button onClick={() => setShowMotifFor("deactivate")} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-urgent-fond text-urgent-doux hover:opacity-80">
                    Désactiver
                  </button>
                </>
              )}
              {medecin.statut === "DESACTIVE" && (
                <button onClick={handleReactivate} disabled={busy} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sauge text-white hover:bg-sauge/90">
                  Réactiver
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminMedecinsPage() {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState<Filtre>("TOUS");

  const load = useCallback(() => {
    setLoading(true);
    listAllMedecins()
      .then((data) => setMedecins(data.medecins))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = medecins.filter((m) => filtre === "TOUS" || m.statut === filtre);
  const counts: Record<Filtre, number> = {
    TOUS: medecins.length,
    EN_ATTENTE: medecins.filter((m) => m.statut === "EN_ATTENTE").length,
    ACTIF: medecins.filter((m) => m.statut === "ACTIF").length,
    REJETE: medecins.filter((m) => m.statut === "REJETE").length,
    DESACTIVE: medecins.filter((m) => m.statut === "DESACTIVE").length,
  };

  return (
      <div className="max-w-full mx-6">
    <AdminPageHeader title="Médecins" subtitle={`${medecins.length} médecin${medecins.length !== 1 ? "s" : ""} au total`} right={<AdminNotificationBell />} />

    <div className="px-8 ">
       <div className="flex gap-2 mb-5 overflow-x-auto">
        {FILTRES.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltre(f.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filtre === f.key ? "bg-sauge text-white" : "bg-white border border-ardoise/15 text-ardoise hover:border-sauge/30"
            }`}
          >
            {f.label}
            <span className={`text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center ${filtre === f.key ? "bg-white/20 text-white" : "bg-ardoise/10 text-ardoise/60"}`}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>
      </div>

      <div className="flex flex-col gap-2 px-5 py-3.5 ">
        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}
        {!loading && filtered.length === 0 && <p className="text-sm text-ardoise text-center py-8">Aucun médecin dans cette catégorie.</p>}
        {!loading && filtered.map((m) => <MedecinRow key={m.id} medecin={m} onChanged={load} />)}
      </div>
    </div>
  );
}