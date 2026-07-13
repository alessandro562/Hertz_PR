"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateLead, type UpdateLeadState } from "@/lib/leads/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDateInput } from "@/lib/dates";
import { LEAD_TYPES, LEAD_TYPE_LABELS } from "@/lib/constants/leads";
import { TagPicker } from "./tag-picker";
import type { Lead } from "@/lib/leads/queries";

const AREA =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function EditLeadForm({ lead }: { lead: Lead }) {
  const [state, action, pending] = useActionState(updateLead, {} as UpdateLeadState);

  useEffect(() => {
    if (state.ok) toast.success("Lead salvato");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={lead.id} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="e_first">Nome</Label>
          <Input id="e_first" name="first_name" defaultValue={lead.first_name ?? ""} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="e_last">Cognome</Label>
          <Input id="e_last" name="last_name" defaultValue={lead.last_name ?? ""} className="h-11" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="e_phone">Telefono</Label>
        <Input id="e_phone" name="phone" type="tel" inputMode="tel" defaultValue={lead.phone ?? ""} className="h-11" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="e_city">Città</Label>
          <Input id="e_city" name="city" defaultValue={lead.city ?? ""} className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="e_source">Fonte</Label>
          <Input id="e_source" name="source" defaultValue={lead.source ?? ""} className="h-11" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="e_priority">Priorità</Label>
          <Select name="priority" defaultValue={lead.priority}>
            <SelectTrigger id="e_priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Bassa</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="e_interest">Interesse</Label>
          <Select name="interest_level" defaultValue={lead.interest_level}>
            <SelectTrigger id="e_interest" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cold">Freddo</SelectItem>
              <SelectItem value="warm">Tiepido</SelectItem>
              <SelectItem value="hot">Caldo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="e_type">Tipo</Label>
        <Select name="lead_type" defaultValue={lead.lead_type}>
          <SelectTrigger id="e_type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {LEAD_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Etichette</Label>
        <TagPicker defaultValue={lead.tags} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="e_next">Prossimo step</Label>
        <Input id="e_next" name="next_action" defaultValue={lead.next_action ?? ""} className="h-11" placeholder="Es. spiegare la bacheca" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="e_follow">Follow-up</Label>
        <Input id="e_follow" name="next_follow_up_at" type="date" defaultValue={toDateInput(lead.next_follow_up_at)} className="h-11" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="e_notes">Note</Label>
        <textarea id="e_notes" name="notes" rows={3} defaultValue={lead.notes ?? ""} className={AREA} />
      </div>

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Salvo…" : "Salva modifiche"}
      </Button>
    </form>
  );
}
