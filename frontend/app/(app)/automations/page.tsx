import type { Metadata } from "next";
import { AutomationCard } from "@/components/automation-card";
import { ThresholdRulesPanel } from "@/components/threshold-rules";
import { getAutomations } from "@/lib/get-automations";

export const metadata: Metadata = {
  title: "Automations — Prairie Signal Supply Co.",
};

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const { data, live } = await getAutomations();

  return (
    <div className="space-y-4">
      <div className="rise flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">Automations</h1>
        <p className="font-mono text-xs text-fg-3">
          <span
            className={`mr-2 inline-block size-1.5 rounded-full align-middle ${
              live ? "live-dot bg-good text-good" : "bg-fg-3"
            }`}
            aria-hidden
          />
          {live ? "live api" : "seeded snapshot"}
        </p>
      </div>

      <section aria-label="Scheduled automations" className="rise rise-1">
        <h2 className="eyebrow mb-2.5">Scheduled automations</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {data.automations.map((automation) => (
            <AutomationCard key={automation.id} automation={automation} />
          ))}
        </div>
      </section>

      <div className="rise rise-2">
        <ThresholdRulesPanel initialRules={data.rules} />
      </div>

      <p className="rise rise-3 font-mono text-[0.6875rem] text-fg-3">
        Schedules run against seeded data in the demo — production builds would use a durable job
        queue with retries and alerting.
      </p>
    </div>
  );
}
