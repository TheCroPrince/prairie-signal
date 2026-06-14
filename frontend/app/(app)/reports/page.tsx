import type { Metadata } from "next";
import { ReportGenerator } from "@/components/report-generator";
import { ReportHistoryItem } from "@/components/report-card";
import { getReportHistory } from "@/lib/get-reports";

export const metadata: Metadata = {
  title: "Reports — Prairie Signal Supply Co.",
};

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { reports, live } = await getReportHistory();

  return (
    <div className="space-y-4">
      <div className="rise flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">Reports</h1>
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

      <div className="rise rise-1">
        <ReportGenerator />
      </div>

      <section aria-label="Report history" className="rise rise-2 panel overflow-hidden">
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="eyebrow !text-fg-2">Report history</h2>
          <span className="font-mono text-xs text-fg-3">{reports.length} generated</span>
        </header>
        <div className="divide-y divide-line">
          {reports.map((report) => (
            <ReportHistoryItem key={report.id} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
}
