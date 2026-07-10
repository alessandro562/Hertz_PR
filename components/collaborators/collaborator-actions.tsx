"use client";

import { useTransition } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Collaborator, Team } from "@/lib/network/queries";
import type { CollaboratorLevel, CollaboratorStatus } from "@/types/database";

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

  function onLevel(level: CollaboratorLevel | null) {
    if (!level) return;
    start(async () => {
      const res = await setCollaboratorLevel(collaborator.id, level);
      if (res.error) toast.error(res.error);
      else toast.success("Livello aggiornato");
    });
  }

  function onStatus(status: CollaboratorStatus | null) {
    if (!status) return;
    start(async () => {
      const res = await setCollaboratorStatus(collaborator.id, status);
      if (res.error) toast.error(res.error);
      else toast.success("Stato aggiornato");
    });
  }

  function onTeam(teamId: string | null) {
    start(async () => {
      const res = await assignCollaboratorTeam(collaborator.id, teamId ?? "");
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
              <Select
                defaultValue={collaborator.level}
                onValueChange={onLevel}
                disabled={pending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {LEVEL_LABELS[l]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Stato</label>
              <Select
                defaultValue={collaborator.status}
                onValueChange={onStatus}
                disabled={pending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLLAB_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {COLLAB_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Squadra</label>
            <Select
              defaultValue={collaborator.team_id}
              onValueChange={onTeam}
              disabled={pending}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Nessuna squadra</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      ) : null}
    </div>
  );
}
