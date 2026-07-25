"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import PhotoChecklistRow from "@/components/patient/PhotoChecklistRow";
import { createDraftDossier, uploadDossierPhoto, deleteDossierPhoto } from "@/lib/api/dossiers";
import { saveDraftDossierId, getDraftDossierId } from "@/lib/draftDossier";
import { analyzePhoto, PhotoChecks } from "@/lib/photoChecks";

interface LocalPhoto {
  id: string;
  url: string;
  filename: string;
  checks: PhotoChecks | null;
}

const RECOMMENDATIONS = [
  { title: "Lumière naturelle", desc: "Éviter le flash direct" },
  { title: "10 à 15 cm", desc: "Lésion centrée et nette" },
  { title: "Image nette", desc: "Mise au point vérifiée" },
  { title: "Angle perpendiculaire", desc: "Vue de face normalisée" },
];

export default function PhotosStep() {
  const router = useRouter();
  const [dossierId, setDossierId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = getDraftDossierId();
    if (existing) {
      setDossierId(existing);
      return;
    }
    createDraftDossier().then((data) => {
      saveDraftDossierId(data.dossier.id);
      setDossierId(data.dossier.id);
    });
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || !dossierId) return;
    setError("");
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const { photo } = await uploadDossierPhoto(dossierId, file);
        setPhotos((p) => [...p, { id: photo.id, url: photo.url, filename: file.name, checks: null }]);
        analyzePhoto(file).then((checks) => {
          setPhotos((p) => p.map((ph) => (ph.id === photo.id ? { ...ph, checks } : ph)));
        });
      }
    } catch (err: any) {
      setError(err.error || "Échec de l'envoi d'une photo.");
    } finally {
      setUploading(false);
    }
  }

  async function removePhoto(photoId: string) {
    if (!dossierId) return;
    await deleteDossierPhoto(dossierId, photoId).catch(() => {});
    setPhotos((p) => p.filter((ph) => ph.id !== photoId));
  }

  function goNext() {
    if (photos.length === 0) return;
    router.push("/patient/dossiers/new/questionnaire");
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Documentation photographique" subtitle="Étape 1 sur 2" onBack={() => router.push("/patient/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-sm font-medium text-encre mb-3">Recommandations photo</p>
          <div className="grid grid-cols-2 gap-2.5">
            {RECOMMENDATIONS.map((r) => (
              <div key={r.title} className="rounded-lg bg-papier px-3.5 py-2.5">
                <p className="text-sm font-medium text-encre">{r.title}</p>
                <p className="text-xs text-ardoise">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <label className="border-2 border-dashed border-ardoise/25 rounded-2xl py-10 flex flex-col items-center gap-2 cursor-pointer hover:border-sauge/40 transition-colors bg-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
            <path d="M4 8a2 2 0 012-2h1.5l1-2h7l1 2H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
          <p className="text-sm font-medium text-encre">Ajouter des photographies</p>
          <p className="text-xs text-ardoise">Sélection multiple · Appareil photo ou galerie</p>
          <input type="file" accept="image/*" multiple capture="environment" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>

        {uploading && <p className="text-sm text-ardoise text-center">Envoi en cours...</p>}
        {error && <p className="text-sm text-urgent text-center">{error}</p>}

        {photos.length > 0 && (
          <div className="flex flex-col gap-2">
            {photos.map((p) => (
              <PhotoChecklistRow
                key={p.id}
                filename={p.filename}
                url={p.url}
                checks={p.checks}
                onRemove={() => removePhoto(p.id)}
              />
            ))}
          </div>
        )}

        <button
          onClick={goNext}
          disabled={photos.length === 0}
          className="w-full rounded-full bg-sauge text-white text-sm font-medium py-3.5 disabled:bg-ardoise/30 disabled:cursor-not-allowed hover:bg-sauge/90 transition-colors mt-2"
        >
          Continuer vers le questionnaire
        </button>
      </div>
    </div>
  );
}