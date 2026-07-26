interface Segment {
  label: string;
  value: number;
  color: string;
}

export default function BreakdownBar({ title, segments }: { title: string; segments: Segment[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  return (
    <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
      <p className="text-sm font-medium text-encre mb-4">{title}</p>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-ardoise/8 mb-4">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ardoise">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="text-encre font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}