import type { AiDailyBrief as AiDailyBriefData } from "@/lib/types";
import { StatusBadge } from "./status-badge";

function BriefSection({ label, items }: { label: string; items: string[] }) {
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

export function AiDailyBrief({ brief }: { brief: AiDailyBriefData }) {
  return (
    <section
      aria-label="AI daily brief"
      className="panel relative overflow-hidden p-6 sm:p-7"
    >
      {/* soft accent bloom anchored to the brief — the one glow on the page */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-48 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusBadge tone="accent" pulse>
            AI Daily Brief
          </StatusBadge>
          <span className="font-mono text-xs text-fg-3">Generated {brief.generatedAt}</span>
        </div>
      </div>

      <p className="mt-5 max-w-2xl font-display text-xl leading-snug font-medium text-fg sm:text-2xl">
        {brief.summary}
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-3">
        <BriefSection label="What changed" items={brief.changes} />
        <BriefSection label="Risks" items={brief.risks} />
        <BriefSection label="Next actions" items={brief.recommendedActions} />
      </div>
    </section>
  );
}
