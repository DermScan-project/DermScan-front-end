"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KpiCard from "@/components/admin/KpiCard";
import BreakdownBar from "@/components/admin/BreakdownBar";
import TrendChart from "@/components/admin/TrendChart";
import { getAdminDashboard, AdminDashboardData } from "@/lib/api/adminDashboard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminNotificationBell from "@/components/admin/AdminNotificationBell";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-sm text-ardoise">Chargement...</p>;
  if (!data) return <p className="p-8 text-sm text-urgent">Erreur de chargement.</p>;

 return (
  <div className="max-w-full">
<AdminPageHeader title="Tableau de bord" subtitle="Vue d'ensemble de la plateforme DermaLink" right={<AdminNotificationBell />} />
    <div className="p-8 pt-6">
      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KpiCard value={data.totalPatients} label="Patients" tone="sauge" />
        <KpiCard value={data.totalMedecins} label="Médecins" sublabel={`${data.medecinsReferences} référencés`} tone="sauge" />
        <KpiCard value={data.medecinsParStatut.EN_ATTENTE} label="Validations en attente" tone={data.medecinsParStatut.EN_ATTENTE > 0 ? "urgent" : "default"} />
        <KpiCard value={data.dossiersParPriorite.URGENT} label="Dossiers urgents" tone={data.dossiersParPriorite.URGENT > 0 ? "urgent" : "default"} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <TrendChart data={data.trend7Jours} />
        </div>
        <BreakdownBar
          title="Dossiers par statut"
          segments={[
            { label: "En attente", value: data.dossiersParStatut.EN_ATTENTE, color: "#B8860B" },
            { label: "En cours", value: data.dossiersParStatut.EN_COURS, color: "#6B7268" },
            { label: "Évalués", value: data.dossiersParStatut.EVALUE, color: "#1B7A3D" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <BreakdownBar
          title="Dossiers par priorité"
          segments={[
            { label: "Urgent", value: data.dossiersParPriorite.URGENT, color: "#B00020" },
            { label: "Modéré", value: data.dossiersParPriorite.MOYENNEMENT_URGENT, color: "#B8860B" },
            { label: "Faible", value: data.dossiersParPriorite.PAS_URGENT, color: "#1B7A3D" },
          ]}
        />
        <BreakdownBar
          title="Médecins par statut"
          segments={[
            { label: "Actifs", value: data.medecinsParStatut.ACTIF, color: "#1B7A3D" },
            { label: "En attente", value: data.medecinsParStatut.EN_ATTENTE, color: "#B8860B" },
            { label: "Rejetés", value: data.medecinsParStatut.REJETE, color: "#B00020" },
            { label: "Désactivés", value: data.medecinsParStatut.DESACTIVE, color: "#6B7268" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-encre">Validations en attente</p>
            <Link href="/admin/medecins" className="text-xs text-sauge font-medium hover:underline">Voir tout</Link>
          </div>
          {data.pendingMedecins.length === 0 && <p className="text-xs text-ardoise/60 py-4 text-center">Aucune demande en attente.</p>}
          <div className="flex flex-col gap-2">
            {data.pendingMedecins.map((m) => (
              <Link key={m.id} href="/admin/medecins" className="flex items-center justify-between rounded-xl bg-papier px-3.5 py-2.5 hover:bg-sauge-clair/40 transition-colors">
                <div>
                  <p className="text-sm text-encre">Dr. {m.nomComplet}</p>
                  <p className="text-xs text-ardoise">{m.specialite}</p>
                </div>
                <span className="text-[11px] text-ardoise/50">{timeAgo(m.createdAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-encre">Dossiers urgents non traités</p>
            <Link href="/admin/dossiers?niveauPriorite=URGENT" className="text-xs text-sauge font-medium hover:underline">Voir tout</Link>
          </div>
          {data.urgentDossiers.length === 0 && <p className="text-xs text-ardoise/60 py-4 text-center">Aucun dossier urgent en attente.</p>}
          <div className="flex flex-col gap-2">
            {data.urgentDossiers.map((d) => (
              <Link key={d.id} href={`/admin/dossiers/${d.id}`} className="flex items-center justify-between rounded-xl bg-urgent-fond px-3.5 py-2.5 hover:opacity-80 transition-opacity">
                <p className="text-sm text-urgent-doux">{d.patient.prenom} {d.patient.nom}</p>
                <span className="text-[11px] text-urgent-doux/70">{timeAgo(d.createdAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}