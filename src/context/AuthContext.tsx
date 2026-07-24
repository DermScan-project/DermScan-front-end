"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getTokens, clearTokens } from "@/lib/api/client";
import { getMyPatientProfile } from "@/lib/api/patientAuth";
import { Patient, UserRole } from "@/lib/types";

interface AuthState {
  user: Patient | null;
  role: UserRole | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Patient | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const tokens = getTokens();
    if (!tokens) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

    setRole(tokens.role as UserRole);

    try {
      if (tokens.role === "patient") {
        const data = await getMyPatientProfile();
        setUser(data.patient);
      }
      // médecin/admin profile fetching wired in when we build those portals
    } catch {
      clearTokens();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearTokens();
    setUser(null);
    setRole(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}