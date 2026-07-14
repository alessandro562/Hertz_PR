"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  createAnnouncement,
  type AnnouncementState,
} from "@/lib/announcements/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AnnouncementComposer() {
  const [state, action, pending] = useActionState(
    createAnnouncement,
    {} as AnnouncementState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Annuncio pubblicato");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="a_title">Titolo</Label>
        <Input
          id="a_title"
          name="title"
          required
          placeholder="Es. Venerdì Kindergarten — mandate le liste"
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="a_body">Messaggio</Label>
        <textarea
          id="a_body"
          name="body"
          rows={3}
          required
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Scrivi l'annuncio per la squadra…"
        />
      </div>
      <Button type="submit" className="h-11 gap-2" disabled={pending}>
        <Send className="size-4" /> {pending ? "Pubblico…" : "Pubblica"}
      </Button>
    </form>
  );
}
