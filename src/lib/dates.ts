export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffSec = Math.max(0, (Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "À l'instant";
  if (diffSec < 3600) return `Il y a ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Il y a ${Math.floor(diffSec / 3600)} h`;
  if (diffSec < 172800) return "Hier";
  if (diffSec < 604800) return `Il y a ${Math.floor(diffSec / 86400)} j`;

  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}