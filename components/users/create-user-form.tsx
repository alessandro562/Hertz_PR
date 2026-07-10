"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Copy, RefreshCw, UserPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createUser, type CreateUserState } from "@/lib/users/actions";
import { generateTempPassword } from "@/lib/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = [
  { value: "capo_pr", label: "Capo PR" },
  { value: "manager", label: "Manager" },
] as const;

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUser, {} as CreateUserState);
  const [role, setRole] = useState<"capo_pr" | "manager">("capo_pr");
  const formRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.created) {
      toast.success(`Utente creato: ${state.created.full_name}`);
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiato");
    } catch {
      toast.error("Copia non riuscita");
    }
  }

  return (
    <div className="space-y-4">
      {state.created ? (
        <div className="rounded-md border border-success/40 bg-success/10 p-3 text-sm">
          <p className="flex items-center gap-2 font-medium text-success">
            <CheckCircle2 className="size-4" /> Account creato — comunica queste credenziali
          </p>
          <div className="mt-2 space-y-0.5 font-mono text-xs break-all">
            <p>Email: {state.created.email}</p>
            <p>Password: {state.created.password}</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2 gap-1.5"
            onClick={() =>
              copy(`Email: ${state.created!.email}\nPassword: ${state.created!.password}`)
            }
          >
            <Copy className="size-3.5" /> Copia credenziali
          </Button>
        </div>
      ) : null}

      <form ref={formRef} action={action} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="u_name">Nome</Label>
          <Input id="u_name" name="full_name" required autoComplete="off" className="h-11" />
        </div>

        <div className="space-y-2">
          <Label>Ruolo</Label>
          <input type="hidden" name="role" value={role} />
          <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((opt) => {
              const active = role === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  aria-pressed={active}
                  className={cn(
                    "h-11 rounded-md border text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-muted-foreground hover:bg-accent",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="u_email">Email</Label>
          <Input
            id="u_email"
            name="email"
            type="email"
            required
            autoComplete="off"
            autoCapitalize="none"
            placeholder="nome@esempio.com"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="u_password">Password temporanea</Label>
          <div className="flex gap-2">
            <Input
              ref={passwordRef}
              id="u_password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="min 8 caratteri"
              className="h-11"
            />
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 gap-1.5"
              onClick={() => {
                if (passwordRef.current) passwordRef.current.value = generateTempPassword();
              }}
            >
              <RefreshCw className="size-4" /> Genera
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            La comunichi tu alla persona; potrà cambiarla dalle Impostazioni.
          </p>
        </div>

        <Button type="submit" className="h-11 w-full gap-2" disabled={pending}>
          <UserPlus className="size-4" /> {pending ? "Creo…" : "Crea utente"}
        </Button>
      </form>
    </div>
  );
}
