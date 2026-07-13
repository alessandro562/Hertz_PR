"use client";

import { useState } from "react";
import { X, Send, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { whatsappLink, hasWhatsapp } from "@/lib/whatsapp";
import {
  BUILT_IN_TEMPLATES,
  fillTemplate,
  type MessageTemplate,
} from "@/lib/templates";
import { displayName } from "@/lib/format";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/leads/queries";

/**
 * Bulk WhatsApp helper. WhatsApp click-to-chat can only open one conversation
 * per tap (there is no real mass-send), so this picks ONE template, personalises
 * it per lead, and offers a tap-through list of "Invia" links — plus a
 * "Copia numeri" fallback for building a broadcast list by hand.
 */
export function BulkWhatsapp({
  leads,
  onClose,
}: {
  leads: Lead[];
  onClose: () => void;
}) {
  const [template, setTemplate] = useState<MessageTemplate | null>(
    BUILT_IN_TEMPLATES[0] ?? null,
  );

  const withPhone = leads.filter((l) => hasWhatsapp(l.phone));
  const withoutPhone = leads.length - withPhone.length;

  async function copyNumbers() {
    const numbers = withPhone.map((l) => l.phone).join(", ");
    try {
      await navigator.clipboard.writeText(numbers);
      toast.success("Numeri copiati");
    } catch {
      toast.error("Copia non riuscita");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Chiudi"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative flex max-h-[85vh] flex-col rounded-t-lg border-t border-border bg-popover shadow-[0_-2px_16px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-primary" />
            <h2 className="font-medium">WhatsApp · {leads.length}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="flex size-9 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-2 border-b border-border p-4">
          <p className="text-sm text-muted-foreground">Messaggio</p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
            {BUILT_IN_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t)}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-xs transition-colors",
                  template?.id === t.id
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-input hover:bg-accent",
                )}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              {withPhone.length} con numero
              {withoutPhone > 0 ? ` · ${withoutPhone} senza numero` : ""}
            </p>
            {withPhone.length > 0 ? (
              <Button
                variant="ghost"
                className="h-8 gap-1.5 px-2 text-xs"
                onClick={copyNumbers}
              >
                <Copy className="size-3.5" /> Copia numeri
              </Button>
            ) : null}
          </div>

          <ul className="space-y-1.5">
            {leads.map((l) => {
              const canSend = hasWhatsapp(l.phone);
              const text = template
                ? fillTemplate(template.body, l.first_name)
                : undefined;
              return (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 rounded-sm border border-border p-2.5"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {displayName(l)}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      @{l.instagram_username}
                    </div>
                  </div>
                  {canSend ? (
                    <a
                      href={whatsappLink(l.phone!, text)}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(buttonVariants(), "h-9 shrink-0 gap-1.5")}
                    >
                      <Send className="size-4" /> Invia
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      No telefono
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
