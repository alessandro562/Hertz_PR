import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { listEvents } from "@/lib/events/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { EventCard } from "@/components/events/event-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Eventi" };

export default async function EventsPage() {
  const [events, current] = await Promise.all([listEvents(), getSessionUser()]);
  const manager = isManager(current?.profile);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Eventi</h1>
          <p className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? "evento" : "eventi"}
          </p>
        </div>
        {manager ? (
          <Link href="/events/new" className={cn(buttonVariants(), "h-10 gap-2")}>
            <Plus className="size-4" /> Nuovo
          </Link>
        ) : null}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Calendar className="size-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Nessun evento ancora</p>
            <p className="text-xs">
              {manager
                ? "Crea il primo evento per iniziare ad assegnare le squadre."
                : "Il Manager non ha ancora pubblicato eventi."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
