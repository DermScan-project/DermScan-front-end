import Link from "next/link";
import { ReactNode } from "react";

export function AuthShell({ icon, title, subtitle, children }: {
  icon: ReactNode; title: string; subtitle: string; children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2419] via-[#1B3A2D] to-[#4A6B52] flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Link href="/" className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-4">
          {icon}
        </Link>
        <h1 className="font-display text-2xl text-white text-center mb-1">{title}</h1>
        <p className="text-xs text-white/60 text-center mb-6">{subtitle}</p>

        <div className="w-full bg-white rounded-2xl p-6 shadow-xl">{children}</div>
      </div>
    </div>
  );
}

export function InfoChip({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-sauge-clair px-3.5 py-2.5 text-xs text-sauge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" strokeLinecap="round" />
      </svg>
      {children}
    </div>
  );
}