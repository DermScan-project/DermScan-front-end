"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/ui/AuthShell";
import { MedecinIcon } from "@/components/ui/icons";
import { resetMedecinPassword } from "@/lib/api/medecinAuth";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetMedecinPassword(token, newPassword);
      setDone(true);
      setTimeout(() => router.push("/medecin/login"), 2000);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell icon={MedecinIcon} title="Nouveau mot de passe" subtitle="Portail Médecin">
      {done ? (
        <p className="text-sm text-sauge text-center">Mot de passe réinitialisé. Redirection...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput label="Nouveau mot de passe" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          {error && <p className="text-sm text-urgent">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={loading}>{loading ? "..." : "Réinitialiser"}</Button>
        </form>
      )}
    </AuthShell>
  );
}