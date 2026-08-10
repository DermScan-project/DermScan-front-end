"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { loginAdmin } from "@/lib/api/adminAuth";
import { useAuth } from "@/context/AuthContext";

const AdminIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
    <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const REMEMBER_KEY = "DermaLink_admin_remembered_email";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill email if it was remembered from a previous login
  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      await refreshUser();
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.error || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell icon={AdminIcon} title="Administration" subtitle="DermaLink · Accès restreint">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" autoComplete="username" placeholder="Entrez votre email ici" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <PasswordInput label="Mot de passe" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label className="flex items-center gap-2 text-sm text-ardoise cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-ardoise/30 text-sauge focus:ring-sauge accent-sauge"
          />
          Se souvenir de moi
        </label>

        <InfoChip>Accès réservé aux administrateurs</InfoChip>

        {error && <p className="text-sm text-urgent">{error}</p>}

        <Button type="submit" size="lg" fullWidth disabled={loading}>
          {loading ? "Connexion..." : "Continuer"}
        </Button>
      </form>

      <p className="text-sm text-ardoise mt-5 text-center">
        <Link href="/admin/forgot-password" className="hover:text-sauge">Mot de passe oublié ?</Link>
      </p>
    </AuthShell>
  );
}