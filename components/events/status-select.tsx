"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setEventStatus } from "@/lib/events/actions";
import { EVENT_STATUSES, EVENT_STATUS_LABELS } from "@/lib/constants/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventStatus } from "@/types/database";

export function EventStatusSelect({
  eventId,
  status,
}: {
  eventId: string;
  status: EventStatus;
}) {
  const [pending, start] = useTransition();

  function onChange(value: EventStatus | null) {
    if (!value) return;
    start(async () => {
      const res = await setEventStatus(eventId, value);
      if (res.error) toast.error(res.error);
      else toast.success("Stato aggiornato");
    });
  }

  return (
    <Select defaultValue={status} onValueChange={onChange} disabled={pending}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {EVENT_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {EVENT_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
