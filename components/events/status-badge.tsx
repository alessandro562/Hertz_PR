import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABELS, eventStatusTone } from "@/lib/constants/events";
import type { EventStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof eventStatusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-blue-500/25 bg-blue-500/15 text-blue-600 dark:text-blue-400",
  positive:
    "border-emerald-500/25 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  negative: "border-red-500/25 bg-red-500/15 text-red-600 dark:text-red-400",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[eventStatusTone(status)])}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}
