import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared route fallback for every protected page. Rendered instantly by the
 * App Router while the server component fetches, so a tap always shows
 * something (critical on slow networks at the door).
 */
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Caricamento">
      <div className="space-y-2">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
