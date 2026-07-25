"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import NotificationItem from "@/components/patient/NotificationItem";
import {
  listNotifications, markNotificationRead, markAllNotificationsRead, AppNotification,
} from "@/lib/api/notifications";
import { notificationHref } from "@/lib/notificationTypes";

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-ardoise/10 bg-white animate-pulse">
      <div className="w-9 h-9 rounded-full bg-ardoise/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 bg-ardoise/10 rounded" />
        <div className="h-2.5 w-48 bg-ardoise/10 rounded" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    listNotifications()
      .then((data) => setNotifications(data.notifications))
      .finally(() => setLoading(false));
  }

  const unreadCount = notifications.filter((n) => !n.lu).length;

  async function handleClick(n: AppNotification) {
    if (!n.lu) {
      await markNotificationRead(n.id).catch(() => {});
      setNotifications((list) => list.map((item) => (item.id === n.id ? { ...item, lu: true } : item)));
    }
    const href = notificationHref(n);
    if (href) router.push(href);
  }

  async function handleMarkAll() {
    await markAllNotificationsRead().catch(() => {});
    setNotifications((list) => list.map((n) => ({ ...n, lu: true })));
  }

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
        onBack={() => router.push("/patient/dashboard")}
      />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-3">
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="self-end text-xs font-medium text-sauge hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}

        {loading && (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 gap-2">
            <div className="w-12 h-12 rounded-full bg-sauge-clair flex items-center justify-center mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
                <path d="M12 3a5 5 0 015 5v3.2c0 .7.24 1.38.68 1.92L19 15H5l1.32-1.88c.44-.54.68-1.22.68-1.92V8a5 5 0 015-5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 18a2.5 2.5 0 005 0" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ardoise">Aucune notification</p>
            <p className="text-xs text-ardoise/70">Vous serez notifié ici des mises à jour de vos dossiers.</p>
          </div>
        )}

        {!loading &&
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={() => handleClick(n)} />
          ))}
      </div>
    </div>
  );
}