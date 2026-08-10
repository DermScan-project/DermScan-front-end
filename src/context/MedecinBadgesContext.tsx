"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { listConversations, getSocket } from "@/lib/api/messages";
import { getMedecinPool } from "@/lib/api/medecinDossiers";

interface MedecinBadgesContextValue {
  messagesBadge: number;
  dossiersBadge: number;
  refresh: () => void;
}

const MedecinBadgesContext = createContext<MedecinBadgesContextValue>({
  messagesBadge: 0,
  dossiersBadge: 0,
  refresh: () => {},
});

export function MedecinBadgesProvider({ children }: { children: React.ReactNode }) {
  const [messagesBadge, setMessagesBadge] = useState(0);
  const [dossiersBadge, setDossiersBadge] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const conv = await listConversations();
      setMessagesBadge(conv.conversations.reduce((acc, c) => acc + c.nonLus, 0));
    } catch {
      // ignore, keep previous value
    }

    try {
      const pool = await getMedecinPool();
      const enAttente = pool.dossiers.filter(
        (d) => d.statut === "EN_ATTENTE" || d.statut === "EN_COURS"
      ).length;
      setDossiersBadge(enAttente);
    } catch {
      // ignore, keep previous value
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000); // fallback poll every 15s

    // Refresh instantly whenever a new message arrives, regardless of which page is open
    const socket = getSocket();
    socket.on("new_message", refresh);

    // Also refresh instantly when the tab/window regains focus (catches missed events)
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      socket.off("new_message", refresh);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return (
    <MedecinBadgesContext.Provider value={{ messagesBadge, dossiersBadge, refresh }}>
      {children}
    </MedecinBadgesContext.Provider>
  );
}

export function useMedecinBadges() {
  return useContext(MedecinBadgesContext);
}