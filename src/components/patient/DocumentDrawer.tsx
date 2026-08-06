"use client";

import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { PatientDocument, getDocumentDownloadUrl } from "@/lib/api/patientAuth";

export default function DocumentDrawer({
  doc,
  open,
  onClose,
}: {
  doc: PatientDocument | null;
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !doc) return;
    setUrl(null);
    setLoading(true);
    setError("");
    getDocumentDownloadUrl(doc.id)
      .then(({ url: signedUrl }) => fetch(signedUrl))
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => setUrl(URL.createObjectURL(blob)))
      .catch(() => setError("Impossible de charger le document."))
      .finally(() => setLoading(false));
  }, [open, doc]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const downloadButton =
    url && doc ? (
      <a
        href={url}
        download={doc.nom}
        className="rounded-full bg-sauge text-white text-xs font-medium px-3.5 py-2 hover:bg-sauge/90"
      >
        Télécharger
      </a>
    ) : null;

  return (
    <Drawer open={open} onClose={onClose} title={doc?.nom || "Document"} headerRight={downloadButton}>
      <div className="h-full bg-ardoise/5">
        {loading && <p className="text-sm text-ardoise text-center mt-10">Chargement du document...</p>}
        {error && <p className="text-sm text-urgent text-center mt-10">{error}</p>}
        {url && <iframe src={url} className="w-full h-full" title={doc?.nom || "Document"} />}
      </div>
    </Drawer>
  );
}