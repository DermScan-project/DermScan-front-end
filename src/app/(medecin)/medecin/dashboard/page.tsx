"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortalHeader from "@/components/ui/PortalHeader";
import HeaderActions from "@/components/ui/HeaderActions";
import MedecinNav from "@/components/medecin/MedecinNav";
import StatCard from "@/components/medecin/StatCard";
import DemandeRow from "@/components/medecin/DemandeRow";
import { useAuth } from "@/context/AuthContext";
import { getMedecinDashboard, DashboardStats } from "@/lib/api/medecinDossiers";

export default function MedecinDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedecinDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const medecin = user as any;

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="DermaLink Pro"
        subtitle={medecin?.nomComplet || ""}
        onBack={() => (window.location.href = "/")}
        right={<HeaderActions hasUnread={(stats?.urgentes || 0) > 0} />}
      />
      <MedecinNav dossiersBadge={stats?.demandes || 0} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <div className="rounded-2xl bg-sauge-clair/50 border border-sauge-clair px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm font-medium text-sauge shrink-0">
            {medecin?.nomComplet?.[0]?.toUpperCase() || "M"}
          </div>
          <div>
            <p className="text-[11px] tracking-wide uppercase text-sauge font-medium flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Profil synchronisé · {medecin?.referencee ? "Référencé par l'administrateur" : "En attente de référencement"}
            </p>
            <p className="text-sm font-medium text-encre">{medecin?.nomComplet}</p>
            <p className="text-xs text-ardoise">Médecin</p>
          </div>
        </div>

        <Link
          href="/medecin/dossiers/nouveau"
          className="flex items-center justify-between rounded-2xl bg-sauge text-white px-5 py-4 hover:bg-sauge/90 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium">Créer un dossier pour un patient</span>
          </div>
        </Link>

        <Link
          href="/medecin/patients"
          className="flex items-center justify-between rounded-2xl bg-white border border-ardoise/10 px-5 py-4 hover:border-sauge/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sauge-clair flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-encre">Rechercher un patient</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ardoise/50">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {loading && <p className="text-sm text-ardoise text-center py-6">Chargement...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard value={stats.demandes} label="Demandes" href="/medecin/dossiers" />
              <StatCard value={stats.urgentes} label="Urgentes" href="/medecin/dossiers?filtre=urgent" tone="urgent" />
              <StatCard value={stats.enAttente} label="En attente" href="/medecin/dossiers?filtre=en_attente" />
              <StatCard value={stats.evaluees} label="Évaluées" href="/medecin/dossiers?filtre=evalue" />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium">Dernières demandes</p>
              {stats.dernieresDemandes.length === 0 && (
                <p className="text-sm text-ardoise text-center py-6">Aucune demande pour le moment.</p>
              )}
              {stats.dernieresDemandes.map((d) => <DemandeRow key={d.id} dossier={d} />)}
              {stats.dernieresDemandes.length > 0 && (
                <Link
                  href="/medecin/dossiers"
                  className="text-center text-sm text-sauge font-medium py-3 rounded-2xl border border-ardoise/10 bg-white hover:bg-sauge-clair/30"
                >
                  Voir tous les dossiers
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}