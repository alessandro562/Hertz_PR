import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, statusTone } from "@/lib/constants/leads";
import type { LeadStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof statusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  positive: "border-success/30 bg-success/15 text-success",
  negative: "border-destructive/30 bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[statusTone(status)])}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
