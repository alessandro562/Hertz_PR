"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <TriangleAlert className="size-8 text-warning" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Qualcosa è andato storto
        </h1>
        <p className="text-sm text-muted-foreground">
          Riprova tra un attimo. Se continua, chiudi e riapri l&apos;app.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset} className="h-11">
          Riprova
        </Button>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }), "h-11")}
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
