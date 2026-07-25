"use client";

import { useState } from "react";
import { FACE_ZONES, DOS_ZONES } from "@/lib/dossierOptions";

type Shape =
  | { code: string; kind: "rect"; x: number; y: number; w: number; h: number; rx: number }
  | { code: string; kind: "circle"; cx: number; cy: number; r: number };

// ============================================
// 👇 CHANGE THIS ONE NUMBER TO ADJUST SPACING
// Bigger number = more space between body parts
// Smaller number (even 0) = parts touch each other
// ============================================
const GAP = 2;

// ---- helpers so we don't hand-calculate coordinates ----
const HEAD_CX = 110;
const HEAD_CY = 35;
const HEAD_R = 24;

const NECK_Y = HEAD_CY + HEAD_R + GAP; // just below the head circle
const NECK_H = 16;

const ROW0_Y = NECK_Y + NECK_H + GAP; // shoulders row
const ROW_H = 58 - GAP; // shrink row height a bit so gap doesn't push everything too tall

function rowY(rowIndex: number, rowHeights: number[]) {
  let y = ROW0_Y;
  for (let i = 0; i < rowIndex; i++) {
    y += rowHeights[i] + GAP;
  }
  return y;
}

const HEIGHTS = [58, 58, 44, 72, 80, 30].map((h) => h - GAP); // shoulders, torso, hips, thigh, leg, foot rows

const FACE_CELLS: Shape[] = [
  { code: "FACE_TETE_VISAGE", kind: "circle", cx: HEAD_CX, cy: HEAD_CY, r: HEAD_R },
  { code: "FACE_COU", kind: "rect", x: 100, y: NECK_Y, w: 20, h: NECK_H, rx: 7 },

  { code: "FACE_BRAS_GAUCHE", kind: "rect", x: 44, y: rowY(0, HEIGHTS), w: 30, h: HEIGHTS[0], rx: 14 },
  { code: "FACE_POITRINE_GAUCHE", kind: "rect", x: 78 + GAP, y: rowY(0, HEIGHTS), w: 32 - GAP, h: HEIGHTS[0], rx: 10 },
  { code: "FACE_POITRINE_DROITE", kind: "rect", x: 110, y: rowY(0, HEIGHTS), w: 32 - GAP, h: HEIGHTS[0], rx: 10 },
  { code: "FACE_BRAS_DROIT", kind: "rect", x: 146 + GAP, y: rowY(0, HEIGHTS), w: 30, h: HEIGHTS[0], rx: 14 },

  { code: "FACE_AVANT_BRAS_GAUCHE", kind: "rect", x: 44, y: rowY(1, HEIGHTS), w: 30, h: HEIGHTS[1], rx: 14 },
  { code: "FACE_ABDOMEN", kind: "rect", x: 78 + GAP, y: rowY(1, HEIGHTS), w: 68 - GAP * 2, h: HEIGHTS[1], rx: 12 },
  { code: "FACE_AVANT_BRAS_DROIT", kind: "rect", x: 146 + GAP, y: rowY(1, HEIGHTS), w: 30, h: HEIGHTS[1], rx: 14 },

  { code: "FACE_MAIN_GAUCHE", kind: "rect", x: 44, y: rowY(2, HEIGHTS), w: 30, h: HEIGHTS[2], rx: 14 },
  { code: "FACE_BASSIN_AINE", kind: "rect", x: 78 + GAP, y: rowY(2, HEIGHTS), w: 68 - GAP * 2, h: HEIGHTS[2], rx: 12 },
  { code: "FACE_MAIN_DROITE", kind: "rect", x: 146 + GAP, y: rowY(2, HEIGHTS), w: 30, h: HEIGHTS[2], rx: 14 },

  { code: "FACE_CUISSE_GAUCHE", kind: "rect", x: 68, y: rowY(3, HEIGHTS), w: 42 - GAP / 2, h: HEIGHTS[3], rx: 14 },
  { code: "FACE_CUISSE_DROITE", kind: "rect", x: 110 + GAP / 2, y: rowY(3, HEIGHTS), w: 42 - GAP / 2, h: HEIGHTS[3], rx: 14 },

  { code: "FACE_JAMBE_GAUCHE", kind: "rect", x: 70, y: rowY(4, HEIGHTS), w: 38 - GAP / 2, h: HEIGHTS[4], rx: 14 },
  { code: "FACE_JAMBE_DROITE", kind: "rect", x: 112 + GAP / 2, y: rowY(4, HEIGHTS), w: 38 - GAP / 2, h: HEIGHTS[4], rx: 14 },

  { code: "FACE_PIED_GAUCHE", kind: "rect", x: 66, y: rowY(5, HEIGHTS), w: 44 - GAP / 2, h: HEIGHTS[5], rx: 10 },
  { code: "FACE_PIED_DROIT", kind: "rect", x: 110 + GAP / 2, y: rowY(5, HEIGHTS), w: 44 - GAP / 2, h: HEIGHTS[5], rx: 10 },
];

