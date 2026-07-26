"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AuthShell } from "@/components/ui/AuthShell";
import { MedecinIcon } from "@/components/ui/icons";
import { verifyMedecinEmail } from "@/lib/api/medecinAuth";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Lien invalide.");
      return;
    }
    verifyMedecinEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.error || "Une erreur est survenue.");
      });
  }, [token]);

  return (
    <AuthShell icon={MedecinIcon} title="Vérification de l'email" subtitle="Portail Médecin">
      {status === "loading" && <p className="text-ardoise text-center">Vérification en cours...</p>}
      {status === "success" && (
        <div className="text-center">
          <p className="text-ardoise text-sm mb-4">{message}</p>
          <Link href="/medecin/login"><Button size="lg" fullWidth>Se connecter</Button></Link>
        </div>
      )}
      {status === "error" && <p className="text-urgent text-sm text-center">{message}</p>}
    </AuthShell>
  );
}