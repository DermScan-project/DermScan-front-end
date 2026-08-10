"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrength, { isPasswordStrong } from "@/components/ui/PasswordStrength";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { MedecinIcon, ArrowLeftIcon } from "@/components/ui/icons";
import { registerMedecin } from "@/lib/api/medecinAuth";

const SPECIALITES = [
  "Dermatologie", "Dermatologie pédiatrique", "Dermato-oncologie", "Médecine générale",
];

export default function MedecinRegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nomComplet: "", specialite: "", rpps: "", telephone: "", email: "", password: "", adresseCabinet: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.nomComplet || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (!isPasswordStrong(form.password)) {
      setError("Le mot de passe ne respecte pas tous les critères ci-dessus.");
      return;
    }
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.specialite || !form.rpps || !form.telephone) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await registerMedecin(form);
      setDone(true);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell icon={MedecinIcon} title="Vérifiez votre email" subtitle="DermaLink Pro">
        <p className="text-ardoise text-sm text-center">
          Un lien de vérification a été envoyé à <strong>{form.email}</strong>. Après vérification, votre inscription
          sera examinée par notre équipe avant activation de votre compte.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell icon={MedecinIcon} title="Inscription praticien" subtitle={`Étape ${step} sur 2`}>
      <div className="flex items-center gap-3 mb-4">
        {step === 2 && (
          <button type="button" onClick={() => setStep(1)} className="text-ardoise hover:text-sauge -ml-1" aria-label="Retour">
            {ArrowLeftIcon}
          </button>
        )}
        <div className="flex gap-1.5 flex-1 justify-center">
          <span className={`h-1.5 rounded-full transition-all ${step === 1 ? "w-8 bg-sauge" : "w-4 bg-sauge-clair"}`} />
          <span className={`h-1.5 rounded-full transition-all ${step === 2 ? "w-8 bg-sauge" : "w-4 bg-sauge-clair"}`} />
        </div>
        {step === 2 && <div className="w-[18px]" />}
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} className="flex flex-col gap-4">
          <Input label="Nom complet" placeholder="Dr. Jean Dupont" value={form.nomComplet} onChange={(e) => update("nomComplet", e.target.value)} required />
          <Input label="Email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <PasswordInput label="Mot de passe" autoComplete="new-password" placeholder="8 caractères min." value={form.password} onChange={(e) => update("password", e.target.value)} required />
          <PasswordStrength password={form.password} />

          {error && <p className="text-sm text-urgent">{error}</p>}

          <Button type="submit" size="lg" fullWidth>Continuer</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">Spécialité</label>
            <select
              className="rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre outline-none focus:border-sauge focus:ring-2 focus:ring-sauge/15"
              value={form.specialite}
              onChange={(e) => update("specialite", e.target.value)}
              required
            >
              <option value="">Sélectionner</option>
              {SPECIALITES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Numéro RPPS" placeholder="Ex : 10001234567" value={form.rpps} onChange={(e) => update("rpps", e.target.value)} required />
          <Input label="Téléphone" placeholder="0612345678" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} required />
          <Input label="Adresse du cabinet (facultatif)" placeholder="12 rue de la Paix, Paris" value={form.adresseCabinet} onChange={(e) => update("adresseCabinet", e.target.value)} />

          <InfoChip>Vérification RPPS par notre équipe · RGPD</InfoChip>

          {error && <p className="text-sm text-urgent">{error}</p>}

          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
      )}

      <p className="text-sm text-ardoise mt-5 text-center">
        Déjà un compte ? <Link href="/medecin/login" className="text-sauge font-medium">Se connecter</Link>
      </p>
    </AuthShell>
  );
}