"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PhotoLightbox from "@/components/patient/PhotoLightbox";
import PdfDrawer from "@/components/patient/PdfDrawer";
import { labelZones } from "@/lib/labels";
import {
  ASYMETRIE_LABELS, BORDS_LABELS, COULEURS_LABELS, DIAMETRE_LABELS, EVOLUTION_LABELS,
  SYMPTOMES_LABELS, ANCIENNETE_LABELS, EXPOSITION_LABELS, PHOTOTYPE_LABELS,
  ANTECEDENTS_PERSONNELS_LABELS, ANTECEDENTS_FAM_LABELS, NAEVUS_LABELS, label, labelList,
} from "@/lib/dossierLabels";
import { getAdminDossierDetail, fetchAdminDossierPdfBlob } from "@/lib/api/adminDossiers";

function calculateAge(dateNaissance: string) {
  const today = new Date();
  const birth = new Date(dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function Row({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-ardoise/8 last:border-0">
      <span className="text-xs text-ardoise/70 w-40 shrink-0">{l}</span>
      <span className="text-sm text-encre">{value}</span>
    </div>
  );
}

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: "En attente", EN_COURS: "En cours d'évaluation", EVALUE: "Évalué",
};

const AVIS_LABELS: Record<string, string> = {
  CONSULTATION_URGENTE: "Urgence (consultation sous 3 mois)",
  CONSULTATION_RECOMMANDEE: "Urgence modérée (consultation sous 6 mois)",
  PAS_URGENCE: "Pas urgent (consultation dans l'année)",
};

export default function AdminDossierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    getAdminDossierDetail(id)
      .then((data) => setDossier(data.dossier))
      .catch((err) => setError(err.error || "Dossier introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-sm text-ardoise">Chargement...</p>;
  if (error) return <p className="p-8 text-sm text-urgent">{error}</p>;
  if (!dossier) return null;

  const age = dossier.patient?.dateNaissance ? calculateAge(dossier.patient.dateNaissance) : null;
  const isEvaluated = dossier.statut === "EVALUE";

  return (
    <div className="p-8 max-w-full">
      <button
  onClick={() => router.push("/admin/dossiers")}
  className="sticky top-0 z-50 flex items-center gap-1.5 text-sm text-ardoise hover:text-sauge bg-papier/90 backdrop-blur-sm px-3 py-1.5 -mx-3 rounded-lg mb-4 w-full"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  Retour aux dossiers
</button>

      <h1 className="font-display text-2xl text-sauge mb-1">
        {dossier.patient?.prenom} {dossier.patient?.nom}{age ? `, ${age} ans` : ""}
      </h1>
      <p className="text-sm text-ardoise mb-6">
        {STATUT_LABELS[dossier.statut]} · Créé le {new Date(dossier.createdAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-xs font-medium text-ardoise/70 uppercase tracking-wide mb-2">Patient</p>
          <p className="text-sm text-encre">{dossier.patient?.prenom} {dossier.patient?.nom}</p>
          <p className="text-xs text-ardoise mt-1">{dossier.patient?.email}</p>
          <p className="text-xs text-ardoise">{dossier.patient?.telephone}</p>
          <p className="text-xs text-ardoise">Sexe : {dossier.patient?.sexe}</p>
        </div>
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-xs font-medium text-ardoise/70 uppercase tracking-wide mb-2">Médecin évaluateur</p>
          {dossier.medecinEvaluateur ? (
            <>
              <p className="text-sm text-encre">Dr. {dossier.medecinEvaluateur.nomComplet}</p>
              <p className="text-xs text-ardoise mt-1">{dossier.medecinEvaluateur.specialite}</p>
              <p className="text-xs text-ardoise">{dossier.medecinEvaluateur.email}</p>
            </>
          ) : (
            <p className="text-xs text-ardoise/60">Pas encore évalué</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2">
          Photographies ({dossier.photos?.length || 0})
        </p>
        <PhotoLightbox photos={dossier.photos || []} />
      </div>

      <div className="bg-white rounded-2xl border border-ardoise/10 px-5 py-1 mb-4">
        <p className="text-sm font-medium text-encre pt-3 pb-1">Données anamnestiques</p>
        <Row label="Localisation" value={labelZones(dossier.zones)} />
        <Row label="A — Asymétrie" value={label(ASYMETRIE_LABELS, dossier.asymetrie)} />
        <Row label="B — Bords" value={label(BORDS_LABELS, dossier.bords)} />
        <Row label="C — Couleurs" value={labelList(COULEURS_LABELS, dossier.couleurs)} />
        <Row label="D — Diamètre" value={label(DIAMETRE_LABELS, dossier.diametre)} />
        <Row label="E — Évolution" value={labelList(EVOLUTION_LABELS, dossier.evolution)} />
        <Row label="Symptômes" value={labelList(SYMPTOMES_LABELS, dossier.symptomes)} />
        <Row label="Ancienneté" value={label(ANCIENNETE_LABELS, dossier.ancienneteObservation)} />
        <Row label="Exposition" value={label(EXPOSITION_LABELS, dossier.expositionSolaire)} />
        <Row label="Phototype" value={label(PHOTOTYPE_LABELS, dossier.phototype)} />
        <Row label="ATCD personnels" value={labelList(ANTECEDENTS_PERSONNELS_LABELS, dossier.antecedentsPersonnels)} />
        <Row label="ATCD mélanome familial" value={label(ANTECEDENTS_FAM_LABELS, dossier.antecedentsFamiliauxMelanome)} />
        <Row label="Nævus" value={label(NAEVUS_LABELS, dossier.nombreNaevus)} />
      </div>

      {dossier.scoreABCDE !== null && (
        <div className="rounded-2xl bg-sauge-clair/40 border border-sauge-clair px-5 py-4 mb-4">
          <p className="text-xs text-sauge font-medium">Score ABCDE</p>
          <p className="font-display text-xl text-sauge">{dossier.scoreABCDE}/5 · {dossier.niveauPriorite?.replace(/_/g, " ")}</p>
        </div>
      )}

      {isEvaluated && (
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-sm font-medium text-encre mb-3">Évaluation médicale</p>
          <p className="text-sm text-encre font-medium mb-1">{AVIS_LABELS[dossier.avisMedical] || dossier.avisMedical}</p>
          <p className="text-sm text-ardoise leading-relaxed">{dossier.messageAutomatique}</p>
          {dossier.commentaireMedecin && (
            <p className="text-sm text-encre italic mt-3">« {dossier.commentaireMedecin} »</p>
          )}
          <p className="text-xs text-ardoise mt-3">
            Évalué le {new Date(dossier.evaluatedAt).toLocaleString("fr-FR")}
          </p>

          <button
            onClick={() => setPdfOpen(true)}
            className="mt-4 flex items-center justify-between w-full rounded-xl bg-papier border border-ardoise/10 px-4 py-3.5 hover:border-sauge/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
                  <path d="M14 2v6h6" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-sm font-medium text-encre">Compte-rendu PDF</span>
            </div>
            <span className="text-xs text-sauge font-medium">Voir →</span>
          </button>
        </div>
      )}

      <PdfDrawer dossierId={id} open={pdfOpen} onClose={() => setPdfOpen(false)} fetchPdf={fetchAdminDossierPdfBlob} />
    </div>
  );
}