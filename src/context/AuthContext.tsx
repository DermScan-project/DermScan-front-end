"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getTokens, clearTokens } from "@/lib/api/client";
import { getMyPatientProfile } from "@/lib/api/patientAuth";
import { Patient, UserRole, Medecin } from "@/lib/types";
import { Admin } from "@/lib/api/adminAuth";
import { getMyMedecinProfile } from "@/lib/api/medecinAuth";
import { getMyAdminProfile } from "@/lib/api/adminAuth";

interface AuthState {
  user: Patient | Medecin | Admin | null;
  role: UserRole | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Patient | Medecin | Admin | null>(null);
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
    } else if (tokens.role === "medecin") {
  const data = await getMyMedecinProfile();
  setUser(data.medecin);
} else if (tokens.role === "admin") {
  const data = await getMyAdminProfile();
  setUser(data.admin);
}

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