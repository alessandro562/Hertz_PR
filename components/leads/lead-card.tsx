import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { shortDate, isOverdue } from "@/lib/dates";
import type { Lead } from "@/lib/leads/queries";

export function LeadCard({ lead }: { lead: Lead }) {
  const name =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    `@${lead.instagram_username}`;
  const overdue = isOverdue(lead.next_follow_up_at);

  return (
    <Link href={`/leads/${lead.id}`} className="block">
      <Card className="gap-0 p-3 transition-colors hover:bg-accent/50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">
              @{lead.instagram_username}
            </div>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {lead.priority === "high" ? (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Star className="size-3 fill-current" /> Alta
            </span>
          ) : null}
          {lead.city ? <span>{lead.city}</span> : null}
          {lead.next_follow_up_at ? (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                overdue && "text-red-600 dark:text-red-400",
              )}
            >
              <Clock className="size-3" /> {shortDate(lead.next_follow_up_at)}
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
