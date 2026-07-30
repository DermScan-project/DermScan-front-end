"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import {
  listMyDocuments,
  uploadDocument,
  deleteDocument,
  getDocumentDownloadUrl,
  PatientDocument,
} from "@/lib/api/patientAuth";

import {
  downloadViaSignedUrl,
  openViaSignedUrl,
} from "@/lib/downloadFile";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    listMyDocuments().then((data) => setDocuments(data.documents)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadDocument(file);
      load();
    } catch (err: any) {
      setError(err.error || "Échec de l'envoi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteDocument(id).catch(() => {});
    load();
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Mes documents" subtitle="Portail Patient" onBack={() => (window.location.href = "/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <p className="text-sm text-ardoise">
          Conservez vos documents médicaux importants ici. Ils resteront associés à votre profil et pourront être consultés
          par un médecin lors d'une évaluation, ou via votre numéro de sécurité sociale.
        </p>

        <label className="border-2 border-dashed border-ardoise/25 rounded-2xl py-8 flex flex-col items-center gap-2 cursor-pointer hover:border-sauge/40 transition-colors bg-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
            <path d="M14 2v6h6" strokeLinejoin="round" />
          </svg>
          <p className="text-sm font-medium text-encre">{uploading ? "Envoi en cours..." : "Ajouter un document"}</p>
          <p className="text-xs text-ardoise">PDF, image ou document Word</p>
          <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>

        {error && <p className="text-sm text-urgent">{error}</p>}

        {loading && <p className="text-sm text-ardoise text-center py-6">Chargement...</p>}

        {!loading && documents.length === 0 && (
          <p className="text-sm text-ardoise text-center py-8">Aucun document pour le moment.</p>
        )}

        {!loading && documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 bg-white rounded-xl border border-ardoise/10 px-4 py-3">
            <div className="w-9 h-9 rounded-lg bg-sauge-clair flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
                <path d="M14 2v6h6" strokeLinejoin="round" />
              </svg>
            </div>
           <button
  onClick={() => openViaSignedUrl(() => getDocumentDownloadUrl(doc.id))}
  className="flex-1 text-sm text-encre hover:text-sauge truncate text-left"
>
  {doc.nom}
</button>
  <button
    onClick={() =>
      downloadViaSignedUrl(() => getDocumentDownloadUrl(doc.id), doc.nom)
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
            <button onClick={() => handleDelete(doc.id)} className="text-ardoise/50 hover:text-urgent shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}