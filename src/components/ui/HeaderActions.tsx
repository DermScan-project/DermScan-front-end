"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon, UserIcon } from "./icons";
import { useAuth } from "@/context/AuthContext";

export default function HeaderActions({
  hasUnread = false,
  initials,
}: {
  hasUnread?: boolean;
  initials?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/patient/notifications"
        className="relative w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
        aria-label="Notifications"
      >
        <span className="scale-90">{BellIcon}</span>
        {hasUnread && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E07856]" />}
      </Link>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[11px] font-medium text-white hover:bg-white/15 transition-colors"
          aria-label="Mon compte"
        >
          {initials || <span className="scale-90">{UserIcon}</span>}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-ardoise/10 shadow-lg py-1.5 z-20">
            <Link
              href="/patient/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-encre hover:bg-sauge-clair/50"
            >
              <span className="scale-90 text-ardoise">{UserIcon}</span>
              Voir le profil
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-urgent hover:bg-urgent-fond text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}