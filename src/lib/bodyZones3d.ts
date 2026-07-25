export interface Zone3D {
  code: string;
  x: number; y: number; z: number;
  w: number; h: number; d: number;
  shape?: "box" | "sphere";
}

const Z_FRONT = 0.35;
const Z_BACK = -0.35;

export const FRONT_ZONES: Zone3D[] = [
  { code: "FACE_TETE_VISAGE", x: 0, y: 3.3, z: Z_FRONT, w: 0.7, h: 0.7, d: 0.5, shape: "sphere" },
  { code: "FACE_BRAS_GAUCHE", x: -1.05, y: 2.4, z: Z_FRONT, w: 0.5, h: 0.9, d: 0.5 },
  { code: "FACE_POITRINE_GAUCHE", x: -0.35, y: 2.4, z: Z_FRONT, w: 0.7, h: 0.9, d: 0.5 },
  { code: "FACE_POITRINE_DROITE", x: 0.35, y: 2.4, z: Z_FRONT, w: 0.7, h: 0.9, d: 0.5 },
  { code: "FACE_BRAS_DROIT", x: 1.05, y: 2.4, z: Z_FRONT, w: 0.5, h: 0.9, d: 0.5 },
  { code: "FACE_AVANT_BRAS_GAUCHE", x: -1.05, y: 1.5, z: Z_FRONT, w: 0.5, h: 0.9, d: 0.5 },
  { code: "FACE_ABDOMEN", x: 0, y: 1.5, z: Z_FRONT, w: 1.4, h: 0.9, d: 0.5 },
  { code: "FACE_AVANT_BRAS_DROIT", x: 1.05, y: 1.5, z: Z_FRONT, w: 0.5, h: 0.9, d: 0.5 },
  { code: "FACE_MAIN_GAUCHE", x: -1.05, y: 0.8, z: Z_FRONT, w: 0.45, h: 0.5, d: 0.4 },
  { code: "FACE_BASSIN_AINE", x: 0, y: 0.75, z: Z_FRONT, w: 1.4, h: 0.6, d: 0.5 },
  { code: "FACE_MAIN_DROITE", x: 1.05, y: 0.8, z: Z_FRONT, w: 0.45, h: 0.5, d: 0.4 },
  { code: "FACE_CUISSE_GAUCHE", x: -0.42, y: -0.2, z: Z_FRONT, w: 0.7, h: 1.1, d: 0.55 },
  { code: "FACE_CUISSE_DROITE", x: 0.42, y: -0.2, z: Z_FRONT, w: 0.7, h: 1.1, d: 0.55 },
  { code: "FACE_JAMBE_GAUCHE", x: -0.42, y: -1.4, z: Z_FRONT, w: 0.6, h: 1.1, d: 0.5 },
  { code: "FACE_JAMBE_DROITE", x: 0.42, y: -1.4, z: Z_FRONT, w: 0.6, h: 1.1, d: 0.5 },
  { code: "FACE_PIED_GAUCHE", x: -0.42, y: -2.15, z: Z_FRONT + 0.15, w: 0.55, h: 0.35, d: 0.7 },
  { code: "FACE_PIED_DROIT", x: 0.42, y: -2.15, z: Z_FRONT + 0.15, w: 0.55, h: 0.35, d: 0.7 },
];

export const BACK_ZONES: Zone3D[] = [
  { code: "DOS_CUIR_CHEVELU", x: 0, y: 3.5, z: Z_BACK, w: 0.6, h: 0.4, d: 0.4, shape: "sphere" },
  { code: "DOS_NUQUE", x: 0, y: 3.1, z: Z_BACK, w: 0.5, h: 0.3, d: 0.35, shape: "sphere" },
  { code: "DOS_EPAULE_GAUCHE", x: -0.85, y: 2.7, z: Z_BACK, w: 0.6, h: 0.5, d: 0.5 },
  { code: "DOS_HAUT_DU_DOS", x: 0, y: 2.6, z: Z_BACK, w: 1.0, h: 0.7, d: 0.5 },
  { code: "DOS_EPAULE_DROITE", x: 0.85, y: 2.7, z: Z_BACK, w: 0.6, h: 0.5, d: 0.5 },
  { code: "DOS_BRAS_GAUCHE_ARR", x: -1.05, y: 2.1, z: Z_BACK, w: 0.5, h: 0.9, d: 0.5 },
  { code: "DOS_BAS_DU_DOS", x: 0, y: 1.8, z: Z_BACK, w: 1.0, h: 0.7, d: 0.5 },
  { code: "DOS_BRAS_DROIT_ARR", x: 1.05, y: 2.1, z: Z_BACK, w: 0.5, h: 0.9, d: 0.5 },
  { code: "DOS_AVANT_BRAS_GAUCHE_ARR", x: -1.05, y: 1.2, z: Z_BACK, w: 0.5, h: 0.9, d: 0.5 },
  { code: "DOS_FESSIER", x: 0, y: 1.0, z: Z_BACK, w: 1.1, h: 0.6, d: 0.55 },
  { code: "DOS_AVANT_BRAS_DROIT_ARR", x: 1.05, y: 1.2, z: Z_BACK, w: 0.5, h: 0.9, d: 0.5 },
  { code: "DOS_CUISSE_GAUCHE_ARR", x: -0.42, y: -0.2, z: Z_BACK, w: 0.7, h: 1.1, d: 0.55 },
  { code: "DOS_CUISSE_DROITE_ARR", x: 0.42, y: -0.2, z: Z_BACK, w: 0.7, h: 1.1, d: 0.55 },
  { code: "DOS_MOLLET_GAUCHE", x: -0.42, y: -1.4, z: Z_BACK, w: 0.6, h: 1.1, d: 0.5 },
  { code: "DOS_MOLLET_DROIT", x: 0.42, y: -1.4, z: Z_BACK, w: 0.6, h: 1.1, d: 0.5 },
  { code: "DOS_TALON_GAUCHE", x: -0.42, y: -2.15, z: Z_BACK - 0.15, w: 0.5, h: 0.3, d: 0.5 },
  { code: "DOS_TALON_DROIT", x: 0.42, y: -2.15, z: Z_BACK - 0.15, w: 0.5, h: 0.3, d: 0.5 },
];