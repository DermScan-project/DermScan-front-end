"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

interface DateOfBirthInputProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  label?: string;
}

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const JOURS_COURTS = ["L", "M", "M", "J", "V", "S", "D"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday-first index
}

export default function DateOfBirthInput({ value, onChange, label = "Date de naissance" }: DateOfBirthInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : new Date().getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectDay(day: number) {
    const y = viewYear;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setOpen(false);
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => currentYear - i);
  const totalDays = daysInMonth(viewYear, viewMonth);
  const leadingBlanks = firstWeekday(viewYear, viewMonth);

  const displayValue = selected
    ? `${String(selected.getDate()).padStart(2, "0")}/${String(selected.getMonth() + 1).padStart(2, "0")}/${selected.getFullYear()}`
    : "";

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center justify-between rounded-xl border border-ardoise/25 bg-white px-4 py-3 text-[15px] text-left outline-none transition-colors",
          "focus:border-sauge focus:ring-2 focus:ring-sauge/15",
          displayValue ? "text-encre" : "text-ardoise/50"
        )}
      >
        {displayValue || "jj/mm/aaaa"}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ardoise/60 shrink-0">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
          <div className="fixed inset-x-4 bottom-4 z-50 bg-white rounded-2xl border border-ardoise/15 shadow-xl p-4 sm:absolute sm:inset-auto sm:top-full sm:bottom-auto sm:mt-2 sm:w-72">
          <div className="flex gap-2 mb-3">
            <select
              className="flex-1 rounded-lg border border-ardoise/20 bg-white px-2 py-1.5 text-sm text-encre outline-none focus:border-sauge"
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
            >
              {MOIS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select
              className="rounded-lg border border-ardoise/20 bg-white px-2 py-1.5 text-sm text-encre outline-none focus:border-sauge"
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {JOURS_COURTS.map((j, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-ardoise/60 py-1">{j}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const isSelected =
                selected &&
                selected.getFullYear() === viewYear &&
                selected.getMonth() === viewMonth &&
                selected.getDate() === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={clsx(
                    "h-8 w-8 rounded-full text-sm transition-colors mx-auto",
                    isSelected
                      ? "bg-sauge text-white font-medium"
                      : "text-encre hover:bg-sauge-clair"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}