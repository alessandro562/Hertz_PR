import {
  StickyNote,
  ArrowRightLeft,
  MessageCircle,
  UserPlus,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import type { Database } from "@/types/database";

export type LeadInteractionType =
  Database["public"]["Tables"]["lead_interactions"]["Row"]["type"];

/** Per-type label + icon for the lead timeline. */
export const INTERACTION_META: Record<
  LeadInteractionType,
  { label: string; icon: LucideIcon }
> = {
  note: { label: "Nota", icon: StickyNote },
  status_change: { label: "Stato", icon: ArrowRightLeft },
  contacted: { label: "Contatto", icon: MessageCircle },
  created: { label: "Creato", icon: UserPlus },
  converted: { label: "Convertito", icon: Repeat },
};
