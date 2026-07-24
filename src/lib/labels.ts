const ZONE_LABELS: Record<string, string> = {
  FACE_TETE_VISAGE: "Tête / Visage", FACE_COU: "Cou",
  FACE_POITRINE_GAUCHE: "Poitrine gauche", FACE_POITRINE_DROITE: "Poitrine droite",
  FACE_ABDOMEN: "Abdomen", FACE_BASSIN_AINE: "Bassin / Aine",
  FACE_CUISSE_DROITE: "Cuisse droite", FACE_CUISSE_GAUCHE: "Cuisse gauche",
  FACE_JAMBE_DROITE: "Jambe droite", FACE_JAMBE_GAUCHE: "Jambe gauche",
  FACE_PIED_DROIT: "Pied droit", FACE_PIED_GAUCHE: "Pied gauche",
  FACE_BRAS_GAUCHE: "Bras gauche", FACE_AVANT_BRAS_GAUCHE: "Avant-bras gauche",
  FACE_MAIN_GAUCHE: "Main gauche", FACE_AVANT_BRAS_DROIT: "Avant-bras droit",
  FACE_MAIN_DROITE: "Main droite", FACE_BRAS_DROIT: "Bras droit",
  DOS_CUIR_CHEVELU: "Cuir chevelu", DOS_NUQUE: "Nuque", DOS_HAUT_DU_DOS: "Haut du dos",
  DOS_EPAULE_DROITE: "Épaule droite", DOS_EPAULE_GAUCHE: "Épaule gauche",
  DOS_BRAS_GAUCHE_ARR: "Bras gauche (arr.)", DOS_AVANT_BRAS_GAUCHE_ARR: "Avant-bras G (arr.)",
  DOS_BAS_DU_DOS: "Bas du dos", DOS_FESSIER: "Fessier",
  DOS_BRAS_DROIT_ARR: "Bras droit (arr.)", DOS_AVANT_BRAS_DROIT_ARR: "Avant-bras D (arr.)",
  DOS_CUISSE_DROITE_ARR: "Cuisse D (arr.)", DOS_CUISSE_GAUCHE_ARR: "Cuisse G (arr.)",
  DOS_MOLLET_DROIT: "Mollet droit", DOS_MOLLET_GAUCHE: "Mollet gauche",
  DOS_TALON_DROIT: "Talon droit", DOS_TALON_GAUCHE: "Talon gauche",
};

export function labelZones(zones: string[]): string {
  if (!zones || zones.length === 0) return "Non renseigné";
  const face = zones.filter((z) => z.startsWith("FACE_")).map((z) => ZONE_LABELS[z] || z);
  const dos = zones.filter((z) => z.startsWith("DOS_")).map((z) => ZONE_LABELS[z] || z);
  const parts: string[] = [];
  if (face.length) parts.push(`Face : ${face.join(", ")}`);
  if (dos.length) parts.push(`Dos : ${dos.join(", ")}`);
  return parts.join("  |  ");
}