"use client";

import { useState, useTransition } from "react";
import {
  AtSign,
  MessageCircle,
  UserCheck,
  ArrowRightLeft,
  ChevronRight,
  Send,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { setLeadStatus, assignOwnerToMe } from "@/lib/leads/actions";
import { convertLead } from "@/lib/network/actions";
import { instagramUrl } from "@/lib/instagram";
import { whatsappLink, hasWhatsapp } from "@/lib/whatsapp";
import {
  BUILT_IN_TEMPLATES,
  fillTemplate,
  type MessageTemplate,
} from "@/lib/templates";
import {
  LEAD_STATUS_LABELS,
  nextStatus,
  statusesByBucket,
} from "@/lib/constants/leads";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/leads/queries";
import type { LeadStatus } from "@/types/database";

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
  const [selected, setSelected] = useState<MessageTemplate | null>(null);
  const [confirmingConvert, setConfirmingConvert] = useState(false);

  const isConverted =
    lead.converted_to_collaborator || lead.status === "convertito_collaboratore";
  const advance = nextStatus(lead.status);
  const groups = statusesByBucket();
  const waHi = fillTemplate("Ciao{nome}!", lead.first_name);
  const templateBody = selected ? fillTemplate(selected.body, lead.first_name) : "";

  function onStatus(status: LeadStatus | null) {
    if (!status) return;
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

  function onConvert() {
    start(async () => {
      const res = await convertLead(lead.id);
      // On success convertLead() redirects and never returns here.
      if (res?.error) toast.error(res.error);
    });
  }

  async function copyBody(body: string) {
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
            href={whatsappLink(lead.phone, waHi)}
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

      {canEdit && !isConverted && advance ? (
        <Button
          className="h-11 w-full justify-between"
          onClick={() => onStatus(advance)}
          disabled={pending}
        >
          <span>Avanza · {LEAD_STATUS_LABELS[advance]}</span>
          <ChevronRight className="size-4" />
        </Button>
      ) : null}

      {canEdit && !isConverted ? (
        <div className="space-y-2">
          <label htmlFor="lead-status" className="text-sm text-muted-foreground">
            Stato
          </label>
          <Select defaultValue={lead.status} onValueChange={onStatus} disabled={pending}>
            <SelectTrigger id="lead-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groups.map((g) => (
                <SelectGroup key={g.key}>
                  <SelectLabel>{g.label}</SelectLabel>
                  {g.statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : canEdit ? (
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">Stato</span>
          <div className="flex h-11 items-center rounded-md border border-input px-3 text-sm text-muted-foreground">
            Convertito in collaboratore
          </div>
        </div>
      ) : null}

      {canEdit ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {canAssign ? (
              <Button
                variant="secondary"
                className="h-11 gap-2"
                onClick={onAssign}
                disabled={pending}
              >
                <UserCheck className="size-4" /> Assegna a me
              </Button>
            ) : null}
            {isConverted ? (
              <a
                href={`/collaborators/${lead.converted_collaborator_id}`}
                className={cn(buttonVariants({ variant: "secondary" }), "h-11 gap-2")}
              >
                <ArrowRightLeft className="size-4" /> Vai al collaboratore
              </a>
            ) : !confirmingConvert ? (
              <Button
                variant="secondary"
                className="h-11 gap-2"
                onClick={() => setConfirmingConvert(true)}
                disabled={pending}
              >
                <ArrowRightLeft className="size-4" /> Converti in collaboratore
              </Button>
            ) : null}
          </div>
          {!isConverted && confirmingConvert ? (
            <div className="space-y-2 rounded-md border border-input p-3">
              <p className="text-sm text-muted-foreground">
                Crea un collaboratore da questo lead e lo sposta in «Convertiti».
                Puoi tornare indietro eliminando il collaboratore.
              </p>
              <div className="flex gap-2">
                <Button className="h-10 gap-2" onClick={onConvert} disabled={pending}>
                  <ArrowRightLeft className="size-4" />
                  {pending ? "Converto…" : "Converti"}
                </Button>
                <Button
                  variant="ghost"
                  className="h-10"
                  onClick={() => setConfirmingConvert(false)}
                  disabled={pending}
                >
                  Annulla
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Messaggi pronti</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {BUILT_IN_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected(t)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-xs transition-colors",
                selected?.id === t.id
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-input hover:bg-accent",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
        {selected ? (
          <div className="space-y-3 rounded-md border border-input p-3">
            <p className="text-sm whitespace-pre-wrap text-foreground">{templateBody}</p>
            <div className="flex flex-wrap gap-2">
              {hasWhatsapp(lead.phone) ? (
                <a
                  href={whatsappLink(lead.phone, templateBody)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants(), "h-10 gap-2")}
                >
                  <Send className="size-4" /> Invia su WhatsApp
                </a>
              ) : null}
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => copyBody(templateBody)}
              >
                <Copy className="size-4" /> Copia per DM
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
