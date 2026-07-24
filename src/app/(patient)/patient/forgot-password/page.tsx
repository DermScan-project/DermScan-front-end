"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AuthShell } from "@/components/ui/AuthShell";
import { PatientIcon } from "@/components/ui/icons";
import { forgotPatientPassword } from "@/lib/api/patientAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await forgotPatientPassword(email).catch(() => {});
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell icon={PatientIcon} title="Mot de passe oublié" subtitle="Portail Patient">
      {sent ? (
        <p className="text-sm text-encre text-center"> un lien de Réinitialisation de votre mot de passea été envoyé, Vérifiez votre adresse e-mail</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" size="lg" fullWidth disabled={loading}>{loading ? "Envoi..." : "Envoyer le lien"}</Button>
        </form>
      )}
    </AuthShell>
  );
}