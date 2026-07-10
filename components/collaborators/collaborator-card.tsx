import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "./level-badge";
import { CollabStatusBadge } from "./status-badge";
import { PersonAvatar } from "@/components/common/person-avatar";
import { displayName } from "@/lib/format";
import type { Collaborator } from "@/lib/network/queries";

export function CollaboratorCard({
  collaborator,
  capoName,
}: {
  collaborator: Collaborator;
  capoName?: string | null;
}) {
  const name = displayName(collaborator);

  return (
    <Link href={`/collaborators/${collaborator.id}`} className="block">
      <Card className="gap-0 p-3 transition-colors hover:bg-accent/50">
        <div className="flex items-start gap-3">
          <PersonAvatar name={name} avatarUrl={collaborator.avatar_url} />
          <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-medium">{name}</div>
              <div className="truncate text-xs text-muted-foreground">
                @{collaborator.instagram_username}
                {capoName ? ` · ${capoName}` : ""}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <LevelBadge level={collaborator.level} />
              <CollabStatusBadge status={collaborator.status} />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
