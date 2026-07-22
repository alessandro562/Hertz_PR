import Link from "next/link";
import { Clock, Star, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { LeadTypeBadge } from "./lead-type-badge";
import { PersonAvatar } from "@/components/common/person-avatar";
import { LEAD_TAG_LABELS } from "@/lib/constants/leads";
import { shortDate, isOverdue } from "@/lib/dates";
import { displayName } from "@/lib/format";
import type { Lead } from "@/lib/leads/queries";

export function LeadCard({
  lead,
  ownerName,
  selectMode = false,
  selected = false,
  onToggle,
}: {
  lead: Lead;
  /** Name of the PR who owns/loaded this lead (attribution). */
  ownerName?: string | null;
  /** When true the card toggles selection instead of navigating to the lead. */
  selectMode?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
}) {
  const name = displayName(lead);
  const overdue = isOverdue(lead.next_follow_up_at);

  const body = (
    <div className="flex items-start gap-3">
      {selectMode ? <Checkbox checked={selected} className="mt-0.5" /> : null}
      <PersonAvatar name={name} avatarUrl={lead.avatar_url} />
      <div className="min-w-0 flex-1">
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
            <span className="inline-flex items-center gap-1 text-warning">
              <Star className="size-3 fill-current" /> Alta
            </span>
          ) : null}
          {lead.city ? <span>{lead.city}</span> : null}
          {lead.next_follow_up_at ? (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                overdue && "font-medium text-destructive",
              )}
            >
              <Clock className="size-3" /> {shortDate(lead.next_follow_up_at)}
            </span>
          ) : null}
          {lead.last_contact_at ? (
            <span>Contatto {shortDate(lead.last_contact_at)}</span>
          ) : null}
          {ownerName ? (
            <span className="inline-flex items-center gap-1">
              <User className="size-3" /> {ownerName}
            </span>
          ) : null}
        </div>

        {lead.lead_type !== "pr" || lead.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {lead.lead_type !== "pr" ? <LeadTypeBadge type={lead.lead_type} /> : null}
            {lead.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {LEAD_TAG_LABELS[t] ?? t}
              </span>
            ))}
            {lead.tags.length > 3 ? (
              <span className="text-[11px] text-muted-foreground">
                +{lead.tags.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (selectMode) {
    return (
      <Card
        role="checkbox"
        aria-checked={selected}
        aria-label={`Seleziona ${name}`}
        tabIndex={0}
        onClick={() => onToggle?.(lead.id)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggle?.(lead.id);
          }
        }}
        className={cn(
          "cursor-pointer gap-0 p-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          selected ? "border-primary bg-primary/5" : "hover:bg-accent/50",
        )}
      >
        {body}
      </Card>
    );
  }

  return (
    <Link href={`/leads/${lead.id}`} className="block">
      <Card className="gap-0 p-3 transition-colors hover:bg-accent/50">{body}</Card>
    </Link>
  );
}
