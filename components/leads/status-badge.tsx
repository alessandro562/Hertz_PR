import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, statusTone } from "@/lib/constants/leads";
import type { LeadStatus } from "@/types/database";

type Tone = ReturnType<typeof statusTone>;

const TONE_CLASS: Record<Tone, string> = {
  new: "border-primary/30 bg-primary/15 text-primary",
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  warning: "border-warning/30 bg-warning/15 text-warning",
  positive: "border-transparent bg-success text-ink",
  negative: "border-transparent bg-destructive text-ink",
};

/** Dot only on in-progress tones — a solid fill already carries enough weight on its own. */
const DOT_CLASS: Partial<Record<Tone, string>> = {
  new: "bg-primary",
  neutral: "bg-muted-foreground",
  active: "bg-steel",
  warning: "bg-warning",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const tone = statusTone(status);
  const dot = DOT_CLASS[tone];
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone])}>
      {dot ? <span className={cn("size-1.5 shrink-0 rounded-full", dot)} /> : null}
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
