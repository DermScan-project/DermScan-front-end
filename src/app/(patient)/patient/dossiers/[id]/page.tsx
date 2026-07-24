"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import DossierPendingView from "@/components/patient/DossierPendingView";
import DossierResultView from "@/components/patient/DossierResultView";
import { getDossier } from "@/lib/api/dossiers";
import { Dossier } from "@/lib/types";

export default function DossierDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDossier(id)
      .then((data) => setDossier(data.dossier))
      .catch((err) => setError(err.error || "Dossier introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  const headerTitle = dossier?.statut === "EVALUE" ? "Résultat de l'évaluation" : "Dossier soumis";

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title={headerTitle} subtitle="Portail Patient" onBack={() => (window.location.href = "/patient/dashboard")} />

      {loading && <p className="text-sm text-ardoise text-center mt-10">Chargement...</p>}
      {error && <p className="text-sm text-urgent text-center mt-10">{error}</p>}

      {dossier && dossier.statut === "EVALUE" && <DossierResultView dossier={dossier} />}
      {dossier && (dossier.statut === "EN_ATTENTE" || dossier.statut === "EN_COURS") && (
        <DossierPendingView dossier={dossier} />
      )}
    </div>
  );
}