export const ASYMETRIE_LABELS: Record<string, string> = {
  SYMETRIQUE: "Symétrique", ASYMETRIQUE_UN_AXE: "Asymétrique dans un axe", ASYMETRIQUE_DEUX_AXES: "Asymétrique dans les deux axes",
};
export const BORDS_LABELS: Record<string, string> = {
  REGULIERS: "Réguliers et bien définis", LEGEREMENT_IRREGULIERS: "Légèrement irréguliers",
  TRES_IRREGULIERS: "Très irréguliers ou festonnés", FLOUS: "Flous ou mal délimités",
};
export const COULEURS_LABELS: Record<string, string> = {
  BEIGE_CHAIR: "Beige / chair", BRUN_CLAIR: "Brun clair", BRUN_FONCE: "Brun foncé", NOIR: "Noir",
  ROUGE_INFLAMMATION: "Rouge / inflammation", ROSE_ERYTHEME: "Rose / érythème",
  BLANC_DEPIGMENTE: "Blanc / dépigmenté", PLUSIEURS_COULEURS: "Plusieurs couleurs",
};
export const DIAMETRE_LABELS: Record<string, string> = {
  LT_3MM: "< 3 mm", MM_3_6: "3 à 6 mm", MM_6_10: "> 6 mm à 10 mm", GT_10MM: "> 10 mm", NE_SAIT_PAS: "Je ne sais pas",
};
export const EVOLUTION_LABELS: Record<string, string> = {
  STABLE_ANNEES: "Stable depuis des années", AUGMENTE_TAILLE: "Augmente en taille", CHANGE_COULEUR: "Change de couleur",
  CHANGE_FORME: "Change de forme", SAIGNE_SPONTANEMENT: "Saigne spontanément",
  ULCERATION_CROUTE_PERSISTANTE: "Ulcération / croûte persistante", APPARU_RECEMMENT: "Apparu récemment",
};
export const SYMPTOMES_LABELS: Record<string, string> = {
  DEMANGEAISONS: "Démangeaisons", DOULEUR_TOUCHER: "Douleur au toucher", SAIGNEMENT_OCCASIONNEL: "Saignement occasionnel",
  SUINTEMENT: "Suintement", CROUTES_RECURRENTES: "Croûtes récurrentes", BRULURES: "Brûlures", AUCUN_SYMPTOME: "Aucun symptôme",
};
export const ANCIENNETE_LABELS: Record<string, string> = {
  LT_1_SEMAINE: "< 1 semaine", SEMAINES_1_4: "1 à 4 semaines", MOIS_1_6: "1 à 6 mois",
  MOIS_6_AN_1: "6 mois à 1 an", GT_1_AN: "> 1 an", DEPUIS_ENFANCE: "Depuis l'enfance",
};
export const EXPOSITION_LABELS: Record<string, string> = {
  TRES_FAIBLE: "Très faible (intérieur)", MODEREE: "Modérée", ELEVEE: "Élevée (extérieur)",
  COUPS_SOLEIL_FREQUENTS: "Coups de soleil fréquents", CABINES_UV: "Cabines UV",
};
export const PHOTOTYPE_LABELS: Record<string, string> = {
  I: "I — Brûle toujours", II: "II — Brûle facilement", III: "III — Brûle parfois",
  IV: "IV — Brûle rarement", V_VI: "V-VI — Très foncé",
};
export const ANTECEDENTS_PERSONNELS_LABELS: Record<string, string> = {
  CANCER_CUTANE_ANTERIEUR: "Cancer cutané antérieur", MELANOME_ANTERIEUR: "Mélanome antérieur",
  IMMUNODEPRESSION: "Immunodépression", MALADIE_AUTO_IMMUNE: "Maladie auto-immune",
  GREFFE_ORGANE: "Greffe d'organe", DIABETE: "Diabète", AUCUN: "Aucun",
};
export const ANTECEDENTS_FAM_LABELS: Record<string, string> = { OUI: "Oui", NON: "Non", NE_SAIT_PAS: "Ne sait pas" };
export const NAEVUS_LABELS: Record<string, string> = {
  MOINS_20: "Moins de 20", ENTRE_20_50: "20 à 50", PLUS_50: "Plus de 50",
  NOMBREUX_ATYPIQUES: "Nombreux nævus atypiques", NE_SAIT_PAS: "Je ne sais pas",
};

export function label(map: Record<string, string>, value: string | null, fallback = "Non renseigné") {
  if (!value) return fallback;
  return map[value] || value;
}
export function labelList(map: Record<string, string>, values: string[] | null, fallback = "Non renseigné") {
  if (!values || values.length === 0) return fallback;
  return values.map((v) => map[v] || v).join(", ");
}