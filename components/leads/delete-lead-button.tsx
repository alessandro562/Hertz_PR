"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteLead } from "@/lib/leads/actions";
import { Button } from "@/components/ui/button";

export function DeleteLeadButton({
  leadId,
  isConverted,
}: {
  leadId: string;
  isConverted: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  function onDelete() {
    start(async () => {
      const res = await deleteLead(leadId);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Lead eliminato");
      router.push("/leads");
    });
  }

  if (!confirming) {
    return (
      <Button
        variant="outline"
        className="h-10 gap-2 text-destructive hover:text-destructive"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="size-4" /> Elimina lead
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {isConverted
          ? "Verranno eliminati sia il lead sia il collaboratore collegato. L'azione è definitiva."
          : "Il lead verrà eliminato definitivamente."}
      </p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          className="h-10 gap-2"
          onClick={onDelete}
          disabled={pending}
        >
          <Trash2 className="size-4" />
          {pending ? "Elimino…" : "Elimina definitivamente"}
        </Button>
        <Button
          variant="ghost"
          className="h-10"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Annulla
        </Button>
      </div>
    </div>
  );
}
