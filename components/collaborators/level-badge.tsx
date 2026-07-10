import { Badge } from "@/components/ui/badge";
import { LEVEL_LABELS } from "@/lib/constants/collaborators";
import type { CollaboratorLevel } from "@/types/database";

export function LevelBadge({ level }: { level: CollaboratorLevel }) {
  return <Badge variant="secondary">{LEVEL_LABELS[level]}</Badge>;
}
