"use client";

import { useAuth } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-8 text-sm text-ardoise">Chargement...</p>;

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-sauge">Tableau de bord</h1>
      <p className="text-ardoise mt-2">Connecté en tant que {(user as any)?.email}</p>
    </div>
  );
}