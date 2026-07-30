"use client";

import { useMemo, useState } from "react";

type TimeSelect12Props = {
  label: string;
  value: string; // 24h format "HH:mm", e.g. "13:00" — unchanged for the backend
  onChange: (value: string) => void; // still emits "HH:mm" 24h
  required?: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function to24h(hour12: number, minute: number, period: "AM" | "PM") {
  let h = hour12 % 12; // 12 -> 0
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function from24h(value: string) {
  const [hStr, mStr] = (value || "00:00").split(":");
  const h24 = clamp(Number(hStr) || 0, 0, 23);
  const period: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
  let hour12 = h24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, minute: clamp(Number(mStr) || 0, 0, 59), period };
}

export default function TimeSelect12({ label, value, onChange, required }: TimeSelect12Props) {
  const parsed = useMemo(() => from24h(value), [value]);

  // local text buffers so the person can freely type/clear digits without
  // being clamped mid-keystroke; committed onBlur or when the period toggles
  const [hourText, setHourText] = useState(String(parsed.hour12));
  const [minuteText, setMinuteText] = useState(String(parsed.minute).padStart(2, "0"));

  function commit(hourStr: string, minuteStr: string, period: "AM" | "PM") {
    const hour12 = clamp(Number(hourStr) || 12, 1, 12);
    const minute = clamp(Number(minuteStr) || 0, 0, 59);
    setHourText(String(hour12));
    setMinuteText(String(minute).padStart(2, "0"));
    onChange(to24h(hour12, minute, period));
  }

  function setPeriod(period: "AM" | "PM") {
    commit(hourText, minuteText, period);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">{label}</label>

      <div className="flex items-stretch rounded-xl border border-ardoise/25 bg-white focus-within:border-sauge overflow-hidden">
        <input
          required={required}
          inputMode="numeric"
          maxLength={2}
          value={hourText}
          onChange={(e) => setHourText(e.target.value.replace(/\D/g, "").slice(0, 2))}
          onBlur={() => commit(hourText, minuteText, parsed.period)}
          className="w-11 text-center text-sm text-encre py-2.5 outline-none"
          aria-label="Heure"
        />
        <span className="flex items-center text-ardoise/40 text-sm select-none">:</span>
        <input
          required={required}
          inputMode="numeric"
          maxLength={2}
          value={minuteText}
          onChange={(e) => setMinuteText(e.target.value.replace(/\D/g, "").slice(0, 2))}
          onBlur={() => commit(hourText, minuteText, parsed.period)}
          className="w-11 text-center text-sm text-encre py-2.5 outline-none"
          aria-label="Minute"
        />

        <div className="flex items-center gap-0.5 ml-auto p-1">
          {(["AM", "PM"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                parsed.period === p ? "bg-sauge text-white" : "text-ardoise/60 hover:text-encre"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}