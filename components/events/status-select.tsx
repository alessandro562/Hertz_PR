"use client";

import { useTransition, type ChangeEvent } from "react";
import { toast } from "sonner";
import { setEventStatus } from "@/lib/events/actions";
import { EVENT_STATUSES, EVENT_STATUS_LABELS } from "@/lib/constants/events";
import type { EventStatus } from "@/types/database";

const SELECT =
  "h-11 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function EventStatusSelect({
  eventId,
  status,
}: {
  eventId: string;
  status: EventStatus;
}) {
  const [pending, start] = useTransition();

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as EventStatus;
    start(async () => {
      const res = await setEventStatus(eventId, next);
      if (res.error) toast.error(res.error);
      else toast.success("Stato aggiornato");
    });
  }

  return (
    <select
      className={SELECT}
      defaultValue={status}
      onChange={onChange}
      disabled={pending}
    >
      {EVENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {EVENT_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
