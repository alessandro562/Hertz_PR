import type { Metadata } from "next";
import { listEvents } from "@/lib/events/queries";
import {
  listAllPerformances,
  listRankingCollaborators,
  listHotLeadsNeedingFollowUp,
} from "@/lib/rankings/queries";
import { listTeams, profilesNameMap } from "@/lib/network/queries";
import { sumPerformances, groupPerformances } from "@/lib/performance";
import { computeGrowth } from "@/lib/rankings";
import { displayName, formatSigned } from "@/lib/format";
import { shortDate, isOverdue, daysAgoIso } from "@/lib/dates";
import { RankingList, type RankingItem } from "@/components/rankings/ranking-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Classifiche" };

export default async function RankingsPage() {
  const [events, performances, rankingCollaborators, hotLeads, teams, names] =
    await Promise.all([
      listEvents(),
      listAllPerformances(),
      listRankingCollaborators(),
      listHotLeadsNeedingFollowUp(),
      listTeams(),
      profilesNameMap(),
    ]);

  const eventById = Object.fromEntries(events.map((e) => [e.id, e]));
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const collabById = Object.fromEntries(rankingCollaborators.map((c) => [c.id, c]));

  const capoName = (userId: string) => names[userId] ?? "—";
  const teamName = (teamId: string) => teamById[teamId]?.name ?? "Senza squadra";

  // "Ultimo evento" = most recent event (by date) that actually has numbers.
  const eventIdsWithData = new Set(performances.map((p) => p.event_id));
  const latestEvent =
    [...events]
      .filter((e) => eventIdsWithData.has(e.id))
      .sort((a, b) => b.event_date.localeCompare(a.event_date))[0] ?? null;
  const latestEventPerformances = latestEvent
    ? performances.filter((p) => p.event_id === latestEvent.id)
    : [];

  // "Mese" = rolling last 30 days.
  const monthCutoff = daysAgoIso(30);
  const monthlyPerformances = performances.filter((p) => {
    const date = eventById[p.event_id]?.event_date;
    return date ? date >= monthCutoff : false;
  });

  const bestCapoLastEvent: RankingItem[] = groupPerformances(
    latestEventPerformances,
    (p) => p.capo_pr_user_id ?? "senza-capo",
  ).map((g) => ({ id: g.key, name: capoName(g.key), value: `${g.score} pt` }));

  const bestTeamLastEvent: RankingItem[] = groupPerformances(
    latestEventPerformances,
    (p) => p.team_id ?? "senza-squadra",
  ).map((g) => ({ id: g.key, name: teamName(g.key), value: `${g.score} pt` }));

  const bestCollabLastEvent: RankingItem[] = [...latestEventPerformances]
    .sort((a, b) => b.performance_score - a.performance_score)
    .slice(0, 10)
    .map((p) => {
      const c = collabById[p.collaborator_id];
      return {
        id: p.collaborator_id,
        name: c ? displayName(c) : "—",
        sublabel: c?.team_id ? teamName(c.team_id) : undefined,
        value: `${p.performance_score} pt`,
        href: `/collaborators/${p.collaborator_id}`,
        avatarUrl: c?.avatar_url,
      };
    });

  const bestCapoMonth: RankingItem[] = groupPerformances(
    monthlyPerformances,
    (p) => p.capo_pr_user_id ?? "senza-capo",
  ).map((g) => ({ id: g.key, name: capoName(g.key), value: `${g.score} pt` }));

  const bestTeamMonth: RankingItem[] = groupPerformances(
    monthlyPerformances,
    (p) => p.team_id ?? "senza-squadra",
  ).map((g) => ({ id: g.key, name: teamName(g.key), value: `${g.score} pt` }));

  const capoGrowth: RankingItem[] = computeGrowth(
    performances
      .filter((p) => p.capo_pr_user_id && eventById[p.event_id])
      .map((p) => ({
        key: p.capo_pr_user_id as string,
        eventId: p.event_id,
        eventDate: eventById[p.event_id]!.event_date,
        score: p.performance_score,
      })),
  )
    .slice(0, 10)
    .map((g) => ({ id: g.key, name: capoName(g.key), value: formatSigned(g.growth) }));

  const dormantCollaborators: RankingItem[] = rankingCollaborators
    .filter((c) => c.status === "dormiente" || c.status === "da_riattivare")
    .map((c) => ({
      id: c.id,
      name: displayName(c),
      sublabel: c.team_id ? teamName(c.team_id) : undefined,
      value: c.status === "dormiente" ? "Dormiente" : "Da riattivare",
      href: `/collaborators/${c.id}`,
      avatarUrl: c.avatar_url,
    }));

  const teamDormancy = new Map<string, { total: number; dormant: number }>();
  for (const c of rankingCollaborators) {
    if (!c.team_id) continue;
    const entry = teamDormancy.get(c.team_id) ?? { total: 0, dormant: 0 };
    entry.total += 1;
    if (c.status === "dormiente" || c.status === "da_riattivare") entry.dormant += 1;
    teamDormancy.set(c.team_id, entry);
  }
  const dormantTeams: RankingItem[] = [...teamDormancy.entries()]
    .map(([teamId, v]) => ({ teamId, ...v, ratio: v.dormant / v.total }))
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 10)
    .map((t) => ({
      id: t.teamId,
      name: teamName(t.teamId),
      sublabel: `${t.dormant}/${t.total} dormienti`,
      value: `${Math.round(t.ratio * 100)}%`,
    }));

  const hotLeadItems: RankingItem[] = hotLeads.map((l) => ({
    id: l.id,
    name: displayName(l),
    value: l.next_follow_up_at
      ? `Scaduto ${shortDate(l.next_follow_up_at)}`
      : "Nessun follow-up",
    href: `/leads/${l.id}`,
    avatarUrl: l.avatar_url,
  }));
  const overdueCount = hotLeads.filter((l) => isOverdue(l.next_follow_up_at)).length;

  const latestTotals = sumPerformances(latestEventPerformances);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Classifiche</h1>

      {latestEvent ? (
        <>
          <div>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Ultimo evento · {latestEvent.name} · {latestTotals.score} pt totali
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Miglior Capo PR</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankingList items={bestCapoLastEvent} emptyLabel="Nessun dato." />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Miglior Squadra</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankingList items={bestTeamLastEvent} emptyLabel="Nessun dato." />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Miglior Collaboratore</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankingList items={bestCollabLastEvent} emptyLabel="Nessun dato." />
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Ultimi 30 giorni
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Capi PR del mese</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankingList items={bestCapoMonth} emptyLabel="Nessun evento recente." />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Squadre del mese</CardTitle>
                </CardHeader>
                <CardContent>
                  <RankingList items={bestTeamMonth} emptyLabel="Nessun evento recente." />
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Miglior crescita</CardTitle>
            </CardHeader>
            <CardContent>
              <RankingList
                items={capoGrowth}
                emptyLabel="Serve almeno un secondo evento per calcolare la crescita."
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nessun numero ancora registrato su nessun evento.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Collaboratori da riattivare</CardTitle>
          </CardHeader>
          <CardContent>
            <RankingList items={dormantCollaborators} emptyLabel="Nessuno, tutti attivi." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Squadre più dormienti</CardTitle>
          </CardHeader>
          <CardContent>
            <RankingList items={dormantTeams} emptyLabel="Nessun dato ancora." />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Lead caldi senza follow-up
            {overdueCount > 0 ? ` · ${overdueCount} scaduti` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RankingList items={hotLeadItems} emptyLabel="Nessuno, sei in pari 🎉" />
        </CardContent>
      </Card>
    </div>
  );
}
