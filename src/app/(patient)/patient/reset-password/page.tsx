"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/ui/AuthShell";
import { PatientIcon } from "@/components/ui/icons";
import { resetPatientPassword } from "@/lib/api/patientAuth";

function ResetPasswordContent() {
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
      await resetPatientPassword(token, newPassword);
      setDone(true);
      setTimeout(() => router.push("/patient/login"), 2000);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell icon={PatientIcon} title="Nouveau mot de passe" subtitle="Portail Patient">
      {done ? (
        <p className="text-sm text-sauge text-center">Mot de passe réinitialisé. Redirection...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput label="Nouveau mot de passe" placeholder="8 caractères min." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          {error && <p className="text-sm text-urgent">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={loading}>{loading ? "..." : "Réinitialiser"}</Button>
        </form>
      )}
    </AuthShell>
  );
}
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-5">Chargement...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}