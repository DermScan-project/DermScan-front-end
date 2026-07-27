"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: "home" },
  { href: "/admin/medecins", label: "Médecins", icon: "stethoscope" },
  { href: "/admin/dossiers", label: "Dossiers", icon: "grid" },
  { href: "/admin/rendez-vous", label: "Rendez-vous", icon: "calendar" },
  {href: "/admin/profil", label: "Mon profil", icon: "calendar" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 11l9-7 9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  stethoscope: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
      <circle cx="19" cy="17" r="2.5" />
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
  calendar: (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
  </svg>
),
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <div className="w-60 shrink-0 h-screen bg-sauge flex flex-col sticky top-0">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-display text-xl text-white">DermScan</p>
        <p className="text-[11px] text-white/50 tracking-wide uppercase">Administration</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {ICONS[item.icon]}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
      <Link
    href="/admin/profil"
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
    </svg>
    Mon profil
  </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  );
}