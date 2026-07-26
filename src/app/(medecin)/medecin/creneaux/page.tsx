"use client";

import { useEffect, useState } from "react";
import PortalHeader from "@/components/ui/PortalHeader";
import HeaderActions from "@/components/ui/HeaderActions";
import MedecinNav from "@/components/medecin/MedecinNav";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  createRegle, listMyCreneaux, deleteCreneau,
  listMyRendezVousMedecin, Creneau, RendezVousMedecin,
} from "@/lib/api/medecinCalendar";

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function formatCreneau(c: { startDateTime: string; endDateTime: string }) {
  const start = new Date(c.startDateTime);
  const end = new Date(c.endDateTime);
  return {
    jour: start.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }),
    heure: `${start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`,
  };
}

function DisponibilitesTab() {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [jourSemaine, setJourSemaine] = useState("1");
  const [heureDebut, setHeureDebut] = useState("09:00");
  const [heureFin, setHeureFin] = useState("12:00");
  const [duree, setDuree] = useState("30");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  function load() {
    setLoading(true);
    listMyCreneaux()
      .then((data) => setCreneaux(data.creneaux))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateRegle(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await createRegle({
        jourSemaine: Number(jourSemaine),
        heureDebut, heureFin,
        dureeSlotMinutes: Number(duree),
        dateDebut, dateFin,
      });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.error || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteCreneau(id).catch(() => {});
    load();
  }

  const disponibles = creneaux.filter((c) => c.statut === "DISPONIBLE");

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-ardoise/10 p-5 sticky top-[113px] z-[5] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-encre">Ajouter une disponibilité récurrente</p>
          <button onClick={() => setShowForm((v) => !v)} className="text-xs text-sauge font-medium hover:underline">
            {showForm ? "Annuler" : "+ Ajouter"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateRegle} className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-1">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">Jour de la semaine</label>
              <select
                value={jourSemaine}
                onChange={(e) => setJourSemaine(e.target.value)}
                className="rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre outline-none focus:border-sauge"
              >
                {JOURS.map((j, i) => <option key={i} value={i}>{j}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Heure de début" type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} required />
              <Input label="Heure de fin" type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium tracking-wide uppercase text-ardoise">Durée par créneau</label>
              <select
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className="rounded-xl border border-ardoise/25 bg-white px-3.5 py-2.5 text-sm text-encre outline-none focus:border-sauge"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Du" type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
              <Input label="Au" type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-urgent">{error}</p>}

            <Button type="submit" disabled={saving}>{saving ? "Création..." : "Générer les créneaux"}</Button>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium sticky top-[280px] bg-papier py-1 z-[4]">
          Créneaux disponibles ({disponibles.length})
        </p>

        <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
          {loading && <p className="text-sm text-ardoise text-center py-6">Chargement...</p>}

          {!loading && disponibles.length === 0 && (
            <p className="text-sm text-ardoise text-center py-6">Aucun créneau disponible. Ajoutez une disponibilité ci-dessus.</p>
          )}

          {!loading && disponibles.map((c) => {
            const { jour, heure } = formatCreneau(c);
            return (
              <div key={c.id} className="flex items-center justify-between rounded-xl bg-white border border-ardoise/10 px-4 py-3">
                <span className="text-sm text-encre capitalize">{jour} · {heure}</span>
                <button onClick={() => handleDelete(c.id)} className="text-ardoise/50 hover:text-urgent" aria-label="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RendezVousTab() {
  const [rdv, setRdv] = useState<RendezVousMedecin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyRendezVousMedecin()
      .then((data) => setRdv(data.rendezVous))
      .finally(() => setLoading(false));
  }, []);

  function isPast(endStr: string) {
    return new Date(endStr) < new Date();
  }

  function calculateAge(dateNaissance: string) {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  const upcoming = rdv.filter((r) => !isPast(r.creneau.endDateTime));
  const past = rdv.filter((r) => isPast(r.creneau.endDateTime));

  function RdvCard({ r }: { r: RendezVousMedecin }) {
    const { jour, heure } = formatCreneau(r.creneau);
    const passed = isPast(r.creneau.endDateTime);
    return (
      <div className={`rounded-2xl border p-5 ${passed ? "bg-ardoise/5 border-ardoise/10" : "bg-white border-ardoise/10"}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${passed ? "bg-ardoise/10" : "bg-sauge-clair"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={passed ? "#6B7268" : "#1B3A2D"} strokeWidth="1.7">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-encre">{r.patient.prenom} {r.patient.nom}, {calculateAge(r.patient.dateNaissance)} ans</p>
            <p className="text-xs text-ardoise">{r.patient.email} · {r.patient.telephone}</p>
          </div>
        </div>
        <p className="text-sm text-encre capitalize">{jour}</p>
        <p className="text-sm text-ardoise">{heure}</p>
      </div>
    );
  }

  if (loading) return <p className="text-sm text-ardoise text-center py-6">Chargement...</p>;

  if (rdv.length === 0) {
    return <p className="text-sm text-ardoise text-center py-10">Aucun rendez-vous réservé pour le moment.</p>;
  }

  return (
    <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-1">
      {upcoming.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium sticky top-0 bg-papier py-1">À venir</p>
          {upcoming.map((r) => <RdvCard key={r.id} r={r} />)}
        </section>
      )}
      {past.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-[11px] tracking-wide uppercase text-ardoise/70 font-medium sticky top-0 bg-papier py-1">Passés</p>
          {past.map((r) => <RdvCard key={r.id} r={r} />)}
        </section>
      )}
    </div>
  );
}

export default function CreneauxPage() {
  const [tab, setTab] = useState<"dispos" | "rdv">("dispos");

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="DermScan Pro" subtitle="Créneaux" onBack={() => (window.location.href = "/medecin/dashboard")} right={<HeaderActions />} />
      <MedecinNav />

      <div className="p-5 max-w-full mx-auto flex flex-col gap-4">
        <div className="flex gap-1 bg-white rounded-full border border-ardoise/10 p-1 self-start">
          <button
            onClick={() => setTab("dispos")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === "dispos" ? "bg-sauge text-white" : "text-ardoise"}`}
          >
            Mes disponibilités
          </button>
          <button
            onClick={() => setTab("rdv")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === "rdv" ? "bg-sauge text-white" : "text-ardoise"}`}
          >
            Rendez-vous
          </button>
        </div>

        {tab === "dispos" ? <DisponibilitesTab /> : <RendezVousTab />}
      </div>
    </div>
  );
}