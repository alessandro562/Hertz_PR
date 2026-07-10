import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABELS, eventStatusTone } from "@/lib/constants/events";
import type { EventStatus } from "@/types/database";

type Tone = ReturnType<typeof eventStatusTone>;

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  positive: "border-transparent bg-success text-ink",
  negative: "border-transparent bg-destructive text-ink",
};

const DOT_CLASS: Partial<Record<Tone, string>> = {
  neutral: "bg-muted-foreground",
  active: "bg-steel",
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const tone = eventStatusTone(status);
  const dot = DOT_CLASS[tone];
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone])}>
      {dot ? <span className={cn("size-1.5 shrink-0 rounded-full", dot)} /> : null}
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  );
}
