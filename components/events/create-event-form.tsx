"use client";

import { useActionState } from "react";
import { createEvent, type CreateEventState } from "@/lib/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateEventForm() {
  const [state, action, pending] = useActionState(createEvent, {} as CreateEventState);

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="ev_name">Nome evento</Label>
        <Input id="ev_name" name="name" required autoFocus className="h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev_date">Data</Label>
        <Input id="ev_date" name="event_date" type="date" required className="h-11" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="ev_venue">Venue</Label>
          <Input id="ev_venue" name="venue" className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ev_city">Città</Label>
          <Input id="ev_city" name="city" className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev_target">Obiettivo ingressi</Label>
        <Input
          id="ev_target"
          name="target_attendance"
          type="number"
          inputMode="numeric"
          min={0}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ev_desc">Descrizione</Label>
        <textarea
          id="ev_desc"
          name="description"
          rows={2}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Creo…" : "Crea evento"}
      </Button>
    </form>
  );
}
