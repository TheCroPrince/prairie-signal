import type { Metadata } from "next";
import { ActivityLog } from "@/components/activity-log";
import { AiDailyBrief } from "@/components/ai-daily-brief";
import { AutomationCard } from "@/components/automation-card";
import { KpiCard } from "@/components/kpi-card";
import { PriorityQueue } from "@/components/priority-queue";
import { SourceSyncCard } from "@/components/source-sync-card";
import { getDashboardPayload } from "@/lib/get-dashboard";

export const metadata: Metadata = {
  title: "Dashboard — AI Workflow Dashboard",
};

// Always render per-request so the payload reflects the live API
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data, live } = await getDashboardPayload();

  return (
    <div className="space-y-4">
      <div className="rise flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">
          Morning operations
        </h1>
        <p className="font-mono text-xs text-fg-3">
          <span
            className={`mr-2 inline-block size-1.5 rounded-full align-middle ${
              live ? "live-dot bg-good text-good" : "bg-fg-3"
            }`}
            aria-hidden
          />
          {live ? "live api" : "seeded snapshot"} · {data.dateLabel}
        </p>
      </div>

      {/* Above the fold: brief + queue */}
      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <div className="rise rise-1 order-1">
          <AiDailyBrief brief={data.aiDailyBrief} />
        </div>
        <div className="rise rise-2 order-2">
          <PriorityQueue items={data.priorityQueue} />
        </div>
      </div>

      {/* KPI row */}
      <div className="rise rise-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {data.metrics.map((metric) => (
          <KpiCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Sources + automations */}
      <div className="rise rise-4 grid gap-4 lg:grid-cols-2">
        {/* On mobile, automations matter more than sync status, so they read first */}
        <section aria-label="Scheduled automations" className="lg:order-2">
          <h2 className="eyebrow mb-2.5">Scheduled automations</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.automations.map((automation) => (
              <AutomationCard key={automation.id} automation={automation} />
            ))}
          </div>
        </section>
        <section aria-label="Data source status" className="lg:order-1">
          <h2 className="eyebrow mb-2.5">Connected sources</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {data.sources.map((source) => (
              <SourceSyncCard key={source.id} source={source} />
            ))}
          </div>
        </section>
      </div>

      <div className="rise rise-5">
        <ActivityLog events={data.activity} />
      </div>
    </div>
  );
}
