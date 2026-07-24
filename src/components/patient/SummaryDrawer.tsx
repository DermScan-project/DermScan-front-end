"use client";

import Drawer from "@/components/ui/Drawer";
import DossierSubmissionSummary from "./DossierSubmissionSummary";
import { Dossier } from "@/lib/types";

export default function SummaryDrawer({
  dossier,
  open,
  onClose,
}: {
  dossier: Dossier;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} title="Informations soumises">
      <div className="px-5 py-5">
        <DossierSubmissionSummary dossier={dossier} />
      </div>
    </Drawer>
  );
}