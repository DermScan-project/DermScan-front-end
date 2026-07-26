"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ArrowLeftIcon } from "./icons";

export default function PortalHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();

  return (
<div className="bg-sauge sticky top-0 z-20 flex items-center justify-between px-5 py-3.5">
<div className="flex items-center gap-3">
        <button
          onClick={onBack ?? (() => router.back())}
          className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white shrink-0"
          aria-label="Retour"
        >
          <span className="scale-90">{ArrowLeftIcon}</span>
        </button>
        <div>
          <p className="font-display text-[15px] text-white leading-tight">{title}</p>
          <p className="text-[11px] text-white/60 leading-tight">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
}