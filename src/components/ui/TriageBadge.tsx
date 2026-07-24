import { clsx } from "clsx";

interface TriageBadgeProps {
  score: number; // 0-5
  niveau: "URGENT" | "MOYENNEMENT_URGENT" | "PAS_URGENT";
  size?: "sm" | "md" | "lg";
}

const NIVEAU_CONFIG = {
  URGENT: { color: "var(--color-urgent)", label: "Urgent" },
  MOYENNEMENT_URGENT: { color: "var(--color-modere)", label: "Modéré" },
  PAS_URGENT: { color: "var(--color-faible)", label: "Faible" },
};

export default function TriageBadge({ score, niveau, size = "md" }: TriageBadgeProps) {
  const config = NIVEAU_CONFIG[niveau];
  const pct = (score / 5) * 100;
  const dimensions = { sm: 48, md: 72, lg: 96 }[size];
  const stroke = { sm: 4, md: 6, lg: 8 }[size];
  const radius = (dimensions - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimensions, height: dimensions }}>
        <svg width={dimensions} height={dimensions} className="-rotate-90">
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke="var(--color-sauge-clair)"
            strokeWidth={stroke}
          />
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pct / 100) * circumference}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-medium text-encre" style={{ fontSize: dimensions / 4 }}>
          {score}/5
        </div>
      </div>
      <span
        className={clsx("text-xs font-medium px-2 py-0.5 rounded-full")}
        style={{ color: config.color, backgroundColor: `${config.color}1A` }}
      >
        {config.label}
      </span>
    </div>
  );
}