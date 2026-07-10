"use client";

import { useState, useTransition } from "react";
import { KeyRound, Power } from "lucide-react";
import { toast } from "sonner";
import { setUserActive, resetUserPassword } from "@/lib/users/actions";
import { generateTempPassword } from "@/lib/password";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/common/person-avatar";
import type { Profile } from "@/types/domain";

export function UserRow({ user, isSelf }: { user: Profile; isSelf: boolean }) {
  const [pending, start] = useTransition();
  const [active, setActive] = useState(user.is_active);

  function toggleActive() {
    const next = !active;
    start(async () => {
      const res = await setUserActive(user.id, next);
      if (res.error) toast.error(res.error);
      else {
        setActive(next);
        toast.success(next ? "Utente riattivato" : "Utente disattivato");
      }
    });
  }

  function reset() {
    const pw = generateTempPassword();
    start(async () => {
      const res = await resetUserPassword(user.id, pw);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      await navigator.clipboard.writeText(pw).catch(() => {});
      toast.success(`Nuova password (copiata): ${pw}`, { duration: 10000 });
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border p-3">
      <PersonAvatar name={user.full_name} avatarUrl={user.avatar_url} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-sm font-medium">{user.full_name}</span>
          <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
          {!active ? (
            <Badge variant="outline" className="text-muted-foreground">
              Disattivato
            </Badge>
          ) : null}
        </div>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={reset}
          disabled={pending}
          aria-label="Reset password"
          title="Reset password"
        >
          <KeyRound className="size-4" />
        </Button>
        {!isSelf ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleActive}
            disabled={pending}
            aria-label={active ? "Disattiva utente" : "Riattiva utente"}
            title={active ? "Disattiva" : "Riattiva"}
            className={active ? "" : "text-success"}
          >
            <Power className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
