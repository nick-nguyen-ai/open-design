import { Skeleton } from '@enterprise-design/primitives';

/** Suspense fallback for lazily-loaded routes. */
export function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-[72rem] px-6 py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="mb-4 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-full max-w-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  );
}
