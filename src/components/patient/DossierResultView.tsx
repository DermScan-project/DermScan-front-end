"use client";

import { useState } from "react";
import Link from "next/link";
import { Dossier } from "@/lib/types";
import { AVIS_CONFIG, AvisMedical } from "@/lib/avisMedical";
import PdfDrawer from "./PdfDrawer";

export default function DossierResultView({ dossier }: { dossier: Dossier }) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const avis = AVIS_CONFIG[dossier.avisMedical as AvisMedical];

  const evaluatedDate = dossier.evaluatedAt
    ? new Date(dossier.evaluatedAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })
    : "";

  return (
    <div className="px-5 py-6 max-w-full mx-auto flex flex-col gap-4">
      <div className={`rounded-2xl border ${avis.border} ${avis.bg} p-5`}>
        <p className={`text-[11px] tracking-wide uppercase font-medium ${avis.text} mb-1`}>{avis.label}</p>
        <h1 className={`font-display text-xl ${avis.text} mb-3`}>{avis.title}</h1>
        <div className="w-full border-t border-ardoise/15 mb-3" />
        <p className="text-xs text-encre leading-relaxed">{dossier.messageAutomatique}</p>
        {dossier.commentaireMedecin && (
          <p className="text-xs text-encre leading-relaxed mt-3 ">Commentaire de Medcin: {dossier.commentaireMedecin} </p>
        )}
        {dossier.medecinEvaluateur && (
          <p className="text-xs text-ardoise mt-4 flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Évalué par <strong>Dr. {dossier.medecinEvaluateur.nomComplet}</strong> · {evaluatedDate}
          </p>
        )}
      </div>

      <button
        onClick={() => setPdfOpen(true)}
        className="flex items-center justify-between rounded-xl bg-white border border-ardoise/10 px-4 py-3.5 hover:border-sauge/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sauge-clair flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
              <path d="M14 2v6h6" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-medium text-encre">Compte-rendu PDF</span>
        </div>
        <span className="text-xs text-sauge font-medium">Voir →</span>
      </button>

      <div className="flex items-start gap-2 rounded-xl bg-urgent/5 border border-urgent/15 px-4 py-3 text-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B00020" strokeWidth="1.8" className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
        </svg>
        <p className="text-xs text-urgent">
          Ce résultat est fourni à titre indicatif par un médecin à distance, sans examen physique direct. Il ne constitue pas un diagnostic médical. Seul un professionnel vous ayant examiné en consultation peut poser un diagnostic.
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-1">
        <Link href="/patient/medecins" className="rounded-full bg-sauge text-white text-sm font-medium py-3 text-center hover:bg-sauge/90">
          Prendre rendez-vous
        </Link>
        <Link href="/patient/dossiers/new/photos" className="rounded-full border border-ardoise/20 text-encre text-sm font-medium py-3 text-center hover:bg-sauge-clair/40">
          Nouvelle analyse
        </Link>
        
      </div>

      <PdfDrawer dossierId={dossier.id} open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </div>
  );
}