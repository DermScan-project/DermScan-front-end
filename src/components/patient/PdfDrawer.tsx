"use client";

import { useEffect, useState } from "react";
import Drawer from "@/components/ui/Drawer";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function PdfDrawer({
  dossierId,
  open,
  onClose,
  fetchPdf,
}: {
  dossierId: string;
  open: boolean;
  onClose: () => void;
  fetchPdf: (id: string) => Promise<Blob>;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  useEffect(() => {
    if (!open || url) return;
    setLoading(true);
    setError("");
    fetchPdf(dossierId)
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        setUrl(blobUrl);
        if (isMobile()) {
          window.open(blobUrl, "_blank");
        }
      })
      .catch(() => setError("Impossible de charger le rapport."))
      .finally(() => setLoading(false));
  }, [open, dossierId, url, fetchPdf]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Rapport de triage"
      headerRight={
        url && (
          <a
            href={url}
            download={`DermaLink-compte-rendu-${dossierId}.pdf`}
            className="rounded-full bg-sauge text-white text-xs font-medium px-3.5 py-2 hover:bg-sauge/90"
          >
            Télécharger
          </a>
        )
      }
    >
      <div className="h-full bg-ardoise/5 flex flex-col items-center justify-center">
        {loading && (
          <p className="text-sm text-ardoise text-center mt-10">Chargement du rapport...</p>
        )}
        {error && (
          <p className="text-sm text-urgent text-center mt-10">{error}</p>
        )}

        {/* Desktop */}
        {url && !mobile && (
          <iframe src={url} className="w-full h-full" title="Rapport PDF" />
        )}

        {/* Mobile */}
        {url && mobile && (
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-sauge-clair flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
                <path d="M14 2v6h6" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-encre">Rapport prêt</p>
            <p className="text-xs text-ardoise">
              Le PDF s'est ouvert dans un nouvel onglet. Si ce n'est pas le cas, appuyez ci-dessous.
            </p>
            <button
              onClick={() => window.open(url, "_blank")}
              className="rounded-full bg-sauge text-white text-sm font-medium px-6 py-3 hover:bg-sauge/90"
            >
              Ouvrir le rapport
            </button>
            <a
              href={url}
              download={`DermaLink-compte-rendu-${dossierId}.pdf`}
              className="text-xs text-ardoise underline mt-1"
            >
              Ou télécharger
            </a>
          </div>
        )}
      </div>
    </Drawer>
  );
}