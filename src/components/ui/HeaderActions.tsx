"use client";

import Link from "next/link";
import { BellIcon, UserIcon } from "./icons";

export default function HeaderActions({
  hasUnread = false,
  initials,
}: {
  hasUnread?: boolean;
  initials?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/patient/notifications"
        className="relative w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
        aria-label="Notifications"
      >
        <span className="scale-90">{BellIcon}</span>
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E07856]" />
        )}
      </Link>
      <Link
        href="/patient/profil"
        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[11px] font-medium text-white hover:bg-white/15 transition-colors"
        aria-label="Mon profil"
      >
        {initials || <span className="scale-90">{UserIcon}</span>}
      </Link>
    </div>
  );
}