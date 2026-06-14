import type { Metadata } from "next";
import Link from "next/link";
import { AppearancePlayground } from "@/components/appearance-playground";
import { CustomizeExplorer } from "@/components/customize-explorer";

export const metadata: Metadata = {
  title: "Customize — Prairie Signal Supply Co.",
};

const reportStyles = [
  { audience: "Owner", style: "Short, revenue and risk focused" },
  { audience: "Manager", style: "Actionable and team-focused" },
  { audience: "Finance", style: "Invoice and payment risk focused" },
  { audience: "Dispatch", style: "Job, capacity, and schedule focused" },
  { audience: "Sales", style: "Leads, follow-up, and opportunity focused" },
  { audience: "Client-facing", style: "Polished external summary" },
];

const connectable = [
  "HubSpot",
  "Stripe",
  "QuickBooks",
  "Shopify",
  "Google Analytics",
  "Google Sheets",
  "Airtable",
  "Calendly",
  "Zendesk",
  "Internal CSV exports",
];

export default function CustomizePage() {
  return (
    <div className="space-y-10">
      <header className="rise space-y-3">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">
          Customize this for your business
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-fg-2">
          This demo uses a fictional business, but the same structure adapts to the tools,
          workflows, and reporting needs of a real company. Pick a business type to see how the
          dashboard would take shape.
        </p>
      </header>

      <section className="rise rise-1">
        <p className="eyebrow mb-3">Make it yours — try it live</p>
        <AppearancePlayground />
      </section>

      <section className="rise rise-2">
        <p className="eyebrow mb-3">Choose your business type</p>
        <CustomizeExplorer />
      </section>

      <section className="rise rise-2">
        <p className="eyebrow mb-3">Reports tuned to the audience</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reportStyles.map((report) => (
            <div key={report.audience} className="panel panel-hover p-4">
              <p className="text-sm font-medium text-fg">{report.audience}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-2">{report.style}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rise rise-3">
        <p className="eyebrow mb-3">What can be connected</p>
        <p className="max-w-2xl text-sm leading-relaxed text-fg-2">
          Custom builds connect to the systems a business already uses. Common starting points:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {connectable.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-line bg-panel px-3.5 py-1.5 text-sm text-fg-2"
            >
              {tool}
            </li>
          ))}
        </ul>
      </section>

      <section className="rise rise-4 panel relative overflow-hidden p-8 text-center sm:p-12">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold tracking-tight text-fg">
          Build a dashboard like this for your workflow
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg-2">
          Every business has different tools, data quality, and reporting needs, so custom builds
          are scoped and quoted after a short discovery conversation.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="https://armatir.com/contact"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2"
          >
            Request a custom build
          </a>
          <Link
            href="/dashboard"
            className="rounded-lg border border-line px-5 py-2.5 text-sm text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
          >
            Back to the dashboard
          </Link>
        </div>
        <p className="mt-6 font-mono text-[0.6875rem] text-fg-3">
          Seeded demo · no real customer systems are connected
        </p>
      </section>
    </div>
  );
}
