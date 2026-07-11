"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { assignCollaboratorCapo } from "@/lib/network/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "@/lib/network/queries";

/** Compact "Abbina a…" picker for pairing an orphan PR to a Capo, inline. */
export function CapoAssign({
  collaboratorId,
  capi,
}: {
  collaboratorId: string;
  capi: Profile[];
}) {
  const [pending, start] = useTransition();

  function onCapo(capoId: string | null) {
    if (!capoId) return;
    start(async () => {
      const res = await assignCollaboratorCapo(collaboratorId, capoId);
      if (res.error) toast.error(res.error);
      else toast.success("PR abbinato");
    });
  }

  return (
    <Select onValueChange={onCapo} disabled={pending}>
      <SelectTrigger className="h-11 w-full sm:w-52">
        <SelectValue placeholder="Abbina a…" />
      </SelectTrigger>
      <SelectContent>
        {capi.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
