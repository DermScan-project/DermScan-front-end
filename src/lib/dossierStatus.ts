export type DossierStatus = "BROUILLON" | "EN_ATTENTE" | "EN_COURS" | "EVALUE";

export type StatusConfig = {
  label: string;
  accent: string;
  cardBg: string;
  badgeBg: string;
  text: string;
  icon: "clock" | "check" | "draft";
};

export const STATUS_CONFIG: Record<DossierStatus, StatusConfig> = {
  BROUILLON: {
    label: "Brouillon",
    accent: "border-l-ardoise/30",
    cardBg: "bg-ardoise/5",
    badgeBg: "bg-ardoise/10",
    text: "text-ardoise/70",
    icon: "draft",
  },
  EN_ATTENTE: {
    label: "En attente",
    accent: "border-l-sauge",
    cardBg: "bg-sauge-clair/40",
    badgeBg: "bg-sauge-clair",
    text: "text-sauge",
    icon: "clock",
  },
  EN_COURS: {
    label: "En cours d'évaluation",
    accent: "border-l-modere",
    cardBg: "bg-[#FBF3DD]/60",
    badgeBg: "bg-[#FBF3DD]",
    text: "text-modere",
    icon: "clock",
  },
  EVALUE: {
    label: "Résultat disponible",
    accent: "border-l-faible",
    cardBg: "bg-sauge-clair/50",
    badgeBg: "bg-sauge-clair",
    text: "text-faible",
    icon: "check",
  },
};

export const STATUS_FILTERS: { value: DossierStatus | "TOUS"; label: string }[] = [
  { value: "TOUS", label: "Tous" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "EN_COURS", label: "En cours" },
  { value: "EVALUE", label: "Résultat disponible" },
];