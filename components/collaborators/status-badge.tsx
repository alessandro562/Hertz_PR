import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { COLLAB_STATUS_LABELS, collabStatusTone } from "@/lib/constants/collaborators";
import type { CollaboratorStatus } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof collabStatusTone>, string> = {
  neutral: "border-transparent bg-muted text-muted-foreground",
  active: "border-blue-500/25 bg-blue-500/15 text-blue-600 dark:text-blue-400",
  positive:
    "border-emerald-500/25 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  negative: "border-red-500/25 bg-red-500/15 text-red-600 dark:text-red-400",
};

export function CollabStatusBadge({ status }: { status: CollaboratorStatus }) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[collabStatusTone(status)])}>
      {COLLAB_STATUS_LABELS[status]}
    </Badge>
  );
}
