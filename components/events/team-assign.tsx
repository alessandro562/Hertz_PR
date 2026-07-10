"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { assignTeamToEvent, unassignTeamFromEvent } from "@/lib/events/actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selected, setSelected] = useState<string | null>(null);

  function onAssign() {
    if (!selected) return;
    start(async () => {
      const res = await assignTeamToEvent(eventId, selected);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Squadra assegnata");
        setSelected(null);
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
          <Select value={selected} onValueChange={setSelected} disabled={pending}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Scegli una squadra…" />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="secondary"
            className="h-11"
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
