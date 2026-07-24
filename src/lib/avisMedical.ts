export type AvisMedical = "CONSULTATION_URGENTE" | "CONSULTATION_RECOMMANDEE" | "PAS_URGENCE";

export const AVIS_CONFIG: Record<AvisMedical, { title: string; bg: string; border: string; text: string; label: string }> = {
  CONSULTATION_URGENTE: {
    title: "Consultation prioritaire recommandée",
    bg: "bg-urgent-fond",
    border: "border-urgent/10",
    text: "text-urgent-doux",
    label: "Avis médical",
  },
  CONSULTATION_RECOMMANDEE: {
    title: "Consultation recommandée",
    bg: "bg-modere-fond",
    border: "border-modere/10",
    text: "text-modere",
    label: "Avis médical",
  },
  PAS_URGENCE: {
    title: "Lésion sans caractère d'urgence immédiate",
    bg: "bg-faible-fond",
    border: "border-faible/10",
    text: "text-faible",
    label: "Avis médical",
  },
};