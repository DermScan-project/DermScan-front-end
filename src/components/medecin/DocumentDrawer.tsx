"use client";

import { createElement, useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { getMedecinDocumentDownloadUrl } from "@/lib/api/medecinDossiers";

export default function DocumentDrawer({
  docId,
  docNom,
  open,
  onClose,
}: {
  docId: string | null;
  docNom: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !docId) return;
    setUrl(null);
    setLoading(true);
    setError("");
    getMedecinDocumentDownloadUrl(docId)
      .then(({ url: signedUrl }) => fetch(signedUrl))
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => setUrl(URL.createObjectURL(blob)))
      .catch(() => setError("Impossible de charger le document."))
      .finally(() => setLoading(false));
  }, [open, docId]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const downloadButton =
    url && docNom
      ? createElement(
          "a",
          {
            href: url,
            download: docNom,
            className: "rounded-full bg-sauge text-white text-xs font-medium px-3.5 py-2 hover:bg-sauge/90",
          },
          "Télécharger"
        )
      : null;

  return (
    <Drawer open={open} onClose={onClose} title={docNom || "Document"} headerRight={downloadButton}>
      <div className="h-full bg-ardoise/5">
        {loading && <p className="text-sm text-ardoise text-center mt-10">Chargement du document...</p>}
        {error && <p className="text-sm text-urgent text-center mt-10">{error}</p>}
        {url && <iframe src={url} className="w-full h-full" title={docNom || "Document"} />}
      </div>
    </Drawer>
  );
}