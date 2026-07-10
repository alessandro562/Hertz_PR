import { INTERACTION_META } from "@/lib/constants/interactions";
import { LEAD_STATUS_LABELS } from "@/lib/constants/leads";
import { dateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { LeadInteraction } from "@/lib/leads/queries";
import type { LeadStatus } from "@/types/database";

export function LeadTimeline({ interactions }: { interactions: LeadInteraction[] }) {
  if (interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">Nessuna attività ancora.</p>;
  }

  return (
    <ol className="space-y-3">
      {interactions.map((it) => {
        const meta = INTERACTION_META[it.type];
        const Icon = meta.icon;
        const detail =
          it.type === "status_change"
            ? (LEAD_STATUS_LABELS[it.body as LeadStatus] ?? it.body)
            : it.body;
        return (
          <li key={it.id} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                  {dateTime(it.created_at)}
                </span>
              </div>
              {detail ? (
                <p
                  className={cn(
                    "text-sm break-words",
                    it.type === "note" ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {detail}
                </p>
              ) : null}
              {it.author_name ? (
                <p className="text-xs text-muted-foreground">{it.author_name}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
