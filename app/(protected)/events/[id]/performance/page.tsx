import { notFound } from "next/navigation";
import { Inbox } from "lucide-react";
import { getEvent, getEventPerformances } from "@/lib/events/queries";
import {
  listCollaborators,
  listCapiPr,
  profilesNameMap,
} from "@/lib/network/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { displayName } from "@/lib/format";
import { LEVEL_LABELS } from "@/lib/constants/collaborators";
import {
  PerformanceEntry,
  type EntryGroup,
} from "@/components/events/performance-entry";
import { BackLink } from "@/components/common/back-link";
import type { Collaborator } from "@/lib/network/queries";

export default async function EventPerformancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, current, performances, collaborators, capi, names] =
    await Promise.all([
      getEvent(id),
      getSessionUser(),
      getEventPerformances(id),
      listCollaborators(),
      listCapiPr(),
      profilesNameMap(),
    ]);
  if (!event) notFound();
  if (!current) return null;

  const manager = isManager(current.profile);
  const capiIds = new Set(capi.map((c) => c.id));

  // Manager enters numbers for everyone; a Capo PR only for their own PRs.
  const visible = manager
    ? collaborators
    : collaborators.filter((c) => c.capo_pr_user_id === current.id);

  const performanceByCollaborator = Object.fromEntries(
    performances.map((p) => [p.collaborator_id, p]),
  );

  // Group by Capo PR. The Manager view distinguishes many capos; a Capo PR
  // sees a single (own) group, so we hide the redundant heading for them.
  const groupsMap = new Map<string, Collaborator[]>();
  for (const c of visible) {
    const key =
      c.capo_pr_user_id && capiIds.has(c.capo_pr_user_id)
        ? c.capo_pr_user_id
        : "senza-capo";
    const bucket = groupsMap.get(key);
    if (bucket) bucket.push(c);
    else groupsMap.set(key, [c]);
  }
  const entryGroups: EntryGroup[] = [...groupsMap.entries()]
    .map(([key, list]) => ({
      key,
      label: key === "senza-capo" ? "Senza Capo PR" : (names[key] ?? "—"),
      list,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((g) => ({
      key: g.key,
      name: manager ? g.label : null,
      rows: g.list.map((c) => ({
        collaboratorId: c.id,
        name: displayName(c),
        subtitle: LEVEL_LABELS[c.level],
        initial: performanceByCollaborator[c.id],
      })),
    }));

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <BackLink href={`/events/${event.id}`} />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Numeri evento</h1>
          <p className="text-sm text-muted-foreground">{event.name}</p>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Inbox className="size-8" />
          <p className="max-w-xs text-sm">
            {manager
              ? "Nessun collaboratore registrato ancora. Convertili dai lead."
              : "Non hai ancora PR abbinati. Chiedi a un Manager di abbinarteli."}
          </p>
        </div>
      ) : (
        <PerformanceEntry eventId={event.id} groups={entryGroups} />
      )}
    </div>
  );
}
