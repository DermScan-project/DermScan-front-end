interface AvisOption {
  value: string;
  title: string;
  desc: string;
}

const OPTIONS: AvisOption[] = [
  { value: "CONSULTATION_URGENTE", title: "Urgence", desc: "Voir un dermatologue sous 3 mois" },
  { value: "CONSULTATION_RECOMMANDEE", title: "Urgence modérée", desc: "Voir un dermatologue sous 6 mois" },
  { value: "PAS_URGENCE", title: "Pas urgent", desc: "Voir un dermatologue dans l'année" },
];

export default function AvisSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors ${
              active ? "border-sauge bg-sauge-clair/40" : "border-ardoise/15 bg-white hover:border-sauge/30"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-encre">{opt.title}</p>
              <p className="text-xs text-ardoise">{opt.desc}</p>
            </div>
            {active && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}