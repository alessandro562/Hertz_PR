import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getTeam,
  getTeamCollaborators,
  listGroupsForTeam,
  profilesNameMap,
} from "@/lib/network/queries";
import { getSessionUser } from "@/lib/auth/session";
import { canManageTeam } from "@/lib/permissions";
import { CollaboratorCard } from "@/components/collaborators/collaborator-card";
import { CreateGroupForm } from "@/components/teams/create-group-form";
import { GROUP_TYPE_LABELS } from "@/lib/constants/collaborators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [team, current, members, groups, names] = await Promise.all([
    getTeam(id),
    getSessionUser(),
    getTeamCollaborators(id),
    listGroupsForTeam(id),
    profilesNameMap(),
  ]);
  if (!team) notFound();

  const canManage = canManageTeam(current?.profile, team);
  const active = members.filter(
    (c) => c.status === "attivo" || c.status === "molto_attivo",
  );
  const dormant = members.filter(
    (c) => c.status === "dormiente" || c.status === "da_riattivare",
  );

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/teams" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
          <p className="text-sm text-muted-foreground">
            Capo PR: {names[team.capo_pr_user_id] ?? "—"}
          </p>
        </div>
      </div>

      {team.description ? (
        <p className="text-sm text-muted-foreground">{team.description}</p>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Membri" value={members.length} />
        <StatCard label="Attivi" value={active.length} />
        <StatCard label="Dormienti" value={dormant.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gruppi WhatsApp della squadra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun gruppo ancora.</p>
          ) : (
            groups.map((g) => (
              <div key={g.id} className="rounded-md border border-input px-3 py-2 text-sm">
                <p className="font-medium">
                  {g.name}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {GROUP_TYPE_LABELS[g.type]}
                  </span>
                </p>
                {g.invite_link ? (
                  <a
                    href={g.invite_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Apri link invito
                  </a>
                ) : null}
              </div>
            ))
          )}
          {canManage ? <CreateGroupForm teamId={team.id} /> : null}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Membri ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nessun collaboratore assegnato. Assegnali dalla loro scheda.
          </p>
        ) : (
          <div className="space-y-2">
            {members.map((c) => (
              <CollaboratorCard key={c.id} collaborator={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
