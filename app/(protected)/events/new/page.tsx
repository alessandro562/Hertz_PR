import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateEventForm } from "@/components/events/create-event-form";

export const metadata: Metadata = { title: "Nuovo evento" };

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-2">
        <Link href="/events" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nuovo evento</h1>
      </div>
      <CreateEventForm />
    </div>
  );
}
