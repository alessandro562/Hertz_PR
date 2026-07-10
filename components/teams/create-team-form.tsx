"use client";

import { useActionState } from "react";
import { createTeam, type CreateState } from "@/lib/network/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "@/lib/network/queries";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CreateTeamForm({ capi }: { capi: Profile[] }) {
  const [state, action, pending] = useActionState(createTeam, {} as CreateState);

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="t_name">Nome squadra</Label>
        <Input id="t_name" name="name" required autoFocus className="h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="t_capo">Capo PR</Label>
        <select id="t_capo" name="capo_pr_user_id" required className={SELECT}>
          <option value="">Scegli…</option>
          {capi.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name}
            </option>
          ))}
        </select>
        {capi.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nessun Capo PR ancora registrato: deve prima accedere una volta all&apos;app.
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="t_desc">Descrizione</Label>
        <textarea
          id="t_desc"
          name="description"
          rows={2}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Creo…" : "Crea squadra"}
      </Button>
    </form>
  );
}
