"use client";

import { useTransition, type ChangeEvent } from "react";
import { AtSign, MessageCircle, UserCheck, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { setLeadStatus, assignOwnerToMe } from "@/lib/leads/actions";
import { instagramUrl } from "@/lib/instagram";
import { whatsappLink, hasWhatsapp } from "@/lib/whatsapp";
import { BUILT_IN_TEMPLATES } from "@/lib/templates";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/constants/leads";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/leads/queries";
import type { LeadStatus } from "@/types/database";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function QuickActions({
  lead,
  canEdit,
  canAssign,
}: {
  lead: Lead;
  canEdit: boolean;
  canAssign: boolean;
}) {
  const [pending, start] = useTransition();
  const waText = lead.first_name ? `Ciao ${lead.first_name}!` : "Ciao!";

  function onStatus(e: ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as LeadStatus;
    start(async () => {
      const res = await setLeadStatus(lead.id, status);
      if (res.error) toast.error(res.error);
      else toast.success("Stato aggiornato");
    });
  }

  function onAssign() {
    start(async () => {
      const res = await assignOwnerToMe(lead.id);
      if (res.error) toast.error(res.error);
      else toast.success("Lead assegnato a te");
    });
  }

  async function copyTemplate(body: string) {
    try {
      await navigator.clipboard.writeText(body);
      toast.success("Template copiato");
    } catch {
      toast.error("Copia non riuscita");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={instagramUrl(lead.instagram_username)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2")}
        >
          <AtSign className="size-4" /> Instagram
        </a>
        {hasWhatsapp(lead.phone) ? (
          <a
            href={whatsappLink(lead.phone, waText)}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 gap-2")}
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        ) : (
          <Button variant="outline" className="h-11 gap-2" disabled>
            <MessageCircle className="size-4" /> WhatsApp
          </Button>
        )}
      </div>

      {canEdit ? (
        <div className="space-y-2">
          <label htmlFor="lead-status" className="text-sm text-muted-foreground">
            Stato
          </label>
          <select
            id="lead-status"
            className={SELECT}
            defaultValue={lead.status}
            onChange={onStatus}
            disabled={pending}
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {canEdit ? (
        <div className="flex flex-wrap gap-2">
          {canAssign ? (
            <Button
              variant="secondary"
              className="h-9 gap-2"
              onClick={onAssign}
              disabled={pending}
            >
              <UserCheck className="size-4" /> Assegna a me
            </Button>
          ) : null}
          <Button
            variant="secondary"
            className="h-9 gap-2"
            onClick={() =>
              toast.info("La conversione in collaboratore arriva nella Fase 4")
            }
          >
            <ArrowRightLeft className="size-4" /> Converti
          </Button>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Template (tocca per copiare)</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
          {BUILT_IN_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => copyTemplate(t.body)}
              className="shrink-0 rounded-full border border-input px-3 py-1.5 text-xs hover:bg-accent"
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
