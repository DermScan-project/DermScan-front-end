"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PortalHeader from "@/components/ui/PortalHeader";
import HeaderActions from "@/components/ui/HeaderActions";
import DossierStatusCard from "@/components/patient/DossierStatusCard";
import ActionCard from "@/components/patient/ActionCard";
import TotalDossiersLink from "@/components/patient/TotalDossiersLink";
import { listMyDossiers } from "@/lib/api/dossiers";
import { Dossier } from "@/lib/types";

const MAX_VISIBLE = 1;

const CameraIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
    <path d="M4 8a2 2 0 012-2h1.5l1-2h7l1 2H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

const MapIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
    <path d="M9 4L4 6v14l5-2 6 2 5-2V4l-5 2-6-2z" strokeLinejoin="round" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);
const CalendarIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
  </svg>
);

function DossierSkeleton() {
  return (
    <div className="rounded-2xl border border-ardoise/10 bg-white px-4 py-3.5 flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-ardoise/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 bg-ardoise/10 rounded" />
        <div className="h-2.5 w-44 bg-ardoise/10 rounded" />
      </div>
    </div>
  );
}

function EmptyDossiers() {
  return (
    <div className="rounded-2xl border border-dashed border-ardoise/20 bg-white/60 px-5 py-8 flex flex-col items-center text-center gap-2">
      <div className="w-10 h-10 rounded-full bg-sauge-clair flex items-center justify-center">
        <span className="scale-90 text-sauge">{CameraIcon}</span>
      </div>
      <p className="text-sm font-medium text-ardoise">Aucune analyse pour l'instant</p>
      <p className="text-xs text-ardoise/70 max-w-[240px]">
        Commencez votre première analyse ci-dessous, un médecin évaluera votre dossier.
      </p>
    </div>
  );
}

export default function PatientDashboard() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyDossiers()
      .then((data) => setDossiers(data.dossiers))
      .finally(() => setLoading(false));
  }, []);

  const activeDossiers = dossiers.filter((d) => d.statut !== "BROUILLON");
  const visibleDossiers = activeDossiers.slice(0, MAX_VISIBLE);
  const hiddenCount = activeDossiers.length - visibleDossiers.length;
  const hasUnread = activeDossiers.some((d) => d.statut === "EVALUE");

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="DermScan"
        subtitle="Portail Patient"
        onBack={() => (window.location.href = "/")}
        right={<HeaderActions hasUnread={hasUnread} />}
      />

      <div className="p-5 flex flex-col gap-6 max-w-full mx-auto">
        <section className="flex flex-col gap-3">
          <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium">
            Mes analyses · {activeDossiers.length} dossier{activeDossiers.length !== 1 ? "s" : ""}
          </p>

          {loading && <DossierSkeleton />}
          {!loading && activeDossiers.length === 0 && <EmptyDossiers />}
          {!loading && visibleDossiers.map((d) => <DossierStatusCard key={d.id} dossier={d} />)}

          {/* {!loading && hiddenCount > 0 && (
            <Link
              href="/patient/dossiers"
              className="self-start text-xs font-medium text-sauge hover:underline pl-1"
            >
              Voir {hiddenCount} de plus →
            </Link>
          )} */}

          {!loading && dossiers.length > 0 && (
            <TotalDossiersLink total={dossiers.length} href="/patient/dossiers" />
          )}
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium">
            Que souhaitez-vous faire ?
          </p>
          <div className="flex flex-col gap-3">
            <ActionCard
              icon={CameraIcon}
              title="Analyser ma lésion"
              description="Photographiez votre lésion et remplissez le questionnaire ABCDE. Un médecin évalue votre dossier et vous répond directement."
              buttonLabel="Commencer l'analyse"
              href="/patient/dossiers/new/photos"
            />
            <ActionCard
              icon={MapIcon}
              title="Trouver un médecin"
              description="Consultez les créneaux disponibles des praticiens référencés et réservez directement."
              buttonLabel="Voir les disponibilités"
              href="/patient/medecins"
            />

            <ActionCard
  icon={CalendarIcon}
  title="Mes rendez-vous"
  description="Consultez vos rendez-vous à venir et passés avec vos médecins."
  buttonLabel="Voir mes rendez-vous"
  href="/patient/rendez-vous"
/>
          </div>
        </section>
      </div>
    </div>
  );
}