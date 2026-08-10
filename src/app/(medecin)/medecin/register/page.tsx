"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrength, { isPasswordStrong } from "@/components/ui/PasswordStrength";
import { AuthShell, InfoChip } from "@/components/ui/AuthShell";
import { MedecinIcon, ArrowLeftIcon } from "@/components/ui/icons";
import { registerMedecin } from "@/lib/api/medecinAuth";

const SPECIALITES = [
  "Anatomie et cytologie pathologiques",
  "Anesthésie-réanimation",
  "Biologie médicale",
  "Cardiologie et médecine vasculaire",
  "Chirurgie maxillo-faciale",
  "Chirurgie orale",
  "Chirurgie orthopédique et traumatologique",
  "Chirurgie pédiatrique",
  "Chirurgie plastique, reconstructrice et esthétique",
  "Chirurgie thoracique et cardiovasculaire",
  "Chirurgie vasculaire",
  "Chirurgie viscérale et digestive",
  "Dermatologie et vénéréologie",
  "Endocrinologie, diabétologie et nutrition",
  "Gastro-entérologie et hépatologie",
  "Génétique médicale",
  "Gériatrie",
  "Gynécologie médicale",
  "Gynécologie-obstétrique",
  "Hématologie",
  "Hépato-gastro-entérologie",
  "Maladies infectieuses et tropicales",
  "Médecine cardiovasculaire",
  "Médecine d'urgence",
  "Médecine générale",
  "Médecine intensive-réanimation",
  "Médecine interne et immunologie clinique",
  "Médecine légale et expertises médicales",
  "Médecine nucléaire",
  "Médecine physique et de réadaptation",
  "Médecine vasculaire",
  "Néphrologie",
  "Neurochirurgie",
  "Neurologie",
  "Oncologie",
  "Ophtalmologie",
  "Oto-rhino-laryngologie et chirurgie cervico-faciale (ORL)",
  "Pédiatrie",
  "Pneumologie",
  "Psychiatrie",
  "Psychiatrie de l'enfant et de l'adolescent",
  "Radiologie et imagerie médicale",
  "Rhumatologie",
  "Santé publique",
  "Médecine du travail",
  "Pharmacien",
  "Kinésithérapeute",
  "Sage femme",
];

function SpecialiteCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // revert typed text if nothing valid was chosen
        if (!SPECIALITES.includes(query)) {
          setQuery(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query, value]);

  const filtered = SPECIALITES.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  function selectOption(option: string) {
    onChange(option);
    setQuery(option);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        return;
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) selectOption(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery(value);
    }
  }

  return (
    <div className="flex flex-col gap-2 relative" ref={wrapperRef}>
      <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">
        Spécialité
      </label>
      <input
        type="text"
        className="rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre outline-none focus:border-sauge focus:ring-2 focus:ring-sauge/15"
        placeholder="Rechercher ou sélectionner une spécialité"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlighted(0);
          if (e.target.value === "") onChange("");
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        required
      />
      {open && filtered.length > 0 && (
        <ul className="absolute top-full mt-1 z-20 w-full max-h-60 overflow-auto rounded-xl border border-ardoise/25 bg-white shadow-lg py-1">
          {filtered.map((s, i) => (
            <li
              key={s}
              className={`px-3.5 py-2 text-sm cursor-pointer ${
                i === highlighted ? "bg-sauge-clair text-encre" : "text-encre"
              } ${s === value ? "font-medium" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(s);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <ul className="absolute top-full mt-1 z-20 w-full rounded-xl border border-ardoise/25 bg-white shadow-lg py-1">
          <li className="px-3.5 py-2 text-sm text-ardoise/60">Aucun résultat</li>
        </ul>
      )}
    </div>
  );
}

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
          <SpecialiteCombobox
            value={form.specialite}
            onChange={(v) => update("specialite", v)}
          />
          <div className="flex flex-row gap-2">
          <Input label="Numéro RPPS" placeholder="Ex : 10001234567" value={form.rpps} onChange={(e) => update("rpps", e.target.value)} required />
          <Input label="Téléphone" placeholder="0612345678" value={form.telephone} onChange={(e) => update("telephone", e.target.value)} required />
          </div>
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