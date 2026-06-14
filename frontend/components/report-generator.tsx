"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReportTone, ReportType, StructuredReport } from "@/lib/types";
import { ReportCard } from "./report-card";

const reportTypes: { id: ReportType; label: string; audience: string; blurb: string }[] = [
  {
    id: "daily_owner_brief",
    label: "Daily Owner Brief",
    audience: "Owner / GM",
    blurb: "Overall status, risks, and the decisions that matter today.",
  },
  {
    id: "dispatch_risk_scan",
    label: "Dispatch Risk Scan",
    audience: "Dispatch lead",
    blurb: "Blocked jobs, at-risk appointments, and technician load.",
  },
  {
    id: "finance_follow_up",
    label: "Finance Follow-up",
    audience: "Finance / admin",
    blurb: "Overdue invoices, high-value risk, and payment notes.",
  },
  {
    id: "lead_follow_up_digest",
    label: "Lead Follow-up Digest",
    audience: "Sales / admin",
    blurb: "New leads, stale leads, and the next message to send.",
  },
];

const tones: { id: ReportTone; label: string }[] = [
  { id: "concise", label: "Concise" },
  { id: "owner_friendly", label: "Owner-friendly" },
  { id: "detailed", label: "Detailed" },
];

export function ReportGenerator() {
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType>("daily_owner_brief");
  const [tone, setTone] = useState<ReportTone>("owner_friendly");
  const [report, setReport] = useState<StructuredReport | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report_type: reportType, tone }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Report generation failed.");
      }
      setReport(payload as StructuredReport);
      // refresh the server-rendered history below
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Report generation failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <section aria-label="Generate a report" className="panel p-5">
        <p className="eyebrow mb-3">Report type</p>
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Report type">
          {reportTypes.map((type) => {
            const active = reportType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setReportType(type.id)}
                className={`rounded-xl border p-3.5 text-left transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10"
                    : "border-line hover:border-line-2 hover:bg-panel-2/60"
                }`}
              >
                <p className={`text-sm font-medium ${active ? "text-accent-2" : "text-fg"}`}>
                  {type.label}
                </p>
                <p className="mt-0.5 font-mono text-[0.625rem] tracking-wider text-fg-3 uppercase">
                  {type.audience}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-fg-2">{type.blurb}</p>
              </button>
            );
          })}
        </div>

        <p className="eyebrow mt-5 mb-3">Tone</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Report tone">
          {tones.map((option) => {
            const active = tone === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTone(option.id)}
                className={`rounded-lg border px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-accent/50 bg-accent/10 text-accent-2"
                    : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={pending}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Generating…" : "Generate report"}
          </button>
          <p className="font-mono text-[0.6875rem] text-fg-3">
            Deterministic summarizer · seeded data
          </p>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-risk/30 bg-risk/10 px-4 py-3 text-sm text-risk">
            {error}
          </p>
        )}
      </section>

      {report && (
        <div key={report.id} className="rise">
          <ReportCard report={report} />
        </div>
      )}
    </div>
  );
}
