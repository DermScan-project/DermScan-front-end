import { apiFetch } from "./client";

export interface AppNotification {
  id: string;
  type: string;
  titre: string;
  message: string;
  data: Record<string, unknown> | null;
  lu: boolean;
  createdAt: string;
}

export function listNotifications() {
  return apiFetch<{ notifications: AppNotification[]; nonLues: number }>("/api/notifications");
}

export function markNotificationRead(id: string) {
  return apiFetch<{ message: string }>(`/api/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return apiFetch<{ message: string }>("/api/notifications/read-all", { method: "PATCH" });
}