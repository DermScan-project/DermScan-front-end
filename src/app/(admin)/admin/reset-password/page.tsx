"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell } from "@/components/ui/AuthShell";
import { resetAdminPassword } from "@/lib/api/adminAuth";

const AdminIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="1.5"
  >
    <path
      d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function AdminResetPasswordContent() {
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
      await resetAdminPassword(token, newPassword);
      setDone(true);

      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      icon={AdminIcon}
      title="Nouveau mot de passe"
      subtitle="Administration"
    >
      {done ? (
        <p className="text-sm text-sauge text-center">
          Mot de passe réinitialisé. Redirection...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="Nouveau mot de passe"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-urgent">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? "..." : "Réinitialiser"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AdminResetPasswordContent />
    </Suspense>
  );
}