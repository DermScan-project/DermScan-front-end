import Link from "next/link";

export default function StatCard({
  value,
  label,
  href,
  tone = "default",
}: {
  value: number;
  label: string;
  href: string;
  tone?: "default" | "urgent";
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border p-5 hover:shadow-sm transition-shadow ${
        tone === "urgent" ? "bg-urgent-fond border-urgent/10" : "bg-sauge-clair/40 border-sauge-clair"
      }`}
    >
      <p className={`font-display text-3xl mb-1 ${tone === "urgent" ? "text-urgent-doux" : "text-sauge"}`}>{value}</p>
      <div className="flex items-center gap-1 text-sm text-ardoise">
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}