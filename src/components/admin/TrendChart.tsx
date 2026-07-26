"use client";

import { useState } from "react";

export default function TrendChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <p className="text-sm font-medium text-encre mb-4">Dossiers soumis · 7 derniers jours</p>
      <div className="flex items-end gap-3">
  {data.map((d) => (
    <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
      <div
        className="relative h-48 w-full bg-ardoise/5 rounded-md overflow-visible"
        onMouseEnter={() => setHovered(d.date)}
        onMouseLeave={() => setHovered(null)}
      >
              {hovered === d.date && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-encre text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap z-10">
                  {d.count} dossier{d.count !== 1 ? "s" : ""}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-encre" />
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 bg-sauge rounded-md transition-all cursor-pointer hover:bg-sauge/80"
                style={{ height: d.count > 0 ? `${Math.max((d.count / max) * 100, 6)}%` : "3%" }}
              />
            </div>
            <span className="text-[10px] text-ardoise/60">
              {new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}