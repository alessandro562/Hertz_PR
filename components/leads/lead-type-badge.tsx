import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAD_TYPE_LABELS, leadTypeTone } from "@/lib/constants/leads";
import type { LeadType } from "@/types/database";

const TONE_CLASS: Record<ReturnType<typeof leadTypeTone>, string> = {
  primary: "border-primary/30 bg-primary/15 text-primary",
  steel: "border-steel/30 bg-steel/15 text-steel",
  neutral: "border-transparent bg-muted text-muted-foreground",
};

/** Small badge for a lead's Tipo (PR / Festaiolo / Supporter social). */
export function LeadTypeBadge({
  type,
  className,
}: {
  type: LeadType;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(TONE_CLASS[leadTypeTone(type)], className)}>
      {LEAD_TYPE_LABELS[type]}
    </Badge>
  );
}
