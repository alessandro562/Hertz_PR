import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getCollaborator,
  listTeams,
  listGroups,
  getCollaboratorGroupIds,
} from "@/lib/network/queries";
import { getCollaboratorPerformances, listEvents } from "@/lib/events/queries";
import { getSessionUser } from "@/lib/auth/session";
import { canEditCollaborator } from "@/lib/permissions";
import { displayName } from "@/lib/format";
import { CollaboratorActions } from "@/components/collaborators/collaborator-actions";
import { GroupMembership } from "@/components/collaborators/group-membership";
import { EditCollaboratorForm } from "@/components/collaborators/edit-collaborator-form";
import { PerformanceHistory } from "@/components/collaborators/performance-history";
import { LevelBadge } from "@/components/collaborators/level-badge";
import { CollabStatusBadge } from "@/components/collaborators/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CollaboratorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collaborator, current, teams, groups, memberGroupIds, performances, events] =
    await Promise.all([
      getCollaborator(id),
      getSessionUser(),
      listTeams(),
      listGroups(),
      getCollaboratorGroupIds(id),
      getCollaboratorPerformances(id),
      listEvents(),
    ]);
  if (!collaborator) notFound();

  const canEdit = canEditCollaborator(current?.profile, collaborator);
  const name = displayName(collaborator);
  const eventById = Object.fromEntries(events.map((e) => [e.id, e]));

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/collaborators" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{name}</h1>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">@{collaborator.instagram_username}</span>
            <LevelBadge level={collaborator.level} />
            <CollabStatusBadge status={collaborator.status} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <CollaboratorActions collaborator={collaborator} teams={teams} canEdit={canEdit} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gruppi WhatsApp</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupMembership
            collaboratorId={collaborator.id}
            groups={groups}
            memberGroupIds={memberGroupIds}
            canEdit={canEdit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceHistory performances={performances} eventById={eventById} />
        </CardContent>
      </Card>

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheda</CardTitle>
          </CardHeader>
          <CardContent>
            <EditCollaboratorForm collaborator={collaborator} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
