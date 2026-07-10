import type { Metadata } from "next";
import Link from "next/link";
import { Plus, UsersRound } from "lucide-react";
import {
  listTeams,
  listCollaborators,
  listGlobalGroups,
  profilesNameMap,
} from "@/lib/network/queries";
import { getSessionUser } from "@/lib/auth/session";
import { isManager } from "@/lib/permissions";
import { TeamCard } from "@/components/teams/team-card";
import { CreateGroupForm } from "@/components/teams/create-group-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Squadre PR" };

export default async function TeamsPage() {
  const [teams, collaborators, current, bacheca, names] = await Promise.all([
    listTeams(),
    listCollaborators(),
    getSessionUser(),
    listGlobalGroups(),
    profilesNameMap(),
  ]);
  const manager = isManager(current?.profile);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Squadre PR</h1>
          <p className="text-sm text-muted-foreground">
            {teams.length} {teams.length === 1 ? "squadra" : "squadre"}
          </p>
        </div>
        {manager ? (
          <Link href="/teams/new" className={cn(buttonVariants(), "h-10 gap-2")}>
            <Plus className="size-4" /> Nuova
          </Link>
        ) : null}
      </div>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <UsersRound className="size-8" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Nessuna squadra ancora</p>
            <p className="text-xs">
              {manager
                ? "Crea la prima squadra e assegnale un Capo PR."
                : "Il Manager non ha ancora creato nessuna squadra."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((t) => {
            const members = collaborators.filter((c) => c.team_id === t.id);
            const active = members.filter(
              (c) => c.status === "attivo" || c.status === "molto_attivo",
            );
            return (
              <TeamCard
                key={t.id}
                id={t.id}
                name={t.name}
                capoName={names[t.capo_pr_user_id] ?? "—"}
                memberCount={members.length}
                activeCount={active.length}
              />
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bacheca generale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Chi ricondivide le storie senza essere in una squadra. Un solo link,
            valido per tutti.
          </p>
          {bacheca.map((g) => (
            <div key={g.id} className="rounded-md border border-input px-3 py-2 text-sm">
              <p className="font-medium">{g.name}</p>
              {g.invite_link ? (
                <a
                  href={g.invite_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-primary underline"
                >
                  Apri link invito
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">Nessun link ancora.</p>
              )}
            </div>
          ))}
          {manager && bacheca.length === 0 ? (
            <CreateGroupForm defaultType="bacheca" />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
