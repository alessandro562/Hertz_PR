import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";
import { ComingSoon } from "@/components/common/coming-soon";

export const metadata: Metadata = { title: "Template" };

export default function TemplatesPage() {
  return (
    <ComingSoon
      title="Template messaggi"
      icon={MessageSquareText}
      description="Messaggi pronti da copiare per primo contatto, follow-up, spiegazioni e reminder evento. Template globali (Manager) e personali (Capo PR)."
    />
  );
}
