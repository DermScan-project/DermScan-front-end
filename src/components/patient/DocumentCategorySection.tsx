"use client";

import { PatientDocument } from "@/lib/api/patientAuth";
import { downloadViaSignedUrl } from "@/lib/downloadFile";
import { getDocumentDownloadUrl } from "@/lib/api/patientAuth";

export default function DocumentCategorySection({
  label,
  description,
  documents,
  uploading,
  onUpload,
  onDelete,
  onView,
}: {
  label: string;
  description: string;
  documents: PatientDocument[];
  uploading: boolean;
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  onView: (doc: PatientDocument) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-encre">{label}</p>
        <label className="text-xs font-medium text-sauge cursor-pointer hover:underline">
          {uploading ? "Envoi..." : "+ Ajouter"}
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className="text-xs text-ardoise/60 mb-3">{description}</p>

      {documents.length === 0 && (
        <p className="text-xs text-ardoise/50 py-2">Aucun document.</p>
      )}

      <div className="flex flex-col gap-2">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 bg-papier rounded-xl px-3.5 py-2.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6" className="shrink-0">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
              <path d="M14 2v6h6" strokeLinejoin="round" />
            </svg>
            <button
              onClick={() => onView(doc)}
              className="flex-1 text-sm text-encre hover:text-sauge truncate text-left"
            >
              {doc.nom}
            </button>
            <button onClick={() => downloadViaSignedUrl(() => getDocumentDownloadUrl(doc.id), doc.nom)} className="text-ardoise/50 hover:text-sauge shrink-0" aria-label="Télécharger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={() => onDelete(doc.id)} className="text-ardoise/50 hover:text-urgent shrink-0" aria-label="Supprimer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}