import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Target, ClipboardList, Trophy } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";
import { getEvent, getEventTeamAssignments, getEventPerformances } from "@/lib/events/queries";
import { listTeams, listCollaborators } from "@/lib/network/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { sumPerformances, groupPerformances } from "@/lib/performance";
import { displayName } from "@/lib/format";
import { EventStatusBadge } from "@/components/events/status-badge";
import { EventStatusSelect } from "@/components/events/status-select";
import { TeamAssign } from "@/components/events/team-assign";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { longDate } from "@/lib/dates";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, current, assignments, teams, performances, collaborators] =
    await Promise.all([
      getEvent(id),
      getSessionUser(),
      getEventTeamAssignments(id),
      listTeams(),
      getEventPerformances(id),
      listCollaborators(),
    ]);
  if (!event) notFound();

  const manager = isManager(current?.profile);
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const collabById = Object.fromEntries(collaborators.map((c) => [c.id, c]));

  const assignedTeamIds = new Set(assignments.map((a) => a.team_id));
  const assignedTeams = assignments
    .map((a) => teamById[a.team_id])
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({ id: t.id, name: t.name }));
  const availableTeams = teams
    .filter((t) => !assignedTeamIds.has(t.id))
    .map((t) => ({ id: t.id, name: t.name }));

  const totals = sumPerformances(performances);

  const teamRanking = groupPerformances(performances, (p) => p.team_id ?? "senza-squadra").map(
    (g) => ({ teamId: g.key, name: teamById[g.key]?.name ?? "Senza squadra", score: g.score }),
  );

  const collabRanking = [...performances]
    .sort((a, b) => b.performance_score - a.performance_score)
    .slice(0, 10)
    .map((p) => ({
      id: p.collaborator_id,
      name: displayName(
        collabById[p.collaborator_id] ?? {
          first_name: null,
          last_name: null,
          instagram_username: "sconosciuto",
        },
      ),
      score: p.performance_score,
    }));

  const daysUntil = differenceInCalendarDays(new Date(event.event_date), new Date());
  const daysLabel =
    daysUntil > 0
      ? `Tra ${daysUntil} ${daysUntil === 1 ? "giorno" : "giorni"}`
      : daysUntil === 0
        ? "Oggi"
        : "Passato";

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/events" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {event.name}
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{longDate(event.event_date)}</span>
            <span>· {daysLabel}</span>
            <EventStatusBadge status={event.status} />
          </div>
        </div>
      </div>

      {(event.venue || event.city || event.target_attendance || event.description) ? (
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            {event.venue || event.city ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                {[event.venue, event.city].filter(Boolean).join(", ")}
              </p>
            ) : null}
            {event.target_attendance ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Target className="size-4" /> Obiettivo {event.target_attendance} ingressi
              </p>
            ) : null}
            {event.description ? <p>{event.description}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      {manager ? (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Stato evento</label>
          <EventStatusSelect eventId={event.id} status={event.status} />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Lista" value={totals.listNames} />
        <StatCard label="Ticket" value={totals.tickets} />
        <StatCard label="Tavoli" value={totals.tables} />
        <StatCard label="Score" value={totals.score} />
      </div>

      <Link
        href={`/events/${event.id}/performance`}
        className={cn(buttonVariants(), "h-11 w-full gap-2")}
      >
        <ClipboardList className="size-4" /> Inserisci numeri
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Squadre assegnate</CardTitle>
        </CardHeader>
        <CardContent>
          {manager ? (
            <TeamAssign
              eventId={event.id}
              assignedTeams={assignedTeams}
              availableTeams={availableTeams}
            />
          ) : assignedTeams.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna squadra assegnata.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {assignedTeams.map((t) => (
                <li key={t.id}>{t.name}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {teamRanking.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4" /> Classifica squadre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {teamRanking.map((t, i) => (
              <div key={t.teamId} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground">#{i + 1}</span> {t.name}
                </span>
                <span className="font-medium tabular-nums">{t.score} pt</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {collabRanking.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top collaboratori</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {collabRanking.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <Link href={`/collaborators/${c.id}`} className="flex items-center gap-2 hover:underline">
                  <span className="text-muted-foreground">#{i + 1}</span> {c.name}
                </Link>
                <span className="font-medium tabular-nums">{c.score} pt</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
