"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import DateOfBirthInput from "@/components/ui/DateOfBirthInput";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { PatientIcon, ArrowLeftIcon } from "@/components/ui/icons";
import { registerPatient } from "@/lib/api/patientAuth";
import PasswordStrength, { isPasswordStrong } from "@/components/ui/PasswordStrength";

export default function PatientRegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    prenom: "", nom: "", email: "", password: "", sexe: "", dateNaissance: "", telephone: "",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleNext(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  if (!form.prenom || !form.nom || !form.email || !form.password) {
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
    setLoading(true);
    try {
      await registerPatient({ ...form, sexe: form.sexe as "H" | "F" | "AUTRE", consentementRGPD: consent });
      setDone(true);
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthShell icon={PatientIcon} title="Vérifiez votre email" subtitle="DermScan">
        <p className="text-ardoise text-sm text-center">
          Un lien de vérification a été envoyé à <strong>{form.email}</strong>.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell icon={PatientIcon} title="Créer un compte" subtitle={`Étape ${step} sur 2`}>
      <div className="flex items-center gap-3 mb-4">
        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-ardoise hover:text-sauge -ml-1"
            aria-label="Retour"
          >
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
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prénom" placeholder="Jean" value={form.prenom} onChange={(e) => update("prenom", e.target.value)} required />
            <Input label="Nom" placeholder="Dupont" value={form.nom} onChange={(e) => update("nom", e.target.value)} required />
          </div>
          <Input label="Email" type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          <PasswordInput label="Mot de passe" autoComplete="new-password" placeholder="8 caractères min." value={form.password} onChange={(e) => update("password", e.target.value)} required />
<PasswordStrength password={form.password} />
          {error && <p className="text-sm text-urgent">{error}</p>}

          <Button type="submit" size="lg" fullWidth>Continuer</Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
     <div className="grid grid-cols-2 gap-3">
  <div className="flex flex-col gap-2">
    <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">Sexe</label>
    <select
      className="rounded-xl border border-ardoise/25 bg-white px-4 py-3 text-[15px] text-encre outline-none focus:border-sauge focus:ring-2 focus:ring-sauge/15"
      value={form.sexe}
      onChange={(e) => update("sexe", e.target.value)}
      required
    >
      <option value="">Sélectionner</option>
      <option value="H">Homme</option>
      <option value="F">Femme</option>
      
    </select>
  </div>
  <DateOfBirthInput value={form.dateNaissance} onChange={(v) => update("dateNaissance", v)} />
</div>
          <Input label="Téléphone" placeholder="0612345678" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} required />

          <label className="flex items-start gap-2 text-xs text-ardoise">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" required />
            J'accepte que mes données de santé soient traitées dans le cadre de cette analyse, conformément au RGPD.
          </label>

          <InfoChip>Connexion chiffrée · RGPD</InfoChip>

          {error && <p className="text-sm text-urgent">{error}</p>}

          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
      )}

      <p className="text-sm text-ardoise mt-5 text-center">
        Déjà un compte ? <Link href="/patient/login" className="text-sauge font-medium">Se connecter</Link>
      </p>
    </AuthShell>
  );
}