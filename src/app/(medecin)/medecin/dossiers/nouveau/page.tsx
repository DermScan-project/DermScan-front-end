"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DateOfBirthInput from "@/components/ui/DateOfBirthInput";
import PhotoChecklistRow from "@/components/patient/PhotoChecklistRow";
import BodyZoneSelector from "@/components/patient/BodyZoneSelector";
import CriterionCard from "@/components/patient/CriterionCard";
import ChipGroup from "@/components/patient/ChipGroup";
import { analyzePhoto, PhotoChecks } from "@/lib/photoChecks";
import {
  findOrCreatePatient, createDraftForPatient, uploadPhotoForPatient, submitForPatient,
} from "@/lib/api/medecinPatientDossier";
import {
  ASYMETRIE_OPTIONS, BORDS_OPTIONS, COULEURS_OPTIONS, DIAMETRE_OPTIONS, EVOLUTION_OPTIONS,
  SYMPTOMES_OPTIONS, ANCIENNETE_OPTIONS, EXPOSITION_OPTIONS, PHOTOTYPE_OPTIONS,
  ANTECEDENTS_PERSONNELS_OPTIONS, ANTECEDENTS_FAM_OPTIONS, NAEVUS_OPTIONS,
} from "@/lib/dossierOptions";
import { listActiveMedecins, sendMessage, MedecinContact } from "@/lib/api/messages";

interface LocalPhoto {
  id: string;
  url: string;
  filename: string;
  checks: PhotoChecks | null;
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2">{children}</p>;
}

const CHECK_LABELS_FR: Record<keyof PhotoChecks, string> = {
  luminosite: "luminosité",
  cadrage: "cadrage",
  nettete: "netteté",
  distance: "distance",
};

function failedChecksMessage(checks: PhotoChecks): string {
  const failed = (Object.keys(checks) as (keyof PhotoChecks)[]).filter((k) => !checks[k]);
  return failed.map((k) => CHECK_LABELS_FR[k]).join(", ");
}

