// Lightweight loading placeholder shown while a dynamic route fetches its
// server payload. Mirrors the rough shape of the page so navigation feels
// instant rather than blank.
export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-44 animate-pulse rounded bg-panel-2/70" />
      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <div className="panel h-72 animate-pulse" />
        <div className="panel h-72 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel h-20 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
