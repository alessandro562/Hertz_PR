import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** 44px, labelled back control — in a standalone PWA this is the only way back. */
export function BackLink({
  href,
  label = "Indietro",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "-m-2 flex size-11 shrink-0 items-center justify-center rounded-md p-2",
        "text-muted-foreground transition-colors hover:text-foreground",
      )}
    >
      <ArrowLeft className="size-5" />
    </Link>
  );
}
