"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import DocumentCategorySection from "@/components/patient/DocumentCategorySection";
import DocumentDrawer from "@/components/patient/DocumentDrawer";
import { listMyDocuments, uploadDocument, deleteDocument, PatientDocument } from "@/lib/api/patientAuth";
import { DOCUMENT_CATEGORIES, DocumentCategorie } from "@/lib/documentCategories";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCategory, setUploadingCategory] = useState<DocumentCategorie | null>(null);
  const [error, setError] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<PatientDocument | null>(null);

  function load() {
    setLoading(true);
    listMyDocuments().then((data) => setDocuments(data.documents)).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(categorie: DocumentCategorie, file: File) {
    setUploadingCategory(categorie);
    setError("");
    try {
      await uploadDocument(file, categorie);
      load();
    } catch (err: any) {
      setError(err.error || "Échec de l'envoi.");
    } finally {
      setUploadingCategory(null);
    }
  }

  async function handleDelete(id: string) {
    await deleteDocument(id).catch(() => {});
    load();
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Synthèse médicale" subtitle="Portail Patient" onBack={() => (window.location.href = "/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <p className="text-sm text-ardoise">
          Conservez vos documents médicaux ici, organisés par catégorie. Ils resteront associés à votre profil et pourront
          être consultés par un médecin lors d'une évaluation, ou via votre numéro de sécurité sociale.
        </p>

        {error && <p className="text-sm text-urgent">{error}</p>}

        {loading && <p className="text-sm text-ardoise text-center py-6">Chargement...</p>}

        {!loading && DOCUMENT_CATEGORIES.map((cat) => (
          <DocumentCategorySection
            key={cat.key}
            label={cat.label}
            description={cat.description}
            documents={documents.filter((d) => d.categorie === cat.key)}
            uploading={uploadingCategory === cat.key}
            onUpload={(file) => handleUpload(cat.key, file)}
            onDelete={handleDelete}
            onView={(doc) => setSelectedDoc(doc)}
          />
        ))}
      </div>

      <DocumentDrawer
        doc={selectedDoc}
        open={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}