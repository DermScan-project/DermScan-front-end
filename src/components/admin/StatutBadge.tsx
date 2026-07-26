const CONFIG: Record<string, { label: string; cls: string }> = {
  EN_ATTENTE: { label: "En attente", cls: "bg-[#FBF3DD] text-modere" },
  ACTIF: { label: "Actif", cls: "bg-sauge-clair text-sauge" },
  REJETE: { label: "Rejeté", cls: "bg-urgent-fond text-urgent-doux" },
  DESACTIVE: { label: "Désactivé", cls: "bg-ardoise/10 text-ardoise" },
};

export default function StatutBadge({ statut }: { statut: string }) {
  const c = CONFIG[statut] || { label: statut, cls: "bg-ardoise/10 text-ardoise" };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.cls}`}>{c.label}</span>;
}