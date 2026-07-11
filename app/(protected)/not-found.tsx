import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <Compass className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Pagina non trovata</h1>
        <p className="text-sm text-muted-foreground">
          Questa pagina non esiste, è stata rimossa, oppure non hai i permessi per
          vederla.
        </p>
      </div>
      <Link href="/dashboard" className={cn(buttonVariants(), "h-11")}>
        Torna alla dashboard
      </Link>
    </div>
  );
}
