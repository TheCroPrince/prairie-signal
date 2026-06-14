import type { StructuredReport } from "@/lib/types";
import { CopyActions } from "./copy-actions";
import { StatusBadge } from "./status-badge";

function ReportSection({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-fg-2">
            <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReportCard({ report }: { report: StructuredReport }) {
  return (
    <article className="panel relative overflow-hidden p-6">
      <div
        className="pointer-events-none absolute -top-20 left-1/3 h-40 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <header className="flex flex-wrap items-center gap-2.5">
        <h3 className="font-display text-lg font-semibold text-fg">{report.title}</h3>
        <StatusBadge tone="accent">{report.audience}</StatusBadge>
        <span className="font-mono text-xs text-fg-3">
          {report.tone.replace("_", "-")} · {report.generatedAtLabel}
        </span>
      </header>

      <p className="mt-4 max-w-2xl font-display text-lg leading-snug font-medium text-fg">
        {report.summary}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <ReportSection label="Key changes" items={report.changes} />
        <ReportSection label="Risks" items={report.risks} />
        <ReportSection label="Recommended actions" items={report.recommendedActions} />
      </div>

      <div className="mt-6 border-t border-line pt-4">
        <p className="eyebrow mb-2">Source records</p>
        <div className="flex flex-wrap gap-1.5">
          {report.sourceRecords.map((record) => (
            <span
              key={record}
              className="rounded border border-line bg-panel-2/60 px-2 py-0.5 font-mono text-[0.6875rem] text-accent-2/80"
            >
              {record}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <CopyActions report={report} />
      </div>
    </article>
  );
}

export function ReportHistoryItem({ report }: { report: StructuredReport }) {
  return (
    <details className="group border-l-2 border-l-line-2">
      <summary className="flex cursor-pointer flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-panel-2/60 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-xs whitespace-nowrap text-fg-3">
          {report.generatedAtLabel}
        </span>
        <span className="text-sm font-medium text-fg">{report.title}</span>
        <span className="font-mono text-[0.6875rem] text-fg-3">{report.tone.replace("_", "-")}</span>
        <span className="ml-auto font-mono text-[0.6875rem] text-fg-3 transition-transform group-open:rotate-90">
          ›
        </span>
      </summary>
      <div className="space-y-4 border-t border-line px-4 py-4">
        <p className="text-sm leading-relaxed text-fg-2">{report.summary}</p>
        {report.risks.length > 0 && (
          <div>
            <p className="eyebrow mb-1.5">Top risks</p>
            <ul className="space-y-1">
              {report.risks.slice(0, 2).map((risk) => (
                <li key={risk} className="flex gap-2.5 text-sm leading-relaxed text-fg-2">
                  <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-risk" aria-hidden />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
        <CopyActions report={report} />
      </div>
    </details>
  );
}
