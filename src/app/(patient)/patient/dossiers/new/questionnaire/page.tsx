"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import BodyZoneSelector from "@/components/patient/BodyZoneSelector";
import CriterionCard from "@/components/patient/CriterionCard";
import ChipGroup from "@/components/patient/ChipGroup";
import { submitDossier } from "@/lib/api/dossiers";
import { getDraftDossierId, clearDraftDossierId } from "@/lib/draftDossier";
import {
  ASYMETRIE_OPTIONS, BORDS_OPTIONS, COULEURS_OPTIONS, DIAMETRE_OPTIONS, EVOLUTION_OPTIONS,
  SYMPTOMES_OPTIONS, ANCIENNETE_OPTIONS, EXPOSITION_OPTIONS, PHOTOTYPE_OPTIONS,
  ANTECEDENTS_PERSONNELS_OPTIONS, ANTECEDENTS_FAM_OPTIONS, NAEVUS_OPTIONS,
} from "@/lib/dossierOptions";

function MiniLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2">
      {children}
      {required && <span className="text-urgent ml-0.5">*</span>}
    </p>
  );
}

export default function QuestionnaireStep() {
  const router = useRouter();
  const [dossierId, setDossierId] = useState<string | null>(null);

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = getDraftDossierId();
    if (!id) {
      router.push("/patient/dossiers/new/photos");
      return;
    }
    setDossierId(id);
  }, [router]);

  const isComplete =
    zones.length > 0 && asymetrie.length > 0 && bords.length > 0 && couleurs.length > 0 &&
    diametre.length > 0 && evolution.length > 0 && antecedentsFam.length > 0 &&
    antecedentsPersonnels.length > 0 && naevus.length > 0;

  async function handleSubmit() {
    if (!dossierId || !isComplete) {
      setError("Veuillez compléter la localisation et tous les critères ABCDE.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await submitDossier(dossierId, {
        zones,
        asymetrie: asymetrie[0],
        bords: bords[0],
        couleurs,
        diametre: diametre[0],
        evolution,
        antecedentsFamiliauxMelanome: antecedentsFam[0],
        symptomes,
        ancienneteObservation: anciennete[0] || null,
        expositionSolaire: exposition[0] || null,
        phototype: phototype[0] || null,
        antecedentsPersonnels,
        nombreNaevus: naevus[0],
      });
      clearDraftDossierId();
      router.push(`/patient/dossiers/${dossierId}`);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue lors de la soumission.");
    } finally {
      setLoading(false);
    }
  }

  if (!dossierId) return null;

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Questionnaire ABCDE" subtitle="Étape 2 sur 2" onBack={() => router.push("/patient/dossiers/new/photos")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4 pb-28">
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-sm font-medium text-encre mb-1">
            Localisation de la lésion<span className="text-urgent ml-0.5">*</span>
          </p>
          <p className="text-xs text-ardoise mb-4">Sélectionnez toutes les zones concernées.</p>
          <BodyZoneSelector selected={zones} onChange={setZones} />
        </div>

        <CriterionCard letter="A" title="Asymétrie" description="Divisez mentalement la lésion par un axe imaginaire."
          options={ASYMETRIE_OPTIONS} selected={asymetrie} onChange={setAsymetrie} />
        <CriterionCard letter="B" title="Bords" description="Observez attentivement les contours et limites de la lésion."
          options={BORDS_OPTIONS} selected={bords} onChange={setBords} />
        <CriterionCard letter="C" title="Couleur(s)" description="Sélectionnez toutes les teintes présentes."
          options={COULEURS_OPTIONS} selected={couleurs} onChange={setCouleurs} multi />
        <CriterionCard letter="D" title="Diamètre" description="Estimez la plus grande dimension. Référence : gomme de crayon ≈ 6 mm."
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
          <p className="text-sm font-medium text-encre -mb-1">Facteurs de risque</p>
          <div>
            <MiniLabel required>Antécédents personnels</MiniLabel>
            <ChipGroup options={ANTECEDENTS_PERSONNELS_OPTIONS} selected={antecedentsPersonnels} onChange={setAntecedentsPersonnels} multi />
          </div>
          <div>
            <MiniLabel required>Antécédents familiaux de mélanome</MiniLabel>
            <ChipGroup options={ANTECEDENTS_FAM_OPTIONS} selected={antecedentsFam} onChange={setAntecedentsFam} />
          </div>
          <div>
            <MiniLabel required>Nombre de nævus</MiniLabel>
            <ChipGroup options={NAEVUS_OPTIONS} selected={naevus} onChange={setNaevus} />
          </div>
        </div>

        {!isComplete && (
          <p className="text-xs text-ardoise text-center">Veuillez compléter la localisation et tous les critères ABCDE.</p>
        )}
        {error && <p className="text-sm text-urgent text-center">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-papier/95 backdrop-blur border-t border-ardoise/10 p-4">
        <div className="max-w-full mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            className="w-full rounded-full bg-sauge text-white text-sm font-medium py-3.5 disabled:bg-ardoise/30 disabled:cursor-not-allowed hover:bg-sauge/90 transition-colors"
          >
            {loading ? "Envoi en cours..." : "Soumettre la demande d'évaluation"}
          </button>
        </div>
      </div>
    </div>
  );
}