import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "./level-badge";
import { CollabStatusBadge } from "./status-badge";
import type { Collaborator } from "@/lib/network/queries";

export function CollaboratorCard({
  collaborator,
  teamName,
}: {
  collaborator: Collaborator;
  teamName?: string | null;
}) {
  const name =
    [collaborator.first_name, collaborator.last_name].filter(Boolean).join(" ") ||
    `@${collaborator.instagram_username}`;

  return (
    <Link href={`/collaborators/${collaborator.id}`} className="block">
      <Card className="gap-0 p-3 transition-colors hover:bg-accent/50">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium">{name}</div>
            <div className="truncate text-xs text-muted-foreground">
              @{collaborator.instagram_username}
              {teamName ? ` · ${teamName}` : ""}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <LevelBadge level={collaborator.level} />
            <CollabStatusBadge status={collaborator.status} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
