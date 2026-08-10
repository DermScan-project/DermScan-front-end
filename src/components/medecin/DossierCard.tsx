"use client";

export default function DossierCard({
  url,
  isMine,
}: {
  url: string;
  isMine: boolean;
}) {
  const dossierId = url.split("/dossiers/")[1];

  return (
    <div
      className={[
        "rounded-xl border p-3 flex flex-col gap-2 min-w-[220px]",
        isMine
          ? "border-white/20 bg-white/10"
          : "border-ardoise/15 bg-papier",
      ].join(" ")}
    >
      <div
        className={[
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          isMine ? "bg-white/15" : "bg-sauge-clair",
        ].join(" ")}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isMine ? "#fff" : "#1B3A2D"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h6l2 2h8v14H4V4z" />
        </svg>
      </div>

      <p
        className={[
          "text-xs font-semibold",
          isMine ? "text-white" : "text-encre",
        ].join(" ")}
      >
        Dossier partagé
      </p>

      <p
        className={[
          "text-[10px]",
          isMine ? "text-white/50" : "text-ardoise/50",
        ].join(" ")}
      >
        #{dossierId?.slice(0, 8).toUpperCase()}
      </p>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "w-full text-center text-xs font-medium py-1.5 rounded-lg transition-colors",
          isMine
            ? "bg-white/20 text-white hover:bg-white/30"
            : "bg-encre text-white hover:bg-encre/80",
        ].join(" ")}
      >
        Ouvrir le dossier
      </a>
    </div>
  );
}