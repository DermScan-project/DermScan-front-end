export default function KpiCard({
  value, label, sublabel, tone = "default",
}: {
  value: number | string; label: string; sublabel?: string; tone?: "default" | "urgent" | "sauge";
}) {
  const toneCls = tone === "urgent" ? "text-urgent-doux" : tone === "sauge" ? "text-sauge" : "text-encre";
  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <p className={`font-display text-3xl ${toneCls}`}>{value}</p>
      <p className="text-sm text-encre mt-1">{label}</p>
      {sublabel && <p className="text-xs text-ardoise/60 mt-0.5">{sublabel}</p>}
    </div>
  );
}