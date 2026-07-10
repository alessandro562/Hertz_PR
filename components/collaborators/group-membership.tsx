"use client";

import { useTransition } from "react";
import { Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { toggleGroupMembership } from "@/lib/network/actions";
import { GROUP_TYPE_LABELS } from "@/lib/constants/collaborators";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WhatsappGroup } from "@/lib/network/queries";

export function GroupMembership({
  collaboratorId,
  groups,
  memberGroupIds,
  canEdit,
}: {
  collaboratorId: string;
  groups: WhatsappGroup[];
  memberGroupIds: string[];
  canEdit: boolean;
}) {
  const [pending, start] = useTransition();
  const memberSet = new Set(memberGroupIds);

  function toggle(groupId: string, isMember: boolean) {
    start(async () => {
      const res = await toggleGroupMembership(collaboratorId, groupId, isMember);
      if (res.error) toast.error(res.error);
      else toast.success(isMember ? "Rimosso dal gruppo" : "Aggiunto al gruppo");
    });
  }

  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessun gruppo WhatsApp creato ancora.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map((g) => {
        const isMember = memberSet.has(g.id);
        return (
          <div
            key={g.id}
            className="flex items-center justify-between gap-2 rounded-md border border-input px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{g.name}</p>
              <p className="text-xs text-muted-foreground">
                {GROUP_TYPE_LABELS[g.type]}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {isMember && g.invite_link ? (
                <a
                  href={g.invite_link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                  title="Apri link invito"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
              {canEdit ? (
                <Button
                  type="button"
                  size="sm"
                  variant={isMember ? "secondary" : "outline"}
                  className={cn("h-8 gap-1.5", isMember && "text-emerald-600 dark:text-emerald-400")}
                  onClick={() => toggle(g.id, isMember)}
                  disabled={pending}
                >
                  {isMember ? <Check className="size-3.5" /> : null}
                  {isMember ? "Dentro" : "Aggiungi"}
                </Button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
