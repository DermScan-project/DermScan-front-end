import Link from "next/link";
import { ReactNode } from "react";

export default function ActionCard({
  icon,
  title,
  description,
  buttonLabel,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-ardoise/10 border-l-4 border-l-sauge p-5">
      <div className="w-9 h-9 rounded-xl bg-sauge-clair flex items-center justify-center mb-3">{icon}</div>
      <p className="font-display text-md text-encre mb-1">{title}</p>
      <p className="text-xs text-ardoise mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full bg-sauge text-white text-xs font-medium px-4 py-2 hover:bg-sauge/90 transition-colors"
      >
        {buttonLabel}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}