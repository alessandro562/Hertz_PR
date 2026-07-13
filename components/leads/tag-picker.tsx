"use client";

import { useState } from "react";
import { LEAD_TAGS } from "@/lib/constants/leads";
import { cn } from "@/lib/utils";

/**
 * Multi-select chips for the fixed etichette vocabulary. Renders a hidden
 * <input name="tags"> per selected value so a plain <form> submits them
 * (read server-side with formData.getAll("tags")).
 */
export function TagPicker({
  name = "tags",
  defaultValue = [],
}: {
  name?: string;
  defaultValue?: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultValue));

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div>
      {[...selected].map((v) => (
        <input key={v} type="hidden" name={name} value={v} />
      ))}
      <div className="flex flex-wrap gap-2">
        {LEAD_TAGS.map((t) => {
          const on = selected.has(t.value);
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => toggle(t.value)}
              aria-pressed={on}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-3 text-xs transition-colors",
                on
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-input text-muted-foreground hover:bg-accent",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
