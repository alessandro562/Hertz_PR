import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { longDate } from "@/lib/dates";
import type { Event } from "@/lib/events/queries";

interface CapoPrDashboardProps {
  name: string;
  nextEvent: Event | null;
  tasks: {
    toContact: number;
    replied: number;
    followUpToday: number;
    overdueFollowUps: number;
  };
  team: {
    collaboratorsCount: number;
    active: number;
    dormant: number;
    latestEventScore: number;
  };
  topCapos: { id: string; name: string; score: number }[];
}

export function CapoPrDashboard({
  name,
  nextEvent,
  tasks,
  team,
  topCapos,
}: CapoPrDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao {name}</h1>
          <p className="text-sm text-muted-foreground">
            La tua squadra e i tuoi task di oggi
          </p>
        </div>
        <Badge variant="secondary">Capo PR</Badge>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">I miei task</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Lead da contattare" value={tasks.toContact} />
          <StatCard label="Hanno risposto" value={tasks.replied} />
          <StatCard label="Follow-up oggi" value={tasks.followUpToday} />
          <StatCard label="Follow-up scaduti" value={tasks.overdueFollowUps} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">La mia squadra</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Collaboratori" value={team.collaboratorsCount} />
          <StatCard label="Attivi" value={team.active} />
          <StatCard label="Dormienti" value={team.dormant} />
          <StatCard label="Score ultimo evento" value={team.latestEventScore} unit="pt" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" /> Prossimo evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextEvent ? (
              <Link href={`/events/${nextEvent.id}`} className="block hover:underline">
                <p className="font-medium">{nextEvent.name}</p>
                <p className="text-sm text-muted-foreground">
                  {longDate(nextEvent.event_date)}
                  {nextEvent.venue ? ` · ${nextEvent.venue}` : ""}
                </p>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nessun evento in programma.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confronto capi PR</CardTitle>
          </CardHeader>
          <CardContent>
            {topCapos.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessun numero registrato ancora.
              </p>
            ) : (
              <div className="space-y-2">
                {topCapos.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">#{i + 1}</span> {c.name}
                    </span>
                    <span className="font-medium tabular-nums">{c.score} pt</span>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/rankings"
              className="mt-3 inline-block text-xs text-primary underline"
            >
              Vedi tutte le classifiche
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
