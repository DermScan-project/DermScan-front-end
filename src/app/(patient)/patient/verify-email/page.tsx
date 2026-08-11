"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { AuthShell } from "@/components/ui/AuthShell";
import { PatientIcon } from "@/components/ui/icons";
import { verifyPatientEmail } from "@/lib/api/patientAuth";

function VerifyEmailContent() {
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
    verifyPatientEmail(token)
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
    <AuthShell icon={PatientIcon} title="Vérification de l'email" subtitle="Portail Patient">
      {status === "loading" && <p className="text-ardoise text-center">Vérification en cours...</p>}
      {status === "success" && (
        <div className="text-center">
          <p className="text-ardoise text-sm mb-4">{message}</p>
          <Link href="/patient/login"><Button size="lg" fullWidth>Se connecter</Button></Link>
        </div>
      )}
      {status === "error" && <p className="text-urgent text-sm text-center">{message}</p>}
    </AuthShell>
  );
}
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-5">Chargement...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}