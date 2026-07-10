import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EventStatusBadge } from "./status-badge";
import { longDate } from "@/lib/dates";
import type { Event } from "@/lib/events/queries";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="block">
      <Card className="gap-0 p-4 transition-colors hover:bg-accent/50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium">{event.name}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" /> {longDate(event.event_date)}
            </div>
            {event.venue || event.city ? (
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" />
                {[event.venue, event.city].filter(Boolean).join(", ")}
              </div>
            ) : null}
          </div>
          <EventStatusBadge status={event.status} />
        </div>
      </Card>
    </Link>
  );
}
