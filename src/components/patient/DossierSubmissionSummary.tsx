import { Dossier } from "@/lib/types";
import { labelZones } from "@/lib/labels";
import PhotoLightbox from "./PhotoLightbox";
import {
  ASYMETRIE_LABELS, BORDS_LABELS, COULEURS_LABELS, DIAMETRE_LABELS, EVOLUTION_LABELS,
  SYMPTOMES_LABELS, ANCIENNETE_LABELS, EXPOSITION_LABELS, PHOTOTYPE_LABELS,
  ANTECEDENTS_PERSONNELS_LABELS, ANTECEDENTS_FAM_LABELS, NAEVUS_LABELS, label, labelList,
} from "@/lib/dossierLabels";

function Row({ label: l, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-ardoise/8 last:border-0">
      <span className="text-xs text-ardoise/70 shrink-0">{l}</span>
      <span className="text-sm text-encre text-right">{value}</span>
    </div>
  );
}

export default function DossierSubmissionSummary({ dossier }: { dossier: Dossier }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium mb-2 text-left">
          Photographies ({dossier.photos.length})
        </p>
        <PhotoLightbox photos={dossier.photos} />
      </div>

      <div className="bg-white rounded-2xl border border-ardoise/10 px-5 py-1 text-left">
        <Row label="Localisation" value={labelZones(dossier.zones)} />
        <Row label="A — Asymétrie" value={label(ASYMETRIE_LABELS, dossier.asymetrie)} />
        <Row label="B — Bords" value={label(BORDS_LABELS, dossier.bords)} />
        <Row label="C — Couleur(s)" value={labelList(COULEURS_LABELS, dossier.couleurs)} />
        <Row label="D — Diamètre" value={label(DIAMETRE_LABELS, dossier.diametre)} />
        <Row label="E — Évolution" value={labelList(EVOLUTION_LABELS, dossier.evolution)} />
      </div>

      <div className="bg-white rounded-2xl border border-ardoise/10 px-5 py-1 text-left">
        <Row label="Symptômes" value={labelList(SYMPTOMES_LABELS, dossier.symptomes)} />
        <Row label="Ancienneté" value={label(ANCIENNETE_LABELS, dossier.ancienneteObservation)} />
        <Row label="Exposition solaire" value={label(EXPOSITION_LABELS, dossier.expositionSolaire)} />
        <Row label="Phototype" value={label(PHOTOTYPE_LABELS, dossier.phototype)} />
        <Row label="Antécédents personnels" value={labelList(ANTECEDENTS_PERSONNELS_LABELS, dossier.antecedentsPersonnels)} />
        <Row label="ATCD familial mélanome" value={label(ANTECEDENTS_FAM_LABELS, dossier.antecedentsFamiliauxMelanome)} />
        <Row label="Nombre de nævus" value={label(NAEVUS_LABELS, dossier.nombreNaevus)} />
      </div>
    </div>
  );
}