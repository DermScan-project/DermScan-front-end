"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PortalHeader from "@/components/ui/PortalHeader";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { updateMyProfile, changePatientPassword } from "@/lib/api/patientAuth";
import { listMyDossiers } from "@/lib/api/dossiers";
import { Dossier } from "@/lib/types";

type Tab = "infos" | "password" | "medecins";

const TABS: { key: Tab; label: string }[] = [
  { key: "infos", label: "Informations" },
  { key: "password", label: "Mot de passe" },
  { key: "medecins", label: "Mes médecins" },
];

function InfosTab() {
  const { user, refreshUser } = useAuth();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setPrenom(user.prenom);
      setNom(user.nom);
      setTelephone(user.telephone);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await updateMyProfile({ prenom, nom, telephone });
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
      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
        <Input label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
      </div>
      <Input label="Email" value={user?.email || ""} disabled className="opacity-60 cursor-not-allowed" />
      <Input label="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />

      {message && <p className="text-xs text-faible">{message}</p>}
      {error && <p className="text-xs text-urgent">{error}</p>}

      <Button type="submit" disabled={saving} className="self-start mt-1">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      await changePatientPassword(currentPassword, newPassword);
      setMessage("Mot de passe modifié.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-w-1/3 gap-3">
      <PasswordInput
        label="Mot de passe actuel"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <PasswordInput
        label="Nouveau mot de passe"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      {message && <p className="text-xs text-faible">{message}</p>}
      {error && <p className="text-xs text-urgent">{error}</p>}

      <Button type="submit" disabled={saving} className="self-start mt-1">
        {saving ? "Modification..." : "Modifier le mot de passe"}
      </Button>
    </form>
  );
}

function MedecinsTab() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyDossiers()
      .then((data) => setDossiers(data.dossiers))
      .finally(() => setLoading(false));
  }, []);

  const medecins = Array.from(
    new Map(
      dossiers
        .filter((d) => d.medecinEvaluateur)
        .map((d) => [d.medecinEvaluateur!.nomComplet, d.medecinEvaluateur!])
    ).values()
  );

  if (loading) return <p className="text-xs text-ardoise">Chargement...</p>;

  if (medecins.length === 0) {
    return <p className="text-xs text-ardoise">Aucun médecin n'a encore évalué votre dossier.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {medecins.map((m) => (
        <div key={m.nomComplet} className="flex items-center gap-3 rounded-xl bg-papier px-3.5 py-3">
          <div className="w-9 h-9 rounded-full bg-sauge-clair flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B3A2D" strokeWidth="1.6">
              <path d="M6 3v6a6 6 0 0012 0V3" strokeLinecap="round" />
              <circle cx="19" cy="17" r="2.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-encre">Dr. {m.nomComplet}</p>
            <p className="text-xs text-ardoise">{m.specialite}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfilPage() {
  const router = useRouter();
  const { loading } = useAuth();
  const [tab, setTab] = useState<Tab>("infos");

  if (loading) return <p className="p-8 text-sm text-ardoise">Chargement...</p>;

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="Mon profil" subtitle="Portail Patient" onBack={() => router.push("/patient/dashboard")} />

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
          {tab === "medecins" && <MedecinsTab />}
        </div>
      </div>
    </div>
  );
}