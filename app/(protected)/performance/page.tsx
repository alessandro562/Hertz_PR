import type { Metadata } from "next";
import { BarChart3, TrendingUp, Calendar, Trophy } from "lucide-react";
import { listEvents } from "@/lib/events/queries";
import { listAllPerformances, listRankingCollaborators } from "@/lib/rankings/queries";
import { listTeams, profilesNameMap } from "@/lib/network/queries";
import { sumPerformances } from "@/lib/performance";
import { pivotTrend, totalTrend, topKeys } from "@/lib/performance-trends";
import { displayName, formatSigned } from "@/lib/format";
import { TrendChart } from "@/components/performance/trend-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Performance" };

export default async function PerformancePage() {
  const [events, performances, teams, names, rankingCollaborators] = await Promise.all([
    listEvents(),
    listAllPerformances(),
    listTeams(),
    profilesNameMap(),
    listRankingCollaborators(),
  ]);

  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const collabById = Object.fromEntries(rankingCollaborators.map((c) => [c.id, c]));
  const teamName = (id: string) => teamById[id]?.name ?? "Senza squadra";
  const capoName = (id: string) => names[id] ?? "—";

  // Only events with numbers actually entered, oldest first (chart x-axis order).
  const eventIdsWithData = new Set(performances.map((p) => p.event_id));
  const eventPoints = events
    .filter((e) => eventIdsWithData.has(e.id))
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .map((e) => ({ eventId: e.id, eventDate: e.event_date, label: e.name }));

  if (eventPoints.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <BarChart3 className="size-8" />
            <p className="max-w-sm text-sm">
              Ancora nessun numero registrato. I grafici di andamento compariranno qui
              dopo il primo evento con performance inserite.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totals = sumPerformances(performances);
  const avgScore = Math.round(totals.score / eventPoints.length);

  const scoreByEvent = new Map<string, number>();
  for (const p of performances) {
    scoreByEvent.set(p.event_id, (scoreByEvent.get(p.event_id) ?? 0) + p.performance_score);
  }
  const latestPoint = eventPoints[eventPoints.length - 1]!;
  const previousPoint = eventPoints.length > 1 ? eventPoints[eventPoints.length - 2]! : null;
  const latestScore = scoreByEvent.get(latestPoint.eventId) ?? 0;
  const scoreDelta = previousPoint
    ? latestScore - (scoreByEvent.get(previousPoint.eventId) ?? 0)
    : null;

  const overallTrend = totalTrend(
    performances.map((p) => ({ eventId: p.event_id, score: p.performance_score })),
    eventPoints,
  );

  const teamRows = performances
    .filter((p) => p.team_id)
    .map((p) => ({
      key: teamName(p.team_id as string),
      eventId: p.event_id,
      score: p.performance_score,
    }));
  const topTeams = topKeys(teamRows, 5);
  const teamTrend = pivotTrend(
    teamRows.filter((r) => topTeams.includes(r.key)),
    eventPoints,
  );

  const capoRows = performances
    .filter((p) => p.capo_pr_user_id)
    .map((p) => ({
      key: capoName(p.capo_pr_user_id as string),
      eventId: p.event_id,
      score: p.performance_score,
    }));
  const topCapos = topKeys(capoRows, 5);
  const capoTrend = pivotTrend(
    capoRows.filter((r) => topCapos.includes(r.key)),
    eventPoints,
  );

  const collabRows = performances.map((p) => {
    const c = collabById[p.collaborator_id];
    return {
      key: c ? displayName(c) : "—",
      eventId: p.event_id,
      score: p.performance_score,
    };
  });
  const topCollabs = topKeys(collabRows, 5);
  const collabTrend = pivotTrend(
    collabRows.filter((r) => topCollabs.includes(r.key)),
    eventPoints,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">
          Andamento su {eventPoints.length} {eventPoints.length === 1 ? "evento" : "eventi"}{" "}
          con numeri inseriti
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Eventi con dati" value={eventPoints.length} icon={Calendar} />
        <StatCard label="Punteggio totale" value={totals.score} icon={Trophy} />
        <StatCard label="Media per evento" value={avgScore} icon={BarChart3} />
        <StatCard
          label="Ultimo evento"
          value={`${latestScore} pt`}
          icon={TrendingUp}
          hint={
            scoreDelta !== null
              ? `${formatSigned(scoreDelta)} pt vs precedente`
              : latestPoint.label
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Andamento generale</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={overallTrend} series={["Punteggio totale"]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Squadre nel tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={teamTrend} series={topTeams} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capi PR nel tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={capoTrend} series={topCapos} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top collaboratori nel tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendChart data={collabTrend} series={topCollabs} />
        </CardContent>
      </Card>
    </div>
  );
}
