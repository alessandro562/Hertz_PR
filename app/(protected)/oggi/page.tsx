import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { listFollowUpsDue } from "@/lib/leads/queries";
import { isOverdue, isToday } from "@/lib/dates";
import { LeadCard } from "@/components/leads/lead-card";

export const metadata: Metadata = { title: "Cosa fare oggi" };

export default async function TodayPage() {
  const due = await listFollowUpsDue();

  // Oggi = follow-up di oggi (a qualsiasi ora). Scaduti = giorni precedenti,
  // così i due gruppi non si sovrappongono.
  const today = due.filter((l) => isToday(l.next_follow_up_at));
  const overdue = due.filter(
    (l) => isOverdue(l.next_follow_up_at) && !isToday(l.next_follow_up_at),
  );

  const total = today.length + overdue.length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cosa fare oggi</h1>
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? "Nessun follow-up in scadenza"
            : `${total} follow-up da gestire`}
        </p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <CalendarCheck className="size-8" />
          <p className="text-sm">
            Tutto in pari — nessun follow-up scaduto o in scadenza oggi.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 ? (
            <section className="space-y-2">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-destructive">
                Scaduti · {overdue.length}
              </h2>
              <div className="space-y-2">
                {overdue.map((l) => (
                  <LeadCard key={l.id} lead={l} />
                ))}
              </div>
            </section>
          ) : null}

          {today.length > 0 ? (
            <section className="space-y-2">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Oggi · {today.length}
              </h2>
              <div className="space-y-2">
                {today.map((l) => (
                  <LeadCard key={l.id} lead={l} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
