import Link from "next/link";
import { Calendar, TriangleAlert, ChevronRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "./stat-card";
import { AnnouncementWidget } from "@/components/announcements/announcement-widget";
import { longDate } from "@/lib/dates";
import type { Event } from "@/lib/events/queries";
import type { Announcement } from "@/lib/announcements/queries";

interface ManagerDashboardProps {
  name: string;
  latestAnnouncement: Announcement | null;
  nextEvent: Event | null;
  stats: {
    totalLeads: number;
    toContact: number;
    overdueFollowUps: number;
    activeCollaborators: number;
    capiCount: number;
    avgScore: number;
  };
  topCapos: { id: string; name: string; score: number }[];
  leadsByPr: {
    id: string;
    name: string;
    total: number;
    converted: number;
    pct: number;
  }[];
  alerts: { label: string; href: string }[];
}

export function ManagerDashboard({
  name,
  latestAnnouncement,
  nextEvent,
  stats,
  topCapos,
  leadsByPr,
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

      <AnnouncementWidget announcement={latestAnnouncement} />

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
          <StatCard label="Lead totali" value={stats.totalLeads} />
          <StatCard label="Da contattare" value={stats.toContact} />
          <StatCard
            label="Follow-up scaduti"
            value={stats.overdueFollowUps}
            href="/oggi"
          />
          <StatCard label="Collaboratori attivi" value={stats.activeCollaborators} />
          <StatCard label="Capi PR" value={stats.capiCount} />
          <StatCard label="Score medio" value={stats.avgScore} unit="pt" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" /> Lead per PR
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leadsByPr.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nessun lead ancora attribuito a un PR.
            </p>
          ) : (
            <div className="space-y-3">
              {leadsByPr.map((pr, i) => {
                const max = leadsByPr[0].total || 1;
                return (
                  <div key={pr.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-muted-foreground">#{i + 1}</span>
                        <span className="truncate">{pr.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        <span className="font-medium text-foreground">{pr.total}</span> lead
                        {" · "}
                        <span
                          className={pr.pct > 0 ? "text-success" : undefined}
                        >
                          {pr.pct}%
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.round((pr.total / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link
            href="/dati"
            className="mt-3 inline-block text-xs text-primary underline"
          >
            Analisi lead completa
          </Link>
        </CardContent>
      </Card>

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
              <ul className="space-y-1">
                {alerts.map((a) => (
                  <li key={a.label}>
                    <Link
                      href={a.href}
                      className="flex items-center gap-2 rounded-md py-1.5 text-sm transition-colors hover:text-foreground"
                    >
                      <TriangleAlert className="size-4 shrink-0 text-warning" />
                      <span className="flex-1">{a.label}</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
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
