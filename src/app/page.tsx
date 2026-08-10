import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2419] via-[#1B3A2D] to-[#4A6B52] flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>

        <h1 className="font-display text-5xl text-white mb-1">DermaLink</h1>
        <p className="text-xs tracking-[0.2em] text-white/60 uppercase mb-4">Triage dermatologique</p>

        <span className="text-[11px] tracking-wide uppercase text-white/70 border border-white/20 rounded-full px-3 py-1 mb-8">
          Usage professionnel · Pilote
        </span>

        {/* Portal cards */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/patient/login"
            className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-4 text-left hover:bg-white/95 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-sauge-clair flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-encre">Portail Patient</p>
              <p className="text-xs text-ardoise">Analyser une lésion · Trouver un médecin</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7268" strokeWidth="1.5" className="shrink-0 group-hover:translate-x-0.5 transition-transform">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/medecin/login"
            className="group flex items-center gap-4 bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-left hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
                <circle cx="19" cy="17" r="2.5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">Portail Médecin</p>
              <p className="text-xs text-white/60">Connexion RPPS · Évaluation · Messagerie</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" className="shrink-0 group-hover:translate-x-0.5 transition-transform">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <p className="text-[11px] text-white/40 mt-8 leading-relaxed">
          Outil de triage uniquement · Ne constitue pas un diagnostic médical · Données sécurisées RGPD
        </p>

        <Link href="/admin/login" className="flex items-center gap-1.5 text-[11px] tracking-wide uppercase text-white/30 hover:text-white/50 mt-6 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Administration
        </Link>
      </div>
    </div>
  );
}