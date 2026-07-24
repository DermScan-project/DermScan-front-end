"use client";

import { useState } from "react";
import Link from "next/link";
import { Dossier } from "@/lib/types";
import SummaryDrawer from "./SummaryDrawer";

export default function DossierPendingView({ dossier }: { dossier: Dossier }) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  const steps = [
    { title: "Documentation photographique", desc: "Vérifiée et conforme" },
    { title: "Questionnaire ABCDE", desc: "Complet et enregistré" },
    { title: "Transmission sécurisée", desc: "Chiffrement de bout en bout" },
  ];

  return (
    <div className="flex flex-col items-center px-5 py-8 max-w-full mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-sauge-clair flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
          <path d="M3 8l9-5 9 5-9 5-9-5z" strokeLinejoin="round" />
          <path d="M3 8v8l9 5 9-5V8" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-display text-2xl text-encre mb-2">Dossier en cours d'évaluation</h1>
      <p className="text-sm text-ardoise mb-8">
        Notre équipe médicale analyse votre dossier. Vous serez notifié dès qu'un médecin aura rendu son évaluation.
      </p>

      <div className="w-full bg-white rounded-2xl border border-ardoise/10 divide-y divide-ardoise/10 mb-4">
        {steps.map((s) => (
          <div key={s.title} className="flex items-center gap-3 px-5 py-4">
            <div className="w-8 h-8 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B7A3D" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-encre">{s.title}</p>
              <p className="text-xs text-ardoise">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setSummaryOpen(true)}
        className="w-full flex items-center justify-between rounded-xl bg-white border border-ardoise/10 px-4 py-3.5 mb-4 hover:border-sauge/30 transition-colors"
      >
        <span className="text-sm font-medium text-encre">Voir les informations soumises</span>
        <span className="text-xs text-sauge font-medium">Voir →</span>
      </button>

      <div className="w-full flex items-start gap-2 rounded-xl bg-[#FBF3DD] px-4 py-3 mb-4 text-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.8" className="shrink-0 mt-0.5">
          <path d="M12 9v4M12 17h.01M10.3 3.9L2.5 18a1.7 1.7 0 001.5 2.5h16a1.7 1.7 0 001.5-2.5L13.7 3.9a1.7 1.7 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-xs text-[#8a6a12]">
          En cas d'aggravation rapide avant l'évaluation (saignement abondant, douleur intense), consultez directement votre médecin traitant ou les urgences.
        </p>
      </div>

      <Link
        href="/patient/medecins"
        className="w-full rounded-full bg-sauge text-white text-sm font-medium py-3 text-center hover:bg-sauge/90"
      >
        Trouver un médecin disponible
      </Link>

      <SummaryDrawer dossier={dossier} open={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </div>
  );
}