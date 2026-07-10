"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { assignTeamToEvent, unassignTeamFromEvent } from "@/lib/events/actions";
import { Button } from "@/components/ui/button";

const SELECT =
  "h-10 flex-1 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function TeamAssign({
  eventId,
  assignedTeams,
  availableTeams,
}: {
  eventId: string;
  assignedTeams: { id: string; name: string }[];
  availableTeams: { id: string; name: string }[];
}) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState("");

  function onAssign() {
    if (!selected) return;
    start(async () => {
      const res = await assignTeamToEvent(eventId, selected);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Squadra assegnata");
        setSelected("");
      }
    });
  }

  function onRemove(teamId: string) {
    start(async () => {
      const res = await unassignTeamFromEvent(eventId, teamId);
      if (res.error) toast.error(res.error);
      else toast.success("Squadra rimossa");
    });
  }

  return (
    <div className="space-y-3">
      {assignedTeams.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nessuna squadra assegnata.</p>
      ) : (
        <div className="space-y-2">
          {assignedTeams.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-md border border-input px-3 py-2 text-sm"
            >
              <span>{t.name}</span>
              <button
                type="button"
                onClick={() => onRemove(t.id)}
                disabled={pending}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Rimuovi ${t.name}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {availableTeams.length > 0 ? (
        <div className="flex gap-2">
          <select
            className={SELECT}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={pending}
          >
            <option value="">Scegli una squadra…</option>
            {availableTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="secondary"
            className="h-10"
            onClick={onAssign}
            disabled={pending || !selected}
          >
            Assegna
          </Button>
        </div>
      ) : null}
    </div>
  );
}
