import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { COLLAB_STATUS_LABELS, collabStatusTone } from "@/lib/constants/collaborators";
import type { CollaboratorStatus } from "@/types/database";

type Tone = ReturnType<typeof collabStatusTone>;

const TONE_CLASS: Record<Tone, string> = {
  new: "border-primary/30 bg-primary/15 text-primary",
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  warning: "border-warning/30 bg-warning/15 text-warning",
  positive: "border-transparent bg-success text-ink",
  negative: "border-transparent bg-destructive text-ink",
};

const DOT_CLASS: Partial<Record<Tone, string>> = {
  new: "bg-primary",
  neutral: "bg-muted-foreground",
  active: "bg-steel",
  warning: "bg-warning",
};

export function CollabStatusBadge({ status }: { status: CollaboratorStatus }) {
  const tone = collabStatusTone(status);
  const dot = DOT_CLASS[tone];
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[tone])}>
      {dot ? <span className={cn("size-1.5 shrink-0 rounded-full", dot)} /> : null}
      {COLLAB_STATUS_LABELS[status]}
    </Badge>
  );
}
