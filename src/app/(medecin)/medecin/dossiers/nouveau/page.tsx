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

interface LocalPhoto {
  id: string;
  url: string;
  filename: string;
  checks: PhotoChecks | null;
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2">{children}</p>;
}

export default function NouveauDossierMedecinPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

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
        sexe: patientForm.sexe as "H" | "F" ,
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
    for (const file of Array.from(files)) {
      try {
        const { photo } = await uploadPhotoForPatient(dossierId, file);
        setPhotos((p) => [...p, { id: photo.id, url: photo.url, filename: file.name, checks: null }]);
        analyzePhoto(file).then((checks) => {
          setPhotos((p) => p.map((ph) => (ph.id === photo.id ? { ...ph, checks } : ph)));
        });
      } catch {
        // silently skip a failed file, keep others
      }
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
      router.push(`/medecin/dossiers/${dossierId}`);
    } catch (err: any) {
      setSubmitError(err.error || "Une erreur est survenue lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="Nouveau dossier"
        subtitle={`Étape ${step} sur 3`}
        onBack={() => (step === 1 ? router.push("/medecin/dashboard") : setStep(step - 1))}
      />

      <div className="p-5 max-w-full mx-auto pb-28">
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

            {uploading && <p className="text-sm text-ardoise text-center">Envoi en cours...</p>}

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
      </div>
    </div>
  );
}