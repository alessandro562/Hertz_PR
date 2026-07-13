import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Presentational checkbox — the visual box + tick. It does not own state or
 * handle clicks; the parent (e.g. a selectable LeadCard row) is the tap target
 * and passes `checked`. Keeps the brand's small 4px radius and sage fill.
 */
export function Checkbox({
  checked,
  className,
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-sm border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-transparent",
        className,
      )}
    >
      {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
    </span>
  );
}
