const KEY = "dermscan_draft_dossier_id";

export function saveDraftDossierId(id: string) {
  sessionStorage.setItem(KEY, id);
}
export function getDraftDossierId(): string | null {
  return sessionStorage.getItem(KEY);
}
export function clearDraftDossierId() {
  sessionStorage.removeItem(KEY);
}