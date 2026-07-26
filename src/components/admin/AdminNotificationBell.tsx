"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listNotifications } from "@/lib/api/notifications";

export default function AdminNotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    function load() {
      listNotifications().then((data) => setUnread(data.nonLues)).catch(() => {});
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/admin/notifications"
      className="relative w-9 h-9 rounded-lg bg-white border border-ardoise/15 flex items-center justify-center text-ardoise hover:border-sauge/30 hover:text-sauge transition-colors"
      aria-label="Notifications"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3a5 5 0 015 5v3.2c0 .7.24 1.38.68 1.92L19 15H5l1.32-1.88c.44-.54.68-1.22.68-1.92V8a5 5 0 015-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 18a2.5 2.5 0 005 0" strokeLinecap="round" />
      </svg>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-urgent text-white text-[10px] font-medium flex items-center justify-center">
          {unread}
        </span>
      )}
    </Link>
  );
}