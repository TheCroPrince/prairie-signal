import type { KpiMetric } from "@/lib/types";

const statusColor = {
  good: "text-good",
  watch: "text-watch",
  risk: "text-risk",
} as const;

export function KpiCard({ metric }: { metric: KpiMetric }) {
  return (
    <div className="panel panel-hover p-4">
      <p className="eyebrow">{metric.label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">
        {metric.value}
      </p>
      {metric.delta && (
        <p className={`mt-1.5 font-mono text-xs ${statusColor[metric.status]}`}>{metric.delta}</p>
      )}
    </div>
  );
}
