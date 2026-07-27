"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { changeAdminPassword } from "@/lib/api/adminAuth";

export default function AdminProfilPage() {
  const { user } = useAuth();
  const admin = user as any;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setMessage("Mot de passe modifié.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-full">
      <AdminPageHeader title="Mon profil" subtitle="Administration" />

      <div className="p-8 pt-6 flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-xs font-medium text-ardoise/70 uppercase tracking-wide mb-2">Compte</p>
          <p className="text-sm text-encre">{admin?.email}</p>
        </div>

        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          <p className="text-sm font-medium text-encre mb-4">Changer le mot de passe</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <PasswordInput label="Mot de passe actuel" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <PasswordInput label="Nouveau mot de passe" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            {message && <p className="text-xs text-faible">{message}</p>}
            {error && <p className="text-xs text-urgent">{error}</p>}
            <Button type="submit" disabled={saving} className="self-start mt-1">{saving ? "Modification..." : "Modifier le mot de passe"}</Button>
          </form>
        </div>
      </div>
    </div>
  );
}