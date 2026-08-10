import { MedecinBadgesProvider } from "@/context/MedecinBadgesContext";

export default function MedecinLayout({ children }: { children: React.ReactNode }) {
  return (
    <MedecinBadgesProvider>
      {children}
    </MedecinBadgesProvider>
  );
}