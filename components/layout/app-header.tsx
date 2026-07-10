"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/navigation/sign-out-button";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppHeader() {
  const { profile } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <span className="font-semibold tracking-tight md:hidden">Hertz PR Hub</span>
      <span className="hidden text-sm text-muted-foreground md:inline">
        {profile.full_name}
      </span>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {ROLE_LABELS[profile.role]}
        </Badge>
        <div
          className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-hidden
        >
          {initialsOf(profile.full_name)}
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
