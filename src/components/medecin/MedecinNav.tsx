"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/medecin/dashboard", label: "Tableau de bord", icon: "home" },
  { href: "/medecin/dossiers", label: "Dossiers", icon: "grid" },
  { href: "/medecin/messages", label: "Messages", icon: "message" },
  { href: "/medecin/creneaux", label: "Créneaux", icon: "calendar" },
  { href: "/medecin/patients", label: "Patients", icon: "search" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  search: (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
),
};

export default function MedecinNav({ dossiersBadge = 0, messagesBadge = 0 }: { dossiersBadge?: number; messagesBadge?: number }) {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-ardoise/10 sticky top-[57px] z-10">
      <div className="flex max-w-3xl mx-auto">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          const badge = tab.href === "/medecin/dossiers" ? dossiersBadge : tab.href === "/medecin/messages" ? messagesBadge : 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 border-b-2 transition-colors relative ${
                active ? "border-sauge text-encre" : "border-transparent text-ardoise/60 hover:text-ardoise"
              }`}
            >
              <span className="relative">
                {ICONS[tab.icon]}
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-urgent text-white text-[10px] font-medium flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}