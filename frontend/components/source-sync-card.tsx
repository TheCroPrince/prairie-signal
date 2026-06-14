import type { SourceSync } from "@/lib/types";

const statusDot = {
  synced: "bg-good text-good",
  warning: "bg-watch text-watch",
  failed: "bg-risk text-risk",
} as const;

export function SourceSyncCard({ source }: { source: SourceSync }) {
  return (
    <div className="panel panel-hover flex items-center gap-3 px-4 py-3">
      <span
        className={`live-dot size-2 shrink-0 rounded-full ${statusDot[source.status]}`}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-fg">{source.name}</p>
        <p className="font-mono text-[0.6875rem] text-fg-3">
          {source.lastSync} · {source.recordsProcessed} records
        </p>
      </div>
    </div>
  );
}
