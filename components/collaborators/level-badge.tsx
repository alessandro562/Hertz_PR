import { LEVEL_LABELS } from "@/lib/constants/collaborators";
import { cn } from "@/lib/utils";
import type { CollaboratorLevel } from "@/types/database";

/**
 * The 4 levels are an ordinal ladder, so they get a single-hue (sage) intensity
 * ramp — muted at "occasionale", filled at "pr_con_potenziale" — instead of four
 * identical grey pills. One hue keeps the brand's "sage is the only accent" rule.
 */
const LEVEL_CLASS: Record<CollaboratorLevel, string> = {
  occasionale: "border-transparent bg-muted text-muted-foreground",
  condivisioni_attive: "border-primary/30 bg-primary/5 text-foreground",
  pr_attivo: "border-primary/40 bg-primary/15 text-primary",
  pr_con_potenziale: "border-transparent bg-primary text-primary-foreground",
};

export function LevelBadge({ level }: { level: CollaboratorLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        LEVEL_CLASS[level],
      )}
    >
      {LEVEL_LABELS[level]}
    </span>
  );
}
