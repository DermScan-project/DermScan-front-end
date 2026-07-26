"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthShell } from "@/components/ui/AuthShell";
import { MedecinIcon } from "@/components/ui/icons";
import { forgotMedecinPassword } from "@/lib/api/medecinAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await forgotMedecinPassword(email).catch(() => {});
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell icon={MedecinIcon} title="Mot de passe oublié" subtitle="Portail Médecin">
      {sent ? (
        <p className="text-sm text-encre text-center">Si un compte existe avec cet email, un lien a été envoyé.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" size="lg" fullWidth disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien"}</Button>
        </form>
      )}
    </AuthShell>
  );
}