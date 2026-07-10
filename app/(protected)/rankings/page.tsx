import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Classifiche" };

export default function RankingsPage() {
  return (
    <ComingSoon
      title="Classifiche"
      phase="Fase 6"
      icon={Trophy}
      description="Ranking di capi PR, squadre e collaboratori per creare competizione: miglior evento, miglior mese, migliore crescita e chi riattivare."
    />
  );
}
