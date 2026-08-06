export type DocumentCategorie = "ORDONNANCE" | "BILAN" | "IMAGERIE" | "LETTRE_MEDECIN";

export const DOCUMENT_CATEGORIES: { key: DocumentCategorie; label: string; description: string }[] = [
  { key: "ORDONNANCE", label: "Ordonnances", description: "Prescriptions médicales" },
  { key: "BILAN", label: "Bilans", description: "Résultats d'analyses, bilans sanguins..." },
  { key: "IMAGERIE", label: "Imageries", description: "Radiographies, échographies, IRM..." },
  { key: "LETTRE_MEDECIN", label: "Lettres des médecins", description: "Courriers et comptes-rendus de consultation" },
];