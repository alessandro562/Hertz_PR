"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/format";

const MAX_BYTES = 5 * 1024 * 1024;

export function AvatarUpload({
  entity,
  entityId,
  name,
  avatarUrl,
  onUploaded,
  size = "lg",
}: {
  entity: "leads" | "collaborators";
  entityId: string;
  name: string;
  avatarUrl: string | null;
  onUploaded: (url: string) => Promise<{ error?: string }>;
  size?: "default" | "sm" | "lg";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Scegli un'immagine.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Immagine troppo grande (max 5MB).");
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    start(async () => {
      const supabase = createClient();
      const path = `${entity}/${entityId}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        toast.error("Caricamento non riuscito.");
        setPreview(null);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      // Cache-bust: the object path is stable across re-uploads, so without
      // this the browser (and other users) would keep showing the old photo.
      const bustedUrl = `${data.publicUrl}?v=${Date.now()}`;

      const res = await onUploaded(bustedUrl);
      if (res.error) toast.error(res.error);
      else toast.success("Foto aggiornata");
    });
  }

  const src = preview ?? avatarUrl ?? undefined;

  return (
    <div className="relative inline-block">
      <Avatar size={size}>
        {src ? <AvatarImage src={src} alt={name} /> : null}
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground disabled:opacity-50"
        aria-label="Cambia foto"
      >
        {pending ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <Camera className="size-3" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}
