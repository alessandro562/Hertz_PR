"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createGroup, type CreateState } from "@/lib/network/actions";
import { GROUP_TYPES, GROUP_TYPE_LABELS } from "@/lib/constants/collaborators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CreateGroupForm({
  teamId,
  defaultType = "pr",
}: {
  teamId?: string;
  defaultType?: "bacheca" | "pr" | "sotto_pr";
}) {
  const [state, action, pending] = useActionState(createGroup, {} as CreateState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-3">
      {teamId ? <input type="hidden" name="team_id" value={teamId} /> : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="g_name">Nome gruppo</Label>
          <Input id="g_name" name="name" required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="g_type">Tipo</Label>
          <select id="g_type" name="type" defaultValue={defaultType} className={SELECT}>
            {GROUP_TYPES.map((t) => (
              <option key={t} value={t}>
                {GROUP_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="g_link">Link invito WhatsApp</Label>
        <Input
          id="g_link"
          name="invite_link"
          type="url"
          placeholder="https://chat.whatsapp.com/…"
          className="h-11"
        />
      </div>

      <Button type="submit" variant="secondary" className="h-10" disabled={pending}>
        {pending ? "Creo…" : "Crea gruppo"}
      </Button>
    </form>
  );
}
