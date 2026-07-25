import {
  ASYMETRIE_LABELS, BORDS_LABELS, COULEURS_LABELS, DIAMETRE_LABELS, EVOLUTION_LABELS,
  SYMPTOMES_LABELS, ANCIENNETE_LABELS, EXPOSITION_LABELS, PHOTOTYPE_LABELS,
  ANTECEDENTS_PERSONNELS_LABELS, ANTECEDENTS_FAM_LABELS, NAEVUS_LABELS,
} from "./dossierLabels";
import { ZONE_LABELS } from "./labels";

function toOptions(map: Record<string, string>) {
  return Object.entries(map).map(([value, label]) => ({ value, label }));
}

export const ASYMETRIE_OPTIONS = toOptions(ASYMETRIE_LABELS);
export const BORDS_OPTIONS = toOptions(BORDS_LABELS);
export const COULEURS_OPTIONS = toOptions(COULEURS_LABELS);
export const DIAMETRE_OPTIONS = toOptions(DIAMETRE_LABELS);
export const EVOLUTION_OPTIONS = toOptions(EVOLUTION_LABELS);
export const SYMPTOMES_OPTIONS = toOptions(SYMPTOMES_LABELS);
export const ANCIENNETE_OPTIONS = toOptions(ANCIENNETE_LABELS);
export const EXPOSITION_OPTIONS = toOptions(EXPOSITION_LABELS);
export const PHOTOTYPE_OPTIONS = toOptions(PHOTOTYPE_LABELS);
export const ANTECEDENTS_PERSONNELS_OPTIONS = toOptions(ANTECEDENTS_PERSONNELS_LABELS);
export const ANTECEDENTS_FAM_OPTIONS = toOptions(ANTECEDENTS_FAM_LABELS);
export const NAEVUS_OPTIONS = toOptions(NAEVUS_LABELS);

export const FACE_ZONES = Object.entries(ZONE_LABELS)
  .filter(([code]) => code.startsWith("FACE_"))
  .map(([value, label]) => ({ value, label }));

export const DOS_ZONES = Object.entries(ZONE_LABELS)
  .filter(([code]) => code.startsWith("DOS_"))
  .map(([value, label]) => ({ value, label }));