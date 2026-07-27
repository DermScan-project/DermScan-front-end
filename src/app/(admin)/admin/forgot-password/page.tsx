"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthShell } from "@/components/ui/AuthShell";
import { forgotAdminPassword } from "@/lib/api/adminAuth";

const AdminIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await forgotAdminPassword(email).catch(() => {});
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell icon={AdminIcon} title="Mot de passe oublié" subtitle="Administration">
      {sent ? (
        <p className="text-sm text-encre text-center">Si un compte existe avec cet email, un lien a été envoyé.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" size="lg" fullWidth disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien"}</Button>
        </form>
      )}
    </AuthShell>
  );
}