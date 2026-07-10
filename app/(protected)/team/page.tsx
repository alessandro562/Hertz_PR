import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "La mia squadra" };

export default function TeamPage() {
  return (
    <ComingSoon
      title="La mia squadra"
      phase="Fase 4"
      icon={UsersRound}
      description="Qui gestirai i tuoi collaboratori e sotto PR: livelli, stati, attivi e dormienti, con lo storico delle performance."
    />
  );
}
