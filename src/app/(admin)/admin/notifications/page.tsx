"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import NotificationItem from "@/components/patient/NotificationItem";
import {
  listNotifications, markNotificationRead, markAllNotificationsRead, AppNotification,
} from "@/lib/api/notifications";

function adminNotificationHref(n: AppNotification): string | null {
  if (n.type === "MEDECIN_INSCRIT" && n.data?.medecinId) return "/admin/medecins";
  return null;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    listNotifications()
      .then((data) => setNotifications(data.notifications))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.lu).length;

  async function handleClick(n: AppNotification) {
    if (!n.lu) {
      await markNotificationRead(n.id).catch(() => {});
      setNotifications((list) => list.map((item) => (item.id === n.id ? { ...item, lu: true } : item)));
    }
    const href = adminNotificationHref(n);
    if (href) window.location.href = href;
  }

  async function handleMarkAll() {
    await markAllNotificationsRead().catch(() => {});
    setNotifications((list) => list.map((n) => ({ ...n, lu: true })));
  }

  return (
    <div className="max-w-full">
      <AdminPageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
        right={
          unreadCount > 0 && (
            <button onClick={handleMarkAll} className="text-xs font-medium text-sauge hover:underline">
              Tout marquer comme lu
            </button>
          )
        }
      />

      <div className="p-8 pt-6 flex flex-col gap-3">
        {loading && <p className="text-sm text-ardoise text-center py-8">Chargement...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-sm text-ardoise text-center py-16">Aucune notification.</p>
        )}

        {!loading && notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onClick={() => handleClick(n)} />
        ))}
      </div>
    </div>
  );
}