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
import TimeSelect12 from "@/components/ui/TimeSelect12";

// ─── Assure-toi que RendezVousMedecin dans @/lib/api/medecinCalendar a ces champs :
// statutPresence: "EN_ATTENTE" | "EFFECTUE" | "ABSENCE_PATIENT" | "ABSENCE_MEDECIN"
// raisonAbsence?: string | null
// presenceMarqueeAt?: string | null

const JOURS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function formatCreneau(c: { startDateTime: string; endDateTime: string }) {
  const start = new Date(c.startDateTime);
  const end = new Date(c.endDateTime);
  return {
    jour: start.toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "short",
      timeZone: "UTC",
    }),
    heure: `${start.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
      timeZone: "UTC",
    })} - ${end.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true,
      timeZone: "UTC",
    })}`,
  };
}
function formatHeure12(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function isPast(endStr: string) {
  return new Date(endStr) < new Date();
}

// ─────────────────────────────────────────────────────────────────────────────
// DISPONIBILITÉS TAB (inchangé)
// ─────────────────────────────────────────────────────────────────────────────

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

  useEffect(() => { load(); }, []);

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
              <TimeSelect12 label="Heure de début" value={heureDebut} onChange={setHeureDebut} required />
              <TimeSelect12 label="Heure de fin" value={heureFin} onChange={setHeureFin} required />
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
            const { jour } = formatCreneau(c);
            const heure = `${formatHeure12(c.startDateTime)} - ${formatHeure12(c.endDateTime)}`;
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

// ─────────────────────────────────────────────────────────────────────────────
// RENDEZ-VOUS TAB — avec marquage de présence
// ─────────────────────────────────────────────────────────────────────────────

function PresenceBadge({ statut }: { statut: string }) {
  if (statut === "EN_ATTENTE") return null;
  const map: Record<string, { label: string; bg: string; text: string; icon: string }> = {
    EFFECTUE:        { label: "Effectué",       bg: "bg-[#E6F4ED]", text: "text-[#1B3A2D]", icon: "✓" },
    ABSENCE_PATIENT: { label: "Patient absent", bg: "bg-[#FEF3C7]", text: "text-[#92400E]", icon: "!" },
    ABSENCE_MEDECIN: { label: "Médecin absent", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", icon: "!" },
  };
  const s = map[statut];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
      {s.icon} {s.label}
    </span>
  );
}

function PresenceModal({
  rdv,
  onClose,
  onSuccess,
}: {
  rdv: RendezVousMedecin;
  onClose: () => void;
  onSuccess: (updated: Partial<RendezVousMedecin> & { id: string }) => void;
}) {
  const [statut, setStatut] = useState<"EFFECTUE" | "ABSENCE_PATIENT" | "ABSENCE_MEDECIN" | null>(null);
  const [raison, setRaison] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsRaison = statut && statut !== "EFFECTUE";

  async function submit() {
    if (!statut) return;
    if (needsRaison && !raison.trim()) {
      setError("Veuillez indiquer une raison.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
     const tokens = JSON.parse(localStorage.getItem("DermaLink_tokens") || "{}");
      const res = await fetch(`http://localhost:4000/api/medecin/rendezvous/${rdv.id}/presence`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({ statut, raison: needsRaison ? raison : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur.");
      onSuccess(data.rendezVous);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const options = [
    { val: "EFFECTUE"        as const, icon: "✓", label: "Consultation effectuée", color: "border-sauge bg-sauge-clair text-encre" },
    { val: "ABSENCE_PATIENT" as const, icon: "✗", label: "Patient absent",          color: "border-amber-300 bg-amber-50 text-amber-900" },
    { val: "ABSENCE_MEDECIN" as const, icon: "✗", label: "J'étais absent(e)",       color: "border-red-300 bg-red-50 text-red-900" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm px-4 pb-6">
      <div className="bg-papier w-full max-w-sm rounded-3xl p-6 flex flex-col gap-5 shadow-xl">
        <div>
          <p className="font-display text-lg text-encre">Marquer la présence</p>
          <p className="text-xs text-ardoise mt-0.5">
            {rdv.patient.prenom} {rdv.patient.nom} — {formatCreneau(rdv.creneau).jour}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {options.map(({ val, icon, label, color }) => (
            <button
              key={val}
              onClick={() => { setStatut(val); setRaison(""); setError(null); }}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                statut === val ? color : "border-ardoise/10 bg-white text-ardoise"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                statut === val ? "bg-white/60" : "bg-ardoise/10"
              }`}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {needsRaison && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ardoise">Raison de l'absence</label>
            <textarea
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              placeholder="Ex : annulation de dernière minute, urgence..."
              rows={3}
              className="w-full rounded-xl border border-ardoise/20 bg-white px-3 py-2 text-sm text-encre placeholder:text-ardoise/40 resize-none focus:outline-none focus:border-sauge"
            />
          </div>
        )}

        {error && <p className="text-xs text-red-600 -mt-2">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-ardoise/20 py-2.5 text-sm text-ardoise"
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={!statut || loading}
            className="flex-1 rounded-full bg-sauge py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? "Enregistrement..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RendezVousTab() {
  const [rdv, setRdv] = useState<RendezVousMedecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalRdv, setModalRdv] = useState<RendezVousMedecin | null>(null);
  const [subTab, setSubTab] = useState<"venir" | "passe">("venir");
  const [search, setSearch] = useState("");

  useEffect(() => {
    listMyRendezVousMedecin()
      .then((data) => setRdv(data.rendezVous))
      .finally(() => setLoading(false));
  }, []);

  function calculateAge(dateNaissance: string) {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  function handlePresenceSuccess(updated: Partial<RendezVousMedecin> & { id: string }) {
    setRdv((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
    setModalRdv(null);
  }

  const upcoming = rdv.filter((r) => !isPast(r.creneau.endDateTime));
  const past     = rdv.filter((r) =>  isPast(r.creneau.endDateTime));
  const pendingCount = past.filter((r) => (r.statutPresence ?? "EN_ATTENTE") === "EN_ATTENTE").length;

  function matchSearch(r: RendezVousMedecin) {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const nomComplet = `${r.patient.prenom} ${r.patient.nom}`.toLowerCase();
    return nomComplet.includes(q);
  }

  const upcomingFiltres = upcoming.filter(matchSearch);
  const pastFiltres     = past.filter(matchSearch);

  function RdvCard({ r }: { r: RendezVousMedecin }) {
    const { jour, heure } = formatCreneau(r.creneau);
    const passed  = isPast(r.creneau.endDateTime);
    const statut  = r.statutPresence ?? "EN_ATTENTE";
    const canMark = passed && statut === "EN_ATTENTE";

    return (
      <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${passed ? "bg-ardoise/5 border-ardoise/10" : "bg-white border-ardoise/10"}`}>
        {/* En-tête patient */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${passed ? "bg-ardoise/10" : "bg-sauge-clair"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={passed ? "#6B7268" : "#1B3A2D"} strokeWidth="1.7">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-encre">
              {r.patient.prenom} {r.patient.nom}, {calculateAge(r.patient.dateNaissance)} ans
            </p>
            <p className="text-xs text-ardoise truncate">{r.patient.email} · {r.patient.telephone}</p>
          </div>
          <PresenceBadge statut={statut} />
        </div>

        {/* Date & heure */}
        <div>
          <p className="text-sm text-encre capitalize">{jour}</p>
          <p className="text-sm text-ardoise">{heure}</p>
        </div>

        {/* Raison d'absence */}
        {r.raisonAbsence && (
          <p className="text-xs text-ardoise/70 bg-ardoise/5 rounded-xl px-3 py-2">
            💬 {r.raisonAbsence}
          </p>
        )}

        {/* Bouton marquer présence (uniquement RDV passés non encore marqués) */}
        {canMark && (
          <button
            onClick={() => setModalRdv(r)}
            className="w-full rounded-full border border-sauge text-sauge text-sm font-medium py-2 hover:bg-sauge hover:text-white transition-colors"
          >
            Marquer la présence
          </button>
        )}
      </div>
    );
  }

  if (loading) return <p className="text-sm text-ardoise text-center py-6">Chargement...</p>;

  if (rdv.length === 0) {
    return <p className="text-sm text-ardoise text-center py-10">Aucun rendez-vous réservé pour le moment.</p>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">

        {/* Bannière si des RDV passés attendent une confirmation */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <span className="text-amber-500 text-lg">⏳</span>
            <p className="text-sm text-amber-900">
              <span className="font-medium">{pendingCount} rendez-vous</span>{" "}
              {pendingCount === 1 ? "attend" : "attendent"} votre confirmation de présence.
            </p>
          </div>
        )}

       

        {/* Filtre À venir / Passés */}
        <div className="flex gap-1 bg-white rounded-full border border-ardoise/10 p-1 self-start">
          <button
            onClick={() => setSubTab("venir")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${subTab === "venir" ? "bg-sauge text-white" : "text-ardoise"}`}
          >
            À venir {upcomingFiltres.length > 0 && `(${upcomingFiltres.length})`}
          </button>
          <button
            onClick={() => setSubTab("passe")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${subTab === "passe" ? "bg-sauge text-white" : "text-ardoise"}`}
          >
            Passés {pastFiltres.length > 0 && `(${pastFiltres.length})`}
          </button>
        </div>
         {/* Recherche par nom de patient */}
         
      
    <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ardoise/40"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 rounded-xl border border-ardoise/15 bg-white text-sm text-encre placeholder:text-ardoise/40 outline-none focus:border-sauge/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
          {subTab === "venir" && (
            upcomingFiltres.length > 0
              ? upcomingFiltres.map((r) => <RdvCard key={r.id} r={r} />)
              : <p className="text-sm text-ardoise text-center py-10">
                  {upcoming.length === 0 ? "Aucun rendez-vous à venir." : "Aucun patient ne correspond à cette recherche."}
                </p>
          )}

          {subTab === "passe" && (
            pastFiltres.length > 0
              ? pastFiltres.map((r) => <RdvCard key={r.id} r={r} />)
              : <p className="text-sm text-ardoise text-center py-10">
                  {past.length === 0 ? "Aucun rendez-vous passé." : "Aucun patient ne correspond à cette recherche."}
                </p>
          )}
        </div>
      </div>

      {modalRdv && (
        <PresenceModal
          rdv={modalRdv}
          onClose={() => setModalRdv(null)}
          onSuccess={handlePresenceSuccess}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE PRINCIPALE (inchangée)
// ─────────────────────────────────────────────────────────────────────────────

export default function CreneauxPage() {
  const [tab, setTab] = useState<"dispos" | "rdv">("dispos");

  return (
    <div className="min-h-screen bg-papier">
      <PortalHeader title="DermaLink Pro" subtitle="Créneaux" onBack={() => (window.location.href = "/medecin/dashboard")} right={<HeaderActions />} />
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