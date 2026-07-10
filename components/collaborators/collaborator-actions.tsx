"use client";

import { useTransition, type ChangeEvent } from "react";
import { AtSign, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  setCollaboratorLevel,
  setCollaboratorStatus,
  assignCollaboratorTeam,
} from "@/lib/network/actions";
import { instagramUrl } from "@/lib/instagram";
import { whatsappLink, hasWhatsapp } from "@/lib/whatsapp";
import { LEVELS, LEVEL_LABELS, COLLAB_STATUSES, COLLAB_STATUS_LABELS } from "@/lib/constants/collaborators";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Collaborator, Team } from "@/lib/network/queries";
import type { CollaboratorLevel, CollaboratorStatus } from "@/types/database";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function CollaboratorActions({
  collaborator,
  teams,
  canEdit,
}: {
  collaborator: Collaborator;
  teams: Team[];
  canEdit: boolean;
}) {
  const [pending, start] = useTransition();

  function onLevel(e: ChangeEvent<HTMLSelectElement>) {
    const level = e.target.value as CollaboratorLevel;
    start(async () => {
      const res = await setCollaboratorLevel(collaborator.id, level);
      if (res.error) toast.error(res.error);
      else toast.success("Livello aggiornato");
    });
  }

  function onStatus(e: ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as CollaboratorStatus;
    start(async () => {
      const res = await setCollaboratorStatus(collaborator.id, status);
      if (res.error) toast.error(res.error);
      else toast.success("Stato aggiornato");
    });
  }

  function onTeam(e: ChangeEvent<HTMLSelectElement>) {
    start(async () => {
      const res = await assignCollaboratorTeam(collaborator.id, e.target.value);
      if (res.error) toast.error(res.error);
      else toast.success("Squadra aggiornata");
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={instagramUrl(collaborator.instagram_username)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2")}
        >
          <AtSign className="size-4" /> Instagram
        </a>
        {hasWhatsapp(collaborator.phone) ? (
          <a
            href={whatsappLink(collaborator.phone)}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2")}
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        ) : (
          <Button variant="outline" className="h-11 gap-2" disabled>
            <MessageCircle className="size-4" /> WhatsApp
          </Button>
        )}
      </div>

      {canEdit ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Livello</label>
              <select
                className={SELECT}
                defaultValue={collaborator.level}
                onChange={onLevel}
                disabled={pending}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_LABELS[l]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Stato</label>
              <select
                className={SELECT}
                defaultValue={collaborator.status}
                onChange={onStatus}
                disabled={pending}
              >
                {COLLAB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {COLLAB_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Squadra</label>
            <select
              className={SELECT}
              defaultValue={collaborator.team_id ?? ""}
              onChange={onTeam}
              disabled={pending}
            >
              <option value="">Nessuna squadra</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}
    </div>
  );
}
