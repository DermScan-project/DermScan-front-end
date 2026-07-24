import Link from "next/link";

export default function TotalDossiersLink({
  total,
  href = "/patient/dossiers",
}: {
  total: number;
  href?: string;
}) {
  if (total === 0) return null;

  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl bg-white/60 border border-ardoise/10 px-4 py-3 text-sm text-ardoise hover:bg-white transition-colors"
    >
      <span>
        <span className="font-medium text-encre">{total}</span> analyse{total > 1 ? "s" : ""} au total
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-ardoise/50 group-hover:translate-x-0.5 transition-transform"
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}