export default function NouveauDossierMedecinPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: patient info
  const [patientForm, setPatientForm] = useState({
    prenom: "", nom: "", email: "", sexe: "", dateNaissance: "", telephone: "",
  });
  const [patientId, setPatientId] = useState<string | null>(null);
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState("");
  const [step1Loading, setStep1Loading] = useState(false);

  // Step 2: photos
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // Step 3: questionnaire
  const [zones, setZones] = useState<string[]>([]);
  const [asymetrie, setAsymetrie] = useState<string[]>([]);
  const [bords, setBords] = useState<string[]>([]);
  const [couleurs, setCouleurs] = useState<string[]>([]);
  const [diametre, setDiametre] = useState<string[]>([]);
  const [evolution, setEvolution] = useState<string[]>([]);
  const [symptomes, setSymptomes] = useState<string[]>([]);
  const [anciennete, setAnciennete] = useState<string[]>([]);
  const [exposition, setExposition] = useState<string[]>([]);
  const [phototype, setPhototype] = useState<string[]>([]);
  const [antecedentsPersonnels, setAntecedentsPersonnels] = useState<string[]>([]);
  const [antecedentsFam, setAntecedentsFam] = useState<string[]>([]);
  const [naevus, setNaevus] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Partage
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMedecins, setShareMedecins] = useState<MedecinContact[]>([]);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareSearch, setShareSearch] = useState("");
  const [shareSent, setShareSent] = useState<string | null>(null);

  function updatePatientField(field: string, value: string) {
    setPatientForm((f) => ({ ...f, [field]: value }));
  }

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    setStep1Error("");
    if (Object.values(patientForm).some((v) => !v)) {
      setStep1Error("Veuillez remplir tous les champs.");
      return;
    }
    setStep1Loading(true);
    try {
      const { patient } = await findOrCreatePatient({
        ...patientForm,
        sexe: patientForm.sexe as "H" | "F",
      });
      setPatientId(patient.id);
      const { dossier } = await createDraftForPatient(patient.id);
      setDossierId(dossier.id);
      setStep(2);
    } catch (err: any) {
      setStep1Error(err.error || "Une erreur est survenue.");
    } finally {
      setStep1Loading(false);
    }
  }

  async function handlePhotoFiles(files: FileList | null) {
    if (!files || !dossierId) return;
    setUploading(true);
    setPhotoError("");
    const rejected: string[] = [];

    for (const file of Array.from(files)) {
      let checks: PhotoChecks;
      try {
        checks = await analyzePhoto(file);
      } catch {
        rejected.push(`${file.name} (image illisible)`);
        continue;
      }

      const allPass = checks.luminosite && checks.cadrage && checks.nettete && checks.distance;
      if (!allPass) {
        rejected.push(`${file.name} (${failedChecksMessage(checks)})`);
        continue;
      }

      try {
        const { photo } = await uploadPhotoForPatient(dossierId, file);
        setPhotos((p) => [...p, { id: photo.id, url: photo.url, filename: file.name, checks }]);
      } catch {
        rejected.push(`${file.name} (échec de l'envoi)`);
      }
    }

    if (rejected.length > 0) {
      setPhotoError(`Photo(s) refusée(s), veuillez en choisir une autre : ${rejected.join(" · ")}`);
    }

    setUploading(false);
  }

  function goToStep3() {
    if (photos.length === 0) return;
    setStep(3);
  }

  async function handleFinalSubmit() {
    if (!dossierId) return;
    setSubmitError("");
    if (!zones.length || !asymetrie[0] || !bords[0] || !couleurs.length || !diametre[0] || !evolution.length || !antecedentsFam[0]) {
      setSubmitError("Veuillez compléter la localisation et tous les critères ABCDE.");
      return;
    }
    setSubmitting(true);
    try {
      await submitForPatient(dossierId, {
        zones, asymetrie: asymetrie[0], bords: bords[0], couleurs, diametre: diametre[0], evolution,
        antecedentsFamiliauxMelanome: antecedentsFam[0],
        symptomes, ancienneteObservation: anciennete[0] || null, expositionSolaire: exposition[0] || null,
        phototype: phototype[0] || null, antecedentsPersonnels, nombreNaevus: naevus[0] || null,
      });
      // Charger les médecins actifs en avance pour le modal
      const res = await listActiveMedecins();
      setShareMedecins(res.medecins);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.error || "Une erreur est survenue lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  }

  async function openShareModal() {
    setShowShareModal(true);
    setShareSent(null);
    setShareSearch("");
  }

  async function handleShare(medecinId: string) {
    if (!dossierId || shareLoading) return;
    setShareLoading(true);
    try {
      const lien = `${window.location.origin}/medecin/dossiers/${dossierId}`;
      await sendMessage(medecinId, `📋 Dossier partagé : ${lien}`);
      setShareSent(medecinId);
    } catch {}
    finally {
      setShareLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="Nouveau dossier"
        subtitle={submitted ? "Dossier créé" : `Étape ${step} sur 3`}
        onBack={() => {
          if (submitted) return;
          step === 1 ? router.push("/medecin/dashboard") : setStep(step - 1);
        }}
      />

      <div className="p-5 max-w-full mx-auto pb-28">

        {/* ── Écran de succès ── */}
        {submitted && (
          <div className="flex flex-col items-center gap-5 py-10">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1B7A3D" strokeWidth="1.8">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-base font-semibold text-encre">Dossier soumis avec succès</p>
              <p className="text-sm text-ardoise/60 mt-1">La demande d'évaluation a bien été enregistrée.</p>
            </div>

            <button
              onClick={openShareModal}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-encre text-white text-sm font-medium py-3.5 hover:bg-encre/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeLinecap="round" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeLinecap="round" />
              </svg>
              Partager avec un confrère
            </button>

            <button
              onClick={() => router.push(`/medecin/dossiers/${dossierId}`)}
              className="w-full flex items-center justify-center rounded-full border border-ardoise/20 bg-white text-sm font-medium text-encre py-3.5 hover:border-sauge/40 transition-colors"
            >
              Voir le dossier
            </button>

            <button
              onClick={() => router.push("/medecin/dashboard")}
              className="text-sm text-ardoise/50 hover:text-ardoise transition-colors"
            >
              Retour au Accueil
            </button>
          </div>
        )}

        {/* ── Steps ── */}
        {!submitted && (
          <>
            <div className="flex gap-1.5 mb-6 justify-center">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`h-1.5 rounded-full transition-all ${step === s ? "w-8 bg-sauge" : "w-4 bg-sauge-clair"}`} />
              ))}
            </div>

            {/* Step 1 — Patient info */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="bg-white rounded-2xl border border-ardoise/10 p-5 flex flex-col gap-4">
                <p className="text-sm font-medium text-encre -mb-1">Informations du patient</p>
                <p className="text-xs text-ardoise/70 -mt-2">
                  Si aucun compte n'existe pour cet email, un compte sera créé et le patient recevra un email pour l'activer.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Prénom" value={patientForm.prenom} onChange={(e) => updatePatientField("prenom", e.target.value)} required />
                  <Input label="Nom" value={patientForm.nom} onChange={(e) => updatePatientField("nom", e.target.value)} required />
                </div>
                <Input label="Email" type="email" value={patientForm.email} onChange={(e) => updatePatientField("email", e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">Sexe</label>
                    <select
                      className="rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre outline-none focus:border-sauge"
                      value={patientForm.sexe}
                      onChange={(e) => updatePatientField("sexe", e.target.value)}
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="H">Homme</option>
                      <option value="F">Femme</option>
                    </select>
                  </div>
                  <DateOfBirthInput value={patientForm.dateNaissance} onChange={(v) => updatePatientField("dateNaissance", v)} />
                </div>
                <Input label="Téléphone" placeholder="0612345678" value={patientForm.telephone} onChange={(e) => updatePatientField("telephone", e.target.value)} required />

                {step1Error && <p className="text-sm text-urgent">{step1Error}</p>}

                <Button type="submit" size="lg" fullWidth disabled={step1Loading}>
                  {step1Loading ? "Création..." : "Continuer"}
                </Button>
              </form>
            )}

            {/* Step 2 — Photos */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <label className="border-2 border-dashed border-ardoise/25 rounded-2xl py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-sauge/40 transition-colors bg-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                    <path d="M4 8a2 2 0 012-2h1.5l1-2h7l1 2H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                  <p className="text-sm font-medium text-encre">Ajouter des photographies</p>
                  <p className="text-xs text-ardoise">Sélection multiple</p>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handlePhotoFiles(e.target.files)} />
                </label>

                {uploading && <p className="text-sm text-ardoise text-center">Analyse et envoi en cours...</p>}
                {photoError && <p className="text-sm text-urgent text-center">{photoError}</p>}

                {photos.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {photos.map((p) => (
                      <PhotoChecklistRow
                        key={p.id}
                        filename={p.filename}
                        url={p.url}
                        checks={p.checks}
                        onRemove={() => setPhotos((prev) => prev.filter((ph) => ph.id !== p.id))}
                      />
                    ))}
                  </div>
                )}

                <Button onClick={goToStep3} disabled={photos.length === 0} size="lg" fullWidth>
                  Continuer vers le questionnaire
                </Button>
              </div>
            )}

            {/* Step 3 — Questionnaire */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
                  <p className="text-sm font-medium text-encre mb-1">Localisation de la lésion</p>
                  <p className="text-xs text-ardoise mb-4">Sélectionnez toutes les zones concernées.</p>
                  <BodyZoneSelector selected={zones} onChange={setZones} />
                </div>

                <CriterionCard letter="A" title="Asymétrie" description="Divisez mentalement la lésion par un axe imaginaire."
                  options={ASYMETRIE_OPTIONS} selected={asymetrie} onChange={setAsymetrie} />
                <CriterionCard letter="B" title="Bords" description="Observez attentivement les contours et limites de la lésion."
                  options={BORDS_OPTIONS} selected={bords} onChange={setBords} />
                <CriterionCard letter="C" title="Couleur(s)" description="Sélectionnez toutes les teintes présentes."
                  options={COULEURS_OPTIONS} selected={couleurs} onChange={setCouleurs} multi />
                <CriterionCard letter="D" title="Diamètre" description="Estimez la plus grande dimension."
                  options={DIAMETRE_OPTIONS} selected={diametre} onChange={setDiametre} />
                <CriterionCard letter="E" title="Évolution" description="Cochez tous les changements observés récemment."
                  options={EVOLUTION_OPTIONS} selected={evolution} onChange={setEvolution} multi />

                <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
                  <p className="text-sm font-medium text-encre mb-3">Symptômes associés</p>
                  <ChipGroup options={SYMPTOMES_OPTIONS} selected={symptomes} onChange={setSymptomes} multi />
                </div>

                <div className="bg-white rounded-2xl border border-ardoise/10 p-5 flex flex-col gap-4">
                  <p className="text-sm font-medium text-encre -mb-1">Ancienneté et contexte</p>
                  <div>
                    <MiniLabel>Durée d'observation</MiniLabel>
                    <ChipGroup options={ANCIENNETE_OPTIONS} selected={anciennete} onChange={setAnciennete} />
                  </div>
                  <div>
                    <MiniLabel>Exposition solaire habituelle</MiniLabel>
                    <ChipGroup options={EXPOSITION_OPTIONS} selected={exposition} onChange={setExposition} />
                  </div>
                  <div>
                    <MiniLabel>Phototype cutané</MiniLabel>
                    <ChipGroup options={PHOTOTYPE_OPTIONS} selected={phototype} onChange={setPhototype} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-ardoise/10 p-5 flex flex-col gap-4">
                  <p className="text-sm font-medium text-encre -mb-1">
                    Facteurs de risque
                    <span className="text-urgent ml-0.5">*</span>
                  </p>
                  <div>
                    <MiniLabel>Antécédents personnels</MiniLabel>
                    <ChipGroup options={ANTECEDENTS_PERSONNELS_OPTIONS} selected={antecedentsPersonnels} onChange={setAntecedentsPersonnels} multi />
                  </div>
                  <div>
                    <MiniLabel>Antécédents familiaux de mélanome</MiniLabel>
                    <ChipGroup options={ANTECEDENTS_FAM_OPTIONS} selected={antecedentsFam} onChange={setAntecedentsFam} />
                  </div>
                  <div>
                    <MiniLabel>Nombre de nævus</MiniLabel>
                    <ChipGroup options={NAEVUS_OPTIONS} selected={naevus} onChange={setNaevus} />
                  </div>
                </div>

                {submitError && <p className="text-sm text-urgent text-center">{submitError}</p>}

                <Button onClick={handleFinalSubmit} disabled={submitting} size="lg" fullWidth>
                  {submitting ? "Envoi..." : "Soumettre la demande d'évaluation"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal de partage ── */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-5 pb-10 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-encre">Partager le dossier</p>
              <button onClick={() => setShowShareModal(false)} className="text-ardoise/50 hover:text-urgent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ardoise/40" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un praticien..."
                value={shareSearch}
                onChange={(e) => setShareSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-ardoise/15 bg-papier text-sm text-encre placeholder:text-ardoise/40 outline-none focus:border-sauge/40"
              />
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {shareMedecins.length === 0 && (
                <p className="text-xs text-ardoise/40 text-center py-6">Aucun praticien actif</p>
              )}
              {shareMedecins
                .filter((m) => m.nomComplet.toLowerCase().includes(shareSearch.toLowerCase()))
                .map((m) => {
                  const sent = shareSent === m.id;
                  return (
                    <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-ardoise/10 bg-papier">
                      <div className="w-9 h-9 rounded-full bg-sauge-clair flex items-center justify-center shrink-0 text-xs font-medium text-sauge">
                        {m.nomComplet.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-encre truncate">Dr. {m.nomComplet}</p>
                        <p className="text-xs text-ardoise/50">{m.specialite}</p>
                      </div>
                      <button
                        onClick={() => handleShare(m.id)}
                        disabled={sent || shareLoading}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          sent
                            ? "bg-green-100 text-green-700"
                            : "bg-encre text-white hover:bg-encre/80 disabled:opacity-50"
                        }`}
                      >
                        {sent ? "✓ Envoyé" : "Envoyer"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}