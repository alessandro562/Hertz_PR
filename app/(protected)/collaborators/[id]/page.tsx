import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCollaborator, listCapiPr } from "@/lib/network/queries";
import { getCollaboratorPerformances, listEvents } from "@/lib/events/queries";
import { getSessionUser } from "@/lib/auth/session";
import { canEditCollaborator, isManager } from "@/lib/permissions";
import { displayName } from "@/lib/format";
import { setCollaboratorAvatar } from "@/lib/network/actions";
import { CollaboratorActions } from "@/components/collaborators/collaborator-actions";
import { EditCollaboratorForm } from "@/components/collaborators/edit-collaborator-form";
import { DeleteCollaboratorButton } from "@/components/collaborators/delete-collaborator-button";
import { PerformanceHistory } from "@/components/collaborators/performance-history";
import { LevelBadge } from "@/components/collaborators/level-badge";
import { CollabStatusBadge } from "@/components/collaborators/status-badge";
import { AvatarUpload } from "@/components/common/avatar-upload";
import { PersonAvatar } from "@/components/common/person-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CollaboratorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collaborator, current, capi, performances, events] =
    await Promise.all([
      getCollaborator(id),
      getSessionUser(),
      listCapiPr(),
      getCollaboratorPerformances(id),
      listEvents(),
    ]);
  if (!collaborator) notFound();

  const canEdit = canEditCollaborator(current?.profile, collaborator);
  const manager = isManager(current?.profile);
  const name = displayName(collaborator);
  const eventById = Object.fromEntries(events.map((e) => [e.id, e]));

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/collaborators" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        {canEdit ? (
          <AvatarUpload
            entity="collaborators"
            entityId={collaborator.id}
            name={name}
            avatarUrl={collaborator.avatar_url}
            onUploaded={setCollaboratorAvatar.bind(null, collaborator.id)}
          />
        ) : (
          <PersonAvatar name={name} avatarUrl={collaborator.avatar_url} size="lg" />
        )}
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
          <CollaboratorActions
            collaborator={collaborator}
            capi={capi}
            canEdit={canEdit}
            canAssignCapo={isManager(current?.profile)}
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

      {manager ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-destructive">Elimina</CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteCollaboratorButton
              collaboratorId={collaborator.id}
              fromLead={!!collaborator.lead_id}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
