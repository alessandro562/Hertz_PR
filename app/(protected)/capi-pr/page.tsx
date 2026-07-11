import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UsersRound } from "lucide-react";
import { listCollaborators, listCapiPr } from "@/lib/network/queries";
import { listEvents, type Event, type EventPerformance } from "@/lib/events/queries";
import { listAllPerformances } from "@/lib/rankings/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { sumPerformances } from "@/lib/performance";
import { CollaboratorCard } from "@/components/collaborators/collaborator-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Collaborator } from "@/lib/network/queries";

export const metadata: Metadata = { title: "Capi PR" };

const isActive = (c: Collaborator) =>
  c.status === "attivo" || c.status === "affidabile";
const isDormant = (c: Collaborator) =>
  c.status === "inattivo" || c.status === "da_riattivare";

/** Score of a capo's most recent event (same logic as the Capo PR dashboard). */
function latestEventScore(
  perfs: EventPerformance[],
  dateById: Record<string, string>,
): number {
  if (perfs.length === 0) return 0;
  const latestEventId = [...perfs].sort((a, b) =>
    (dateById[b.event_id] ?? "").localeCompare(dateById[a.event_id] ?? ""),
  )[0]?.event_id;
  if (!latestEventId) return 0;
  return sumPerformances(perfs.filter((p) => p.event_id === latestEventId)).score;
}

export default async function CapiPrPage() {
  const current = await getSessionUser();
  if (!current || !isManager(current.profile)) notFound();

  const [capi, collaborators, performances, events] = await Promise.all([
    listCapiPr(),
    listCollaborators(),
    listAllPerformances(),
    listEvents(),
  ]);

  const dateById: Record<string, string> = Object.fromEntries(
    events.map((e: Event) => [e.id, e.event_date]),
  );
  const capiIds = new Set(capi.map((c) => c.id));

  const groups = capi
    .map((capo) => {
      const pairs = collaborators.filter((c) => c.capo_pr_user_id === capo.id);
      const perfs = performances.filter((p) => p.capo_pr_user_id === capo.id);
      return {
        id: capo.id,
        name: capo.full_name,
        pairs,
        active: pairs.filter(isActive).length,
        dormant: pairs.filter(isDormant).length,
        score: latestEventScore(perfs, dateById),
      };
    })
    .sort((a, b) => b.pairs.length - a.pairs.length);

  const orphans = collaborators.filter(
    (c) => !c.capo_pr_user_id || !capiIds.has(c.capo_pr_user_id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Capi PR</h1>
        <p className="text-sm text-muted-foreground">
          {capi.length} {capi.length === 1 ? "Capo PR" : "Capi PR"} · ogni PR è
          abbinato a un Capo
        </p>
      </div>

      {capi.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <UsersRound className="size-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Nessun Capo PR registrato
            </p>
            <p className="text-xs">
              Crea gli account Capo PR dalla pagina{" "}
              <Link href="/users" className="text-primary underline">
                Utenti
              </Link>
              .
            </p>
          </div>
        </div>
      ) : null}

      {groups.map((g) => (
        <Card key={g.id}>
          <CardHeader className="gap-1">
            <div className="flex items-baseline justify-between gap-2">
              <CardTitle className="text-base">{g.name}</CardTitle>
              <span className="shrink-0 text-sm text-muted-foreground">
                <span className="num text-base text-foreground">{g.score}</span> pt
                <span className="ml-1 text-xs">ult. evento</span>
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {g.pairs.length} {g.pairs.length === 1 ? "PR" : "PR"} · {g.active}{" "}
              attivi · {g.dormant} dormienti
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {g.pairs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nessun PR abbinato. Abbinali dalla scheda del collaboratore.
              </p>
            ) : (
              g.pairs.map((c) => (
                <CollaboratorCard key={c.id} collaborator={c} />
              ))
            )}
          </CardContent>
        </Card>
      ))}

      {orphans.length > 0 ? (
        <Card>
          <CardHeader className="gap-1">
            <CardTitle className="text-base">Senza Capo PR</CardTitle>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {orphans.length} da abbinare
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {orphans.map((c) => (
              <CollaboratorCard key={c.id} collaborator={c} />
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
