"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PortalHeader from "@/components/ui/PortalHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { lookupPatientByNumeroSecu, getMedecinDocumentDownloadUrl, PatientLookupResult } from "@/lib/api/medecinDossiers";
import { downloadViaSignedUrl, openViaSignedUrl } from "@/lib/downloadFile";

const STORAGE_KEY = "medecinPatientLookup";

function calculateAge(dateNaissance: string) {
  const today = new Date();
  const birth = new Date(dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function niveauColor(niveau: string) {
  if (niveau === "URGENT") return "bg-urgent-fond text-urgent-doux";
  if (niveau === "MOYENNEMENT_URGENT") return "bg-[#FBF3DD] text-modere";
  return "bg-sauge-clair text-sauge";
}

export default function PatientLookupPage() {
  const [numeroSecu, setNumeroSecu] = useState("");
  const [result, setResult] = useState<PatientLookupResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Restore the last search (if any) when the page mounts — e.g. coming back
  // from a dossier detail page via the back button.
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNumeroSecu(parsed.numeroSecu || "");
        setResult(parsed.result || null);
        setError(parsed.error || "");
        setSearched(parsed.searched || false);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    setSearched(true);
    try {
      const data = await lookupPatientByNumeroSecu(numeroSecu);
      setResult(data);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ numeroSecu, result: data, error: "", searched: true }));
    } catch (err: any) {
      const errMsg = err.error || "Une erreur est survenue.";
      setError(errMsg);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ numeroSecu, result: null, error: errMsg, searched: true }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Rechercher un patient" subtitle="Par numéro de sécurité sociale" onBack={() => (window.location.href = "/medecin/dashboard")} />

      <div className="p-5 max-w-full mx-auto  flex flex-col gap-4">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-ardoise/10 p-5 flex flex-col gap-3">
          <Input
            label="Numéro de sécurité sociale"
            placeholder="15 chiffres"
            value={numeroSecu}
            onChange={(e) => setNumeroSecu(e.target.value)}
            maxLength={15}
            required
          />
          <p className="text-xs text-ardoise/60">
            Chaque recherche est journalisée à des fins de traçabilité et de conformité RGPD.
          </p>
          <Button type="submit" disabled={loading}>{loading ? "Recherche..." : "Rechercher"}</Button>
        </form>

        {error && (
          <div className="rounded-xl bg-urgent-fond border border-urgent/10 px-4 py-3">
            <p className="text-sm text-urgent-doux">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.7">
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-encre">
                  {result.patient.prenom} {result.patient.nom}, {calculateAge(result.patient.dateNaissance)} ans
                </p>
                <p className="text-xs text-ardoise">{result.patient.sexe}</p>
              </div>
            </div>

            <p className="text-xs font-medium text-ardoise/70 uppercase tracking-wide mb-2">
              Dossiers d'analyse ({result.dossiers?.length || 0})
            </p>

            {(!result.dossiers || result.dossiers.length === 0) && (
              <p className="text-xs text-ardoise/60 mb-4">Ce patient n'a aucun dossier d'analyse.</p>
            )}

            {result.dossiers && result.dossiers.length > 0 && (
              <div className="flex flex-col gap-2 mb-5">
                {result.dossiers.map((d: any) => (
                  <Link
                    key={d.id}
                    href={`/medecin/dossiers/${d.id}?from=lookup`}
                    className="flex items-center justify-between rounded-xl bg-papier px-3.5 py-3 hover:bg-papier/70 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-encre">
                        {new Date(d.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-xs text-ardoise">
                        {d.statut === "EVALUE"
                          ? `Évalué${d.medecinEvaluateur ? ` par Dr. ${d.medecinEvaluateur.nomComplet}` : ""}`
                          : "En attente d'évaluation"}
                      </span>
                    </div>
                    {d.niveauPriorite && (
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${niveauColor(d.niveauPriorite)}`}>
                        {d.niveauPriorite.replace(/_/g, " ")}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <p className="text-xs font-medium text-ardoise/70 uppercase tracking-wide mb-2">
              Documents ({result.documents.length})
            </p>

            {result.documents.length === 0 && (
              <p className="text-xs text-ardoise/60">Ce patient n'a ajouté aucun document.</p>
            )}

        <div className="flex flex-col gap-2">
  {result.documents.map((doc) => (
    <div
      key={doc.id}
      className="flex items-center gap-3 rounded-xl bg-papier px-3.5 py-3"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B3A2D"
        strokeWidth="1.6"
        className="shrink-0"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
        <path d="M14 2v6h6" strokeLinejoin="round" />
      </svg>

      <button
        onClick={() =>
          openViaSignedUrl(() => getMedecinDocumentDownloadUrl(doc.id))
        }
        className="flex-1 text-left text-sm text-encre hover:text-sauge truncate"
      >
        {doc.nom}
      </button>

      <button
        onClick={() =>
          downloadViaSignedUrl(
            () => getMedecinDocumentDownloadUrl(doc.id),
            doc.nom
          )
        }
        className="text-ardoise/50 hover:text-sauge shrink-0"
        aria-label="Télécharger"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  ))}
</div>
          </div>
        )}
      </div>
    </div>
  );
}