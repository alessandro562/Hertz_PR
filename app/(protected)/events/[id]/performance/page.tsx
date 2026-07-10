import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import {
  getEvent,
  getEventTeamAssignments,
  getEventPerformances,
} from "@/lib/events/queries";
import { getTeamCollaborators, getTeamForCapo, listTeams } from "@/lib/network/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { displayName } from "@/lib/format";
import { LEVEL_LABELS } from "@/lib/constants/collaborators";
import { PerformanceCard } from "@/components/events/performance-card";

export default async function EventPerformancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, current, assignments, teams] = await Promise.all([
    getEvent(id),
    getSessionUser(),
    getEventTeamAssignments(id),
    listTeams(),
  ]);
  if (!event) notFound();
  if (!current) return null;

  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]));
  const assignedTeamIds = assignments.map((a) => a.team_id);

  let visibleTeamIds = assignedTeamIds;
  if (!isManager(current.profile)) {
    const myTeam = await getTeamForCapo(current.id);
    visibleTeamIds = myTeam && assignedTeamIds.includes(myTeam.id) ? [myTeam.id] : [];
  }

  const [collaboratorsByTeam, performances] = await Promise.all([
    Promise.all(visibleTeamIds.map((teamId) => getTeamCollaborators(teamId))),
    getEventPerformances(id),
  ]);
  const performanceByCollaborator = Object.fromEntries(
    performances.map((p) => [p.collaborator_id, p]),
  );

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link
          href={`/events/${event.id}`}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Numeri evento</h1>
          <p className="text-sm text-muted-foreground">{event.name}</p>
        </div>
      </div>

      {visibleTeamIds.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Inbox className="size-8" />
          <p className="max-w-xs text-sm">
            {assignedTeamIds.length === 0
              ? "Nessuna squadra è ancora stata assegnata a questo evento."
              : "La tua squadra non è stata assegnata a questo evento."}
          </p>
        </div>
      ) : (
        visibleTeamIds.map((teamId, i) => {
          const collaborators = collaboratorsByTeam[i];
          const teamName = teamById[teamId]?.name ?? "Squadra";
          return (
            <div key={teamId} className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">{teamName}</h2>
              {collaborators.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nessun collaboratore in questa squadra ancora.
                </p>
              ) : (
                <div className="space-y-3">
                  {collaborators.map((c) => (
                    <PerformanceCard
                      key={c.id}
                      eventId={event.id}
                      collaboratorId={c.id}
                      name={displayName(c)}
                      subtitle={`${LEVEL_LABELS[c.level]} · ${teamName}`}
                      initial={performanceByCollaborator[c.id]}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
