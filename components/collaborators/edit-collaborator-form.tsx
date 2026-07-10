"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateCollaborator, type UpdateCollaboratorState } from "@/lib/network/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Collaborator } from "@/lib/network/queries";

const AREA =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EditCollaboratorForm({ collaborator }: { collaborator: Collaborator }) {
  const [state, action, pending] = useActionState(
    updateCollaborator,
    {} as UpdateCollaboratorState,
  );

  useEffect(() => {
    if (state.ok) toast.success("Salvato");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={collaborator.id} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="c_phone">Telefono</Label>
          <Input
            id="c_phone"
            name="phone"
            type="tel"
            inputMode="tel"
            defaultValue={collaborator.phone ?? ""}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c_city">Città</Label>
          <Input id="c_city" name="city" defaultValue={collaborator.city ?? ""} className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="c_notes">Note</Label>
        <textarea
          id="c_notes"
          name="notes"
          rows={2}
          defaultValue={collaborator.notes ?? ""}
          className={AREA}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="c_reliability">Note affidabilità</Label>
        <textarea
          id="c_reliability"
          name="reliability_notes"
          rows={2}
          defaultValue={collaborator.reliability_notes ?? ""}
          className={AREA}
          placeholder="Visibili solo a chi gestisce la squadra"
        />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Salvo…" : "Salva"}
      </Button>
    </form>
  );
}
