import { ReactNode } from "react";

export default function AdminPageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 bg-papier border-b border-ardoise/10 px-8 py-6 flex items-center justify-between">
      <div>
        <h1 className="font-display text-3xl text-sauge mb-1">{title}</h1>
        {subtitle && <p className="text-ardoise text-sm">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}