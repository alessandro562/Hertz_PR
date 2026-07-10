import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { COLLAB_STATUS_LABELS, collabStatusTone } from "@/lib/constants/collaborators";
import type { CollaboratorStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof collabStatusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-steel/30 bg-steel/15 text-steel",
  positive: "border-success/30 bg-success/15 text-success",
  negative: "border-destructive/30 bg-destructive/15 text-destructive",
};

export function CollabStatusBadge({ status }: { status: CollaboratorStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[collabStatusTone(status)])}>
      {COLLAB_STATUS_LABELS[status]}
    </Badge>
  );
}
