"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ROLE_LABELS } from "@/lib/constants/roles";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/pr-hub/logo";
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
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      <Logo variant="lockup" height={40} priority className="md:hidden" />
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
