"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { MedecinIcon } from "@/components/ui/icons";
import { loginMedecinPassword, requestMedecinOtp, verifyMedecinOtp } from "@/lib/api/medecinAuth";
import { useAuth } from "@/context/AuthContext";

type Tab = "RPPS" | "PASSWORD";

export default function MedecinLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("RPPS");

  // Password tab state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // RPPS/OTP tab state
  const [rpps, setRpps] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginMedecinPassword(email, password);
      await refreshUser();
      router.push("/medecin/dashboard");
    } catch (err: any) {
      setError(err.error || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await requestMedecinOtp(rpps);
      setMessage(data.message);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyMedecinOtp(rpps, code);
      await refreshUser();
      router.push("/medecin/dashboard");
    } catch (err: any) {
      setError(err.error || "Code invalide.");
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
    setMessage("");
  }

  return (
    <AuthShell icon={MedecinIcon} title="Portail Médecin" subtitle="Connexion sécurisée RPPS · DermaLink Pro">
      <div className="flex gap-1 bg-papier rounded-full p-1 mb-5">
        <button
          type="button"
          onClick={() => switchTab("RPPS")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            tab === "RPPS" ? "bg-white text-encre shadow-sm" : "text-ardoise"
          }`}
        >
          Connexion RPPS
        </button>
        <button
          type="button"
          onClick={() => switchTab("PASSWORD")}
          className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
            tab === "PASSWORD" ? "bg-white text-encre shadow-sm" : "text-ardoise"
          }`}
        >
          Email 
        </button>
      </div>

      {tab === "RPPS" && !otpSent && (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <Input label="Numéro RPPS" placeholder="Ex : 10001234567" value={rpps} onChange={(e) => setRpps(e.target.value)} required />
          <InfoChip>Connexion chiffrée · RGPD · Vérification CPS</InfoChip>
          {error && <p className="text-sm text-urgent">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? "Envoi..." : "Continuer"}
          </Button>
        </form>
      )}

      {tab === "RPPS" && otpSent && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          {message && <p className="text-xs text-sauge">{message}</p>}
          {/* <Input label="Code reçu par WhatsApp" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required /> */}
          <Input label="Code reçu par email" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} required />
          {error && <p className="text-sm text-urgent">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? "Vérification..." : "Vérifier le code"}
          </Button>
          <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-ardoise hover:text-sauge self-center">
            Renvoyer un code
          </button>
        </form>
      )}

      {tab === "PASSWORD" && (
        <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <PasswordInput label="Mot de passe" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <InfoChip>Connexion chiffrée · RGPD</InfoChip>
          {error && <p className="text-sm text-urgent">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? "Connexion..." : "Continuer"}
          </Button>
        </form>
      )}

      <div className="flex justify-between mt-5 text-sm">
        <Link href="/medecin/forgot-password" className="text-ardoise hover:text-sauge">Mot de passe oublié ?</Link>
        <Link href="/medecin/register" className="text-sauge font-medium">S'inscrire</Link>
      </div>
    </AuthShell>
  );
}