import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, statusTone } from "@/lib/constants/leads";
import type { LeadStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof statusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active:
    "border-blue-500/25 bg-blue-500/15 text-blue-600 dark:text-blue-400",
  positive:
    "border-emerald-500/25 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  negative: "border-red-500/25 bg-red-500/15 text-red-600 dark:text-red-400",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[statusTone(status)])}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
