"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        aria-label="Esci"
        className="gap-2 text-muted-foreground"
      >
        <LogOut className="size-4" />
        <span className="hidden sm:inline">Esci</span>
      </Button>
    </form>
  );
}
