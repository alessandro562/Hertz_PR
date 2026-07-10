import type { Metadata } from "next";
import { Users } from "lucide-react";
import { listCollaborators, profilesNameMap } from "@/lib/network/queries";
import { CollaboratorCard } from "@/components/collaborators/collaborator-card";

export const metadata: Metadata = { title: "Collaboratori" };

export default async function CollaboratorsPage() {
  const [collaborators, names] = await Promise.all([
    listCollaborators(),
    profilesNameMap(),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Collaboratori</h1>
        <p className="text-sm text-muted-foreground">
          {collaborators.length}{" "}
          {collaborators.length === 1 ? "collaboratore" : "collaboratori"}
        </p>
      </div>

      {collaborators.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Users className="size-8" />
          <p className="text-sm">
            Nessun collaboratore ancora. Convertili dalla scheda di un lead.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {collaborators.map((c) => (
            <CollaboratorCard
              key={c.id}
              collaborator={c}
              capoName={c.capo_pr_user_id ? names[c.capo_pr_user_id] : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
