"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/login") || pathname.includes("/forgot-password") || pathname.includes("/reset-password");

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-papier">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}