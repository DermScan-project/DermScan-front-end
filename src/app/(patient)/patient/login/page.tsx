"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { PatientIcon } from "@/components/ui/icons";
import { loginPatient } from "@/lib/api/patientAuth";
import { useAuth } from "@/context/AuthContext";

export default function PatientLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginPatient(email, password);
      await refreshUser();
      router.push("/patient/dashboard");
    } catch (err: any) {
      setError(err.error || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell icon={PatientIcon} title="Portail Patient" subtitle="Connexion sécurisée · DermaLink">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" autoComplete="username" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
<PasswordInput label="Mot de passe" autoComplete="current-password" placeholder="Votre mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <InfoChip>Connexion chiffrée · RGPD</InfoChip>

        {error && <p className="text-sm text-urgent">{error}</p>}

        <Button type="submit" size="lg" fullWidth disabled={loading}>
          {loading ? "Connexion..." : "Continuer"}
        </Button>
      </form>

      <div className="flex justify-between mt-5 text-sm">
        <Link href="/patient/forgot-password" className="text-ardoise hover:text-sauge">Mot de passe oublié ?</Link>
        <Link href="/patient/register" className="text-sauge font-medium">Créer un compte</Link>
      </div>
    </AuthShell>
  );
}