export type AvisMedical = "CONSULTATION_URGENTE" | "CONSULTATION_RECOMMANDEE" | "PAS_URGENCE";

export const AVIS_CONFIG: Record<AvisMedical, { title: string; bg: string; border: string; text: string; label: string }> = {
  CONSULTATION_URGENTE: {
    title: "Consultation prioritaire recommandée",
    bg: "bg-urgent/5",
    border: "border-urgent/20",
    text: "text-urgent",
    label: "Avis médical",
  },
  CONSULTATION_RECOMMANDEE: {
    title: "Consultation recommandée",
    bg: "bg-modere/5",
    border: "border-modere/20",
    text: "text-modere",
    label: "Avis médical",
  },
  PAS_URGENCE: {
    title: "Lésion sans caractère d'urgence immédiate",
    bg: "bg-faible/5",
    border: "border-faible/20",
    text: "text-faible",
    label: "Avis médical",
  },
};