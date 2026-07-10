import Link from "next/link";
import {
  Calendar,
  Users,
  UserCheck,
  AlarmClockOff,
  UsersRound,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { longDate } from "@/lib/dates";
import type { Event } from "@/lib/events/queries";

interface ManagerDashboardProps {
  name: string;
  nextEvent: Event | null;
  stats: {
    totalLeads: number;
    toContact: number;
    overdueFollowUps: number;
    activeCollaborators: number;
    teamsCount: number;
    avgScore: number;
  };
  topCapos: { id: string; name: string; score: number }[];
  alerts: string[];
}

export function ManagerDashboard({
  name,
  nextEvent,
  stats,
  topCapos,
  alerts,
}: ManagerDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ciao {name}</h1>
          <p className="text-sm text-muted-foreground">
            Control room · panoramica della rete PR
          </p>
        </div>
        <Badge variant="secondary">Manager</Badge>
      </div>

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
            <p className="text-sm text-muted-foreground">Nessun evento in programma.</p>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Stato CRM</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard label="Lead totali" value={stats.totalLeads} icon={Users} />
          <StatCard label="Da contattare" value={stats.toContact} icon={Users} />
          <StatCard
            label="Follow-up scaduti"
            value={stats.overdueFollowUps}
            icon={AlarmClockOff}
          />
          <StatCard
            label="Collaboratori attivi"
            value={stats.activeCollaborators}
            icon={UserCheck}
          />
          <StatCard label="Squadre PR" value={stats.teamsCount} icon={UsersRound} />
          <StatCard label="Score medio" value={stats.avgScore} icon={Trophy} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance capi PR</CardTitle>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alert operativi</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tutto in ordine, nessun alert al momento.
              </p>
            ) : (
              <ul className="space-y-2">
                {alerts.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <TriangleAlert className="size-4 shrink-0 text-amber-500" /> {a}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
