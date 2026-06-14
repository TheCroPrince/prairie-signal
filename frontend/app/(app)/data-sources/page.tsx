import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge, type BadgeTone } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Data Sources — AI Workflow Dashboard",
};

type SyncStatus = "synced" | "warning" | "connectable";

type SourceCard = {
  category: string;
  status: SyncStatus;
  lastSync?: string;
  records?: number;
  feeds: string;
  tools: string[];
};

const statusMeta: Record<SyncStatus, { tone: BadgeTone; label: string; dot: string; pulse: boolean }> = {
  synced: { tone: "good", label: "Synced", dot: "bg-good text-good", pulse: true },
  warning: { tone: "watch", label: "Format warning", dot: "bg-watch text-watch", pulse: true },
  connectable: { tone: "neutral", label: "Connectable", dot: "bg-fg-3", pulse: false },
};

// Mock integration hub. The first five mirror the dashboard's live source feeds;
// the rest show what a real build could connect, so the demo reads as a hub
// without claiming connections that don't exist.
const sources: SourceCard[] = [
  {
    category: "CRM",
    status: "synced",
    lastSync: "7:30 AM",
    records: 42,
    feeds: "Customers, contacts, and follow-up tasks",
    tools: ["HubSpot", "Pipedrive", "Salesforce"],
  },
  {
    category: "Orders",
    status: "synced",
    lastSync: "7:32 AM",
    records: 14,
    feeds: "Open orders, status, and delivery dates",
    tools: ["Shopify", "CSV export", "Custom DB"],
  },
  {
    category: "Invoices & payments",
    status: "warning",
    lastSync: "7:35 AM",
    records: 10,
    feeds: "Receivables, payment status, and aging",
    tools: ["QuickBooks", "Stripe", "Xero"],
  },
  {
    category: "Website leads",
    status: "synced",
    lastSync: "7:37 AM",
    records: 7,
    feeds: "Inbound inquiries and form submissions",
    tools: ["Webflow forms", "Typeform", "Google Forms"],
  },
  {
    category: "Support tickets",
    status: "synced",
    lastSync: "7:38 AM",
    records: 9,
    feeds: "Open tickets, priority, and response time",
    tools: ["Zendesk", "Freshdesk", "Help Scout"],
  },
  {
    category: "Job scheduling",
    status: "connectable",
    feeds: "Dispatch jobs, technicians, and appointment status",
    tools: ["ServiceTitan", "Jobber", "Calendly"],
  },
  {
    category: "Analytics",
    status: "connectable",
    feeds: "Website traffic, conversions, and campaign changes",
    tools: ["Google Analytics", "Plausible"],
  },
  {
    category: "Spreadsheets",
    status: "connectable",
    feeds: "Inventory, custom trackers, and ad-hoc operations data",
    tools: ["Google Sheets", "Airtable", "Excel"],
  },
];

function SourceTile({ source }: { source: SourceCard }) {
  const meta = statusMeta[source.status];
  const connectable = source.status === "connectable";

  return (
    <div className={`panel panel-hover p-5 ${connectable ? "border-dashed" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={`live-dot mt-px size-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
          <h3 className="font-display text-base font-semibold text-fg">{source.category}</h3>
        </div>
        <StatusBadge tone={meta.tone} pulse={meta.pulse}>
          {meta.label}
        </StatusBadge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-fg-2">{source.feeds}</p>

      <p className="mt-3 font-mono text-[0.6875rem] text-fg-3">
        {connectable
          ? "Not connected in this demo"
          : `Last sync ${source.lastSync} · ${source.records} records`}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-line pt-3.5">
        {source.tools.map((tool) => (
          <span
            key={tool}
            className="rounded border border-line bg-panel-2/60 px-2 py-0.5 font-mono text-[0.625rem] text-fg-2"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DataSourcesPage() {
  const connected = sources.filter((s) => s.status !== "connectable").length;

  return (
    <div className="space-y-4">
      <div className="rise flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">Data sources</h1>
        <p className="font-mono text-xs text-fg-3">{connected} feeds active in the demo</p>
      </div>

      <p className="rise rise-1 max-w-2xl text-sm leading-relaxed text-fg-2">
        The dashboard is built to pull scattered operational data into one view. In this demo, five
        feeds run on seeded exports; the rest show the kind of systems a real build can connect.
      </p>

      <div className="rise rise-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <SourceTile key={source.category} source={source} />
        ))}
      </div>

      <section className="rise rise-3 panel relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute -top-20 left-1/3 h-40 w-64 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <h2 className="font-display text-lg font-semibold text-fg">
          Your business runs on different tools — that&apos;s the point
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-2">
          The dashboard normalizes each source into a shared shape, so the daily brief, priority
          queue, and reports work the same no matter which systems feed them.
        </p>
        <Link
          href="/customize"
          className="mt-4 inline-block rounded-lg border border-line px-4 py-2 text-sm text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
        >
          See what can be connected
        </Link>
      </section>
    </div>
  );
}
