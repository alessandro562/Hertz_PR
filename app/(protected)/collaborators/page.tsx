import type { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Collaboratori" };

export default function CollaboratorsPage() {
  return (
    <ComingSoon
      title="Collaboratori"
      phase="Fase 4"
      icon={UserPlus}
      description="Collaboratori e sotto PR con livello, stato, squadra, capo PR e performance storica. Un lead convertito diventa un collaboratore qui."
    />
  );
}
