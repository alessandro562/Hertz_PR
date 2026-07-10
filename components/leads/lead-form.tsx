"use client";

import { useActionState } from "react";
import Link from "next/link";
import { TriangleAlert, UserCheck } from "lucide-react";
import { createLead, type CreateLeadState } from "@/lib/leads/actions";
import { LEAD_STATUS_LABELS } from "@/lib/constants/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LeadStatus } from "@/types/database";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function LeadForm({ initialUsername = "" }: { initialUsername?: string }) {
  const [state, action, pending] = useActionState(createLead, {} as CreateLeadState);

  return (
    <form action={action} className="space-y-4">
      {state.duplicate ? (
        <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
          <p className="flex items-center gap-2 font-medium text-amber-700 dark:text-amber-400">
            <UserCheck className="size-4" /> Profilo già presente
          </p>
          <p className="mt-1 text-muted-foreground">
            Owner: <b>{state.duplicate.owner_name}</b>
            {state.duplicate.lead_status ? (
              <>
                {" · "}Stato:{" "}
                <b>
                  {LEAD_STATUS_LABELS[state.duplicate.lead_status as LeadStatus] ??
                    state.duplicate.lead_status}
                </b>
              </>
            ) : null}
          </p>
          <Link href="/leads" className="mt-2 inline-block text-xs underline">
            Vai alla lista lead
          </Link>
        </div>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert className="size-4 shrink-0" /> {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="instagram_username">Instagram *</Label>
        <div className="flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring">
          <span className="pl-3 text-muted-foreground">@</span>
          <Input
            id="instagram_username"
            name="instagram_username"
            defaultValue={initialUsername}
            required
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="marti.rossi"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Puoi incollare anche il link del profilo Instagram.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nome</Label>
          <Input id="first_name" name="first_name" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Cognome</Label>
          <Input id="last_name" name="last_name" className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefono</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="+39 333 1234567"
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city">Città</Label>
          <Input id="city" name="city" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Fonte</Label>
          <Input id="source" name="source" placeholder="Instagram" className="h-11" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="priority">Priorità</Label>
          <select id="priority" name="priority" defaultValue="medium" className={SELECT}>
            <option value="low">Bassa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest_level">Interesse</Label>
          <select
            id="interest_level"
            name="interest_level"
            defaultValue="warm"
            className={SELECT}
          >
            <option value="cold">Freddo</option>
            <option value="warm">Tiepido</option>
            <option value="hot">Caldo</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Note</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" className="h-11 w-full text-base" disabled={pending}>
        {pending ? "Salvo…" : "Aggiungi lead"}
      </Button>
    </form>
  );
}
