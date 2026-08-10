"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import PhotoLightbox from "@/components/patient/PhotoLightbox";
import PdfDrawer from "@/components/patient/PdfDrawer";
import DocumentDrawer from "@/components/medecin/DocumentDrawer";
import AvisSelector from "@/components/medecin/AvisCard";
import Button from "@/components/ui/Button";
import { labelZones } from "@/lib/labels";
import {
  ASYMETRIE_LABELS, BORDS_LABELS, COULEURS_LABELS, DIAMETRE_LABELS, EVOLUTION_LABELS,
  SYMPTOMES_LABELS, ANCIENNETE_LABELS, EXPOSITION_LABELS, PHOTOTYPE_LABELS,
  ANTECEDENTS_PERSONNELS_LABELS, ANTECEDENTS_FAM_LABELS, NAEVUS_LABELS, label, labelList,
} from "@/lib/dossierLabels";
import {
  getMedecinDossierDetail,
  claimDossier,
  evaluateDossier,
  fetchMedecinDossierPdfBlob,
  getMedecinDocumentDownloadUrl,
} from "@/lib/api/medecinDossiers";
import {
  downloadViaSignedUrl,
} from "@/lib/downloadFile";
import { DOCUMENT_CATEGORIES } from "@/lib/documentCategories";

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
      <span className="text-xs text-ardoise/70 w-36 shrink-0">{l}</span>
      <span className="text-sm text-encre">{value}</span>
    </div>
  );
}

export default function MedecinDossierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const cameFromLookup = searchParams.get("from") === "lookup";

  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ id: string; nom: string } | null>(null);

  const [avis, setAvis] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await claimDossier(id).catch(() => {});
        const data = await getMedecinDossierDetail(id);
        setDossier(data.dossier);
      } catch (err: any) {
        setError(err.error || "Dossier introuvable.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleBack() {
    if (cameFromLookup) {
      router.back();
    } else {
      router.push("/medecin/dossiers");
    }
  }

  async function handleSubmit() {
    if (!avis) {
      setSubmitError("Veuillez sélectionner un avis médical.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      await evaluateDossier(id, avis, commentaire || undefined);
      router.push("/medecin/dossiers");
    } catch (err: any) {
      setSubmitError(err.error || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-8 text-sm text-ardoise text-center">Chargement...</p>;
  if (error) return <p className="p-8 text-sm text-urgent text-center">{error}</p>;
  if (!dossier) return null;

  const age = dossier.patient?.dateNaissance ? calculateAge(dossier.patient.dateNaissance) : null;
  const isEvaluated = dossier.statut === "EVALUE";

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title={`${dossier.patient?.prenom} ${dossier.patient?.nom}${age ? `, ${age} ans` : ""}`}
        subtitle="Reçu à l'instant"
        onBack={handleBack}
      />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4 pb-10">
        <div>
          <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2">
            Photographies ({dossier.photos?.length || 0})
          </p>
          <PhotoLightbox photos={dossier.photos || []} />
        </div>

{dossier.patient?.documents?.length > 0 && (
  <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
    <p className="text-sm font-medium text-encre mb-3">
      Synthèse médicale ({dossier.patient.documents.length})
    </p>

    <div className="flex flex-col gap-4">
      {DOCUMENT_CATEGORIES.map((cat) => {
        const docsInCategory = dossier.patient.documents.filter((d: any) => d.categorie === cat.key);
        if (docsInCategory.length === 0) return null;

        return (
          <div key={cat.key}>
            <p className="text-xs font-medium text-encre mb-2">{cat.label} ({docsInCategory.length})</p>
            <div className="flex flex-col gap-2">
              {docsInCategory.map((doc: any) => (
                <div key={doc.id} className="flex items-center gap-3 rounded-xl bg-papier px-3.5 py-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6" className="shrink-0">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
                    <path d="M14 2v6h6" strokeLinejoin="round" />
                  </svg>
                  <button
                    onClick={() => setSelectedDoc({ id: doc.id, nom: doc.nom })}
                    className="flex-1 text-left text-sm text-encre hover:text-sauge truncate"
                  >
                    {doc.nom}
                  </button>
                  <button
                    onClick={() => downloadViaSignedUrl(() => getMedecinDocumentDownloadUrl(doc.id), doc.nom)}
                    className="text-ardoise/50 hover:text-sauge shrink-0"
                    aria-label="Télécharger"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                      <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


        <div className="bg-white rounded-2xl border border-ardoise/10 px-5 py-1">
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
          <div className="rounded-2xl bg-sauge-clair/40 border border-sauge-clair px-5 py-4">
            <p className="text-xs text-sauge font-medium">Score ABCDE calculé automatiquement</p>
            <p className="font-display text-xl text-sauge">{dossier.scoreABCDE}/5 · {dossier.niveauPriorite?.replace(/_/g, " ")}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-sm font-medium text-encre mb-3">Évaluation médicale</p>

          {isEvaluated ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center py-4 gap-2">
                <div className="w-10 h-10 rounded-full bg-sauge-clair flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-encre">Évaluation enregistrée</p>
                <p className="text-xs text-ardoise">Message automatique envoyé au patient</p>
              </div>

              <button
                onClick={() => setPdfOpen(true)}
                className="flex items-center justify-between rounded-xl bg-papier border border-ardoise/10 px-4 py-3.5 hover:border-sauge/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
                      <path d="M14 2v6h6" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-encre">Compte-rendu PDF envoyé au patient</span>
                </div>
                <span className="text-xs text-sauge font-medium">Voir →</span>
              </button>
            </div>
          ) : (
            <>
              <AvisSelector value={avis} onChange={setAvis} />

              <div className="mt-4">
                <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise mb-2 block">
                  Message complémentaire (facultatif)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Ajoutez des précisions ou recommandations pour le patient..."
                  className="w-full rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre placeholder:text-ardoise/50 outline-none focus:border-sauge focus:ring-2 focus:ring-sauge/15 resize-none"
                />
              </div>

              {submitError && <p className="text-sm text-urgent mt-3">{submitError}</p>}

              <Button onClick={handleSubmit} disabled={submitting || !avis} fullWidth size="lg" className="mt-4">
                {submitting ? "Envoi..." : "Confirmer et envoyer au patient"}
              </Button>
            </>
          )}
        </div>
      </div>

      <PdfDrawer dossierId={id} open={pdfOpen} onClose={() => setPdfOpen(false)} fetchPdf={fetchMedecinDossierPdfBlob} />
      <DocumentDrawer
        docId={selectedDoc?.id ?? null}
        docNom={selectedDoc?.nom ?? null}
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}