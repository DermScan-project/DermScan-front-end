import { AppNotification } from "@/lib/api/notifications";
import { NOTIFICATION_ICONS } from "@/lib/notificationTypes";
import { formatRelativeTime } from "@/lib/dates";

const ICONS: Record<string, React.ReactNode> = {
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a5 5 0 015 5v3.2c0 .7.24 1.38.68 1.92L19 15H5l1.32-1.88c.44-.54.68-1.22.68-1.92V8a5 5 0 015-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 18a2.5 2.5 0 005 0" strokeLinecap="round" />
    </svg>
  ),
};

export default function NotificationItem({
  notification,
  onClick,
}: {
  notification: AppNotification;
  onClick: () => void;
}) {
  const iconKey = NOTIFICATION_ICONS[notification.type] || "bell";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start gap-3 text-left px-4 py-3.5 rounded-2xl border transition-colors ${
        notification.lu
          ? "bg-white border-ardoise/10"
          : "bg-sauge-clair/40 border-sauge-clair"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          notification.lu ? "bg-ardoise/10 text-ardoise" : "bg-sauge text-white"
        }`}
      >
        {ICONS[iconKey]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm ${notification.lu ? "font-medium text-encre" : "font-semibold text-encre"}`}>
            {notification.titre}
          </p>
          {!notification.lu && <span className="w-2 h-2 rounded-full bg-sauge shrink-0" />}
        </div>
        <p className="text-xs text-ardoise mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-[11px] text-ardoise/50 mt-1">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </button>
  );
}