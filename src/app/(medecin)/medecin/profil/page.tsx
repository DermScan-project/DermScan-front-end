"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { updateMyMedecinProfile, forgotMedecinPassword } from "@/lib/api/medecinAuth";
import { Medecin } from "@/lib/types";

type Tab = "infos" | "password";

const TABS: { key: Tab; label: string }[] = [
  { key: "infos", label: "Informations" },
  { key: "password", label: "Mot de passe" },
];

function InfosTab() {
  const { user, refreshUser } = useAuth();
  const medecin = user as Medecin | null;

  const [specialite, setSpecialite] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresseCabinet, setAdresseCabinet] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (medecin) {
      setSpecialite(medecin.specialite || "");
      setTelephone(medecin.telephone || "");
      setAdresseCabinet(medecin.adresseCabinet || "");
    }
  }, [medecin]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await updateMyMedecinProfile({ specialite, telephone, adresseCabinet });
      await refreshUser();
      setMessage("Profil mis à jour.");
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input label="Nom complet" value={medecin?.nomComplet || ""} disabled className="opacity-60 cursor-not-allowed" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" value={medecin?.email || ""} disabled className="opacity-60 cursor-not-allowed" />
        <Input label="RPPS" value={medecin?.rpps || ""} disabled className="opacity-60 cursor-not-allowed" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Spécialité" value={specialite} onChange={(e) => setSpecialite(e.target.value)} required />
        <Input label="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
      </div>
      <Input
        label="Adresse du cabinet"
        value={adresseCabinet}
        onChange={(e) => setAdresseCabinet(e.target.value)}
      />

      {message && <p className="text-xs text-faible">{message}</p>}
      {error && <p className="text-xs text-urgent">{error}</p>}

      <Button type="submit" disabled={saving} className="self-start mt-1">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}

function PasswordTab() {
  const { user } = useAuth();
  const medecin = user as Medecin | null;
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSendReset() {
    if (!medecin?.email) return;
    setError("");
    setSending(true);
    try {
      await forgotMedecinPassword(medecin.email);
      setSent(true);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-1/2">
      <p className="text-sm text-ardoise">
        Pour modifier votre mot de passe, nous vous envoyons un lien de réinitialisation à votre adresse email
        {medecin?.email ? ` (${medecin.email})` : ""}.
      </p>

      {sent && (
        <p className="text-xs text-faible">
          Email envoyé. Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
        </p>
      )}
      {error && <p className="text-xs text-urgent">{error}</p>}

      <Button onClick={handleSendReset} disabled={sending || sent} className="self-start mt-1">
        {sending ? "Envoi..." : sent ? "Email envoyé" : "Envoyer le lien de réinitialisation"}
      </Button>
    </div>
  );
}

export default function MedecinProfilPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [tab, setTab] = useState<Tab>("infos");

  if (loading) return <p className="p-8 text-sm text-ardoise">Chargement...</p>;

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Mon profil" subtitle="Portail Médecin" onBack={() => router.push("/medecin/dashboard")} />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <div className="flex gap-1 bg-white rounded-full border border-ardoise/10 p-1 self-start">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key ? "bg-sauge text-white" : "text-ardoise hover:text-encre"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-ardoise/10 p-5">
          {tab === "infos" && <InfosTab />}
          {tab === "password" && <PasswordTab />}
        </div>
      </div>
    </div>
  );
}