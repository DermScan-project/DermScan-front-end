export const NOTIFICATION_ICONS: Record<string, "check" | "clock" | "calendar" | "message" | "bell"> = {
  DOSSIER_EVALUE: "check",
  DOSSIER_NOUVEAU: "clock",
  RDV_CONFIRME: "calendar",
  RDV_RESERVE: "calendar",
  MESSAGE_RECU: "message",
  MEDECIN_VALIDE: "check",
  MEDECIN_REJETE: "bell",
  MEDECIN_DESACTIVE: "bell",
};

export function notificationHref(n: { type: string; data: Record<string, unknown> | null }): string | null {
  if (n.type === "DOSSIER_EVALUE" && n.data?.dossierId) return `/patient/dossiers/${n.data.dossierId}`;
  if (n.type === "RDV_CONFIRME") return "/patient/rendez-vous";
  return null;
}