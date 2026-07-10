"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [pending, start] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("La password deve avere almeno 8 caratteri.");
      return;
    }
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) toast.error("Impossibile cambiare la password.");
      else {
        toast.success("Password aggiornata");
        setPassword("");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="new_password">Nuova password</Label>
        <Input
          id="new_password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
          placeholder="min 8 caratteri"
          className="h-11"
        />
      </div>
      <Button type="submit" className="h-11" disabled={pending || password.length < 8}>
        {pending ? "Salvo…" : "Cambia password"}
      </Button>
    </form>
  );
}
