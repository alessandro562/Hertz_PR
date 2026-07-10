import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABELS, eventStatusTone } from "@/lib/constants/events";
import type { EventStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof eventStatusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  positive: "border-success/30 bg-success/15 text-success",
  negative: "border-destructive/30 bg-destructive/15 text-destructive",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[eventStatusTone(status)])}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}
