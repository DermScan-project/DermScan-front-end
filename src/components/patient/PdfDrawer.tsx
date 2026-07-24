"use client";

import { useEffect, useState } from "react";
import { fetchDossierPdfBlob } from "@/lib/api/dossiers";
import Drawer from "@/components/ui/Drawer";

export default function PdfDrawer({
  dossierId,
  open,
  onClose,
}: {
  dossierId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || url) return;
    setLoading(true);
    setError("");
    fetchDossierPdfBlob(dossierId)
      .then((blob) => setUrl(URL.createObjectURL(blob)))
      .catch(() => setError("Impossible de charger le rapport."))
      .finally(() => setLoading(false));
  }, [open, dossierId, url]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Rapport de télé-expertise"
      headerRight={
     url && (
          <a
            href={url}
            download={`dermscan-compte-rendu-${dossierId}.pdf`}
            className="rounded-full bg-sauge text-white text-xs font-medium px-3.5 py-2 hover:bg-sauge/90"
          >
            Télécharger
          </a>
        
        )
      }
    >
      <div className="h-full bg-ardoise/5">
        {loading && <p className="text-sm text-ardoise text-center mt-10">Chargement du rapport...</p>}
        {error && <p className="text-sm text-urgent text-center mt-10">{error}</p>}
        {url && <iframe src={url} className="w-full h-full" title="Rapport PDF" />}
      </div>
    </Drawer>
  );
}