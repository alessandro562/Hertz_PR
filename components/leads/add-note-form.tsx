"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { addLeadNote, logLeadContact, type AddNoteState } from "@/lib/leads/actions";
import { Button } from "@/components/ui/button";

export function AddNoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState(addLeadNote, {} as AddNoteState);
  const [contactPending, startContact] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Nota aggiunta");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  function segnaContatto() {
    startContact(async () => {
      const res = await logLeadContact(leadId);
      if (res.error) toast.error(res.error);
      else toast.success("Contatto registrato");
    });
  }

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="lead_id" value={leadId} />
      <textarea
        name="body"
        rows={2}
        required
        placeholder="Aggiungi una nota…"
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvo…" : "Aggiungi nota"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={segnaContatto}
          disabled={contactPending}
        >
          <MessageCircle className="size-3.5" /> Segna contatto
        </Button>
      </div>
    </form>
  );
}
