import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Pagina non trovata</h1>
      <Link href="/dashboard" className={cn(buttonVariants(), "h-11")}>
        Torna all&apos;app
      </Link>
    </div>
  );
}