const DOS_CELLS: Shape[] = [
  { code: "DOS_CUIR_CHEVELU", kind: "circle", cx: HEAD_CX, cy: HEAD_CY, r: HEAD_R },
  { code: "DOS_NUQUE", kind: "rect", x: 100, y: NECK_Y, w: 20, h: NECK_H, rx: 7 },

  { code: "DOS_EPAULE_GAUCHE", kind: "rect", x: 44, y: rowY(0, HEIGHTS), w: 30, h: HEIGHTS[0], rx: 14 },
  { code: "DOS_HAUT_DU_DOS", kind: "rect", x: 78 + GAP, y: rowY(0, HEIGHTS), w: 68 - GAP * 2, h: HEIGHTS[0], rx: 12 },
  { code: "DOS_EPAULE_DROITE", kind: "rect", x: 146 + GAP, y: rowY(0, HEIGHTS), w: 30, h: HEIGHTS[0], rx: 14 },

  { code: "DOS_BRAS_GAUCHE_ARR", kind: "rect", x: 44, y: rowY(1, HEIGHTS), w: 30, h: HEIGHTS[1], rx: 14 },
  { code: "DOS_BAS_DU_DOS", kind: "rect", x: 78 + GAP, y: rowY(1, HEIGHTS), w: 68 - GAP * 2, h: HEIGHTS[1], rx: 12 },
  { code: "DOS_BRAS_DROIT_ARR", kind: "rect", x: 146 + GAP, y: rowY(1, HEIGHTS), w: 30, h: HEIGHTS[1], rx: 14 },

  { code: "DOS_AVANT_BRAS_GAUCHE_ARR", kind: "rect", x: 44, y: rowY(2, HEIGHTS), w: 30, h: HEIGHTS[2], rx: 14 },
  { code: "DOS_FESSIER", kind: "rect", x: 78 + GAP, y: rowY(2, HEIGHTS), w: 68 - GAP * 2, h: HEIGHTS[2], rx: 12 },
  { code: "DOS_AVANT_BRAS_DROIT_ARR", kind: "rect", x: 146 + GAP, y: rowY(2, HEIGHTS), w: 30, h: HEIGHTS[2], rx: 14 },

  { code: "DOS_CUISSE_GAUCHE_ARR", kind: "rect", x: 68, y: rowY(3, HEIGHTS), w: 42 - GAP / 2, h: HEIGHTS[3], rx: 14 },
  { code: "DOS_CUISSE_DROITE_ARR", kind: "rect", x: 110 + GAP / 2, y: rowY(3, HEIGHTS), w: 42 - GAP / 2, h: HEIGHTS[3], rx: 14 },

  { code: "DOS_MOLLET_GAUCHE", kind: "rect", x: 70, y: rowY(4, HEIGHTS), w: 38 - GAP / 2, h: HEIGHTS[4], rx: 14 },
  { code: "DOS_MOLLET_DROIT", kind: "rect", x: 112 + GAP / 2, y: rowY(4, HEIGHTS), w: 38 - GAP / 2, h: HEIGHTS[4], rx: 14 },

  { code: "DOS_TALON_GAUCHE", kind: "rect", x: 66, y: rowY(5, HEIGHTS), w: 44 - GAP / 2, h: HEIGHTS[5], rx: 10 },
  { code: "DOS_TALON_DROIT", kind: "rect", x: 110 + GAP / 2, y: rowY(5, HEIGHTS), w: 44 - GAP / 2, h: HEIGHTS[5], rx: 10 },
];

function labelFor(code: string) {
  return [...FACE_ZONES, ...DOS_ZONES].find((z) => z.value === code)?.label || code;
}

export default function BodyZoneSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (zones: string[]) => void;
}) {
  const [view, setView] = useState<"FACE" | "DOS">("FACE");
  const cells = view === "FACE" ? FACE_CELLS : DOS_CELLS;

  function toggleZone(code: string) {
    onChange(selected.includes(code) ? selected.filter((z) => z !== code) : [...selected, code]);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex rounded-full border border-[#E4E1D8] bg-[#F7F6F2] p-1 mb-3">
        {(["FACE", "DOS"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              view === v ? "bg-white text-[#2E2E2A] shadow-sm" : "text-[#9CA39A]"
            }`}
          >
            {v === "FACE" ? "Face" : "Dos"}
          </button>
        ))}
      </div>

      <p className="text-xs text-[#9CA39A] mb-5">
        Sélectionnez les zones concernées · sélection multiple
      </p>

      <svg viewBox="0 0 220 450" className="w-56 mb-5" xmlns="http://www.w3.org/2000/svg">
        {cells.map((cell) => {
          const active = selected.includes(cell.code);
          const fill = active ? "#7FA07A" : "#E8EFE6";
          const stroke = active ? "#7FA07A" : "#D3E0CE";

          if (cell.kind === "circle") {
            return (
              <circle
                key={cell.code}
                cx={cell.cx}
                cy={cell.cy}
                r={cell.r}
                fill={fill}
                stroke={stroke}
                strokeWidth={1}
                className="cursor-pointer transition-colors hover:opacity-90"
                onClick={() => toggleZone(cell.code)}
              >
                <title>{labelFor(cell.code)}</title>
              </circle>
            );
          }

          return (
            <rect
              key={cell.code}
              x={cell.x}
              y={cell.y}
              width={cell.w}
              height={cell.h}
              rx={cell.rx}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
              className="cursor-pointer transition-colors hover:opacity-90"
              onClick={() => toggleZone(cell.code)}
            >
              <title>{labelFor(cell.code)}</title>
            </rect>
          );
        })}

        <text
          x={HEAD_CX}
          y={HEAD_CY + 4}
          textAnchor="middle"
          className="pointer-events-none select-none fill-[#8B9686] text-[10px] font-medium uppercase tracking-wide"
        >
          {view}
        </text>
      </svg>

      {selected.length === 0 && (
        <p className="text-xs text-[#C97B76] mb-2">Au moins une zone est requise</p>
      )}

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {selected.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFE6] text-[#5F7A5A] text-xs px-3 py-1.5"
            >
              {labelFor(code)}
              <button type="button" onClick={() => toggleZone(code)} className="hover:text-[#C0453F]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}