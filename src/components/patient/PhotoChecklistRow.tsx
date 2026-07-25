import { PhotoChecks } from "@/lib/photoChecks";

const CHECK_LABELS: { key: keyof PhotoChecks; label: string }[] = [
  { key: "luminosite", label: "Luminosité" },
  { key: "cadrage", label: "Cadrage" },
  { key: "nettete", label: "Netteté" },
  { key: "distance", label: "Distance" },
];

export default function PhotoChecklistRow({
  filename,
  url,
  checks,
  onRemove,
}: {
  filename: string;
  url: string;
  checks: PhotoChecks | null;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-ardoise/10 px-4 py-3.5">
      <img src={url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-encre truncate mb-1.5">{filename}</p>
        {!checks && <p className="text-xs text-ardoise">Analyse en cours...</p>}
        {checks && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {CHECK_LABELS.map(({ key, label }) => {
              const ok = checks[key];
              return (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ok ? "#1B7A3D" : "#B00020"} strokeWidth="2.5">
                    {ok ? (
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    )}
                  </svg>
                  <span className={ok ? "text-encre" : "text-urgent-doux"}>
                    {ok ? "Conforme" : "À vérifier"} <span className="text-ardoise">{label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button onClick={onRemove} className="text-ardoise/50 hover:text-urgent shrink-0" aria-label="Supprimer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}