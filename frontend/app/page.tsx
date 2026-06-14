import Link from "next/link";
import { HeroBrandPicker } from "@/components/hero-brand-picker";
import { MiniDashboard } from "@/components/mini-dashboard";
import { StatusBadge } from "@/components/status-badge";

const beforeTimeline = [
  { time: "7:55 AM", step: "Maya opens the order spreadsheet." },
  { time: "8:05 AM", step: "She checks email for late deliveries." },
  { time: "8:15 AM", step: "She opens the CRM export." },
  { time: "8:25 AM", step: "She checks overdue invoices." },
  { time: "8:35 AM", step: "She writes an update for the owner." },
  { time: "9:10 AM", step: "A delayed customer order is discovered late." },
];

const afterTimeline = [
  { time: "7:55 AM", step: "Maya opens AI Workflow Dashboard." },
  { time: "7:56 AM", step: "Daily brief is already generated." },
  { time: "7:58 AM", step: "Priority queue shows delayed orders and unpaid accounts." },
  { time: "8:00 AM", step: "Owner summary is sent." },
  { time: "8:05 AM", step: "Dispatch sees blocked jobs." },
  { time: "8:10 AM", step: "Finance follows up on high-risk invoices." },
];

const features = [
  {
    title: "AI daily brief",
    body: "What changed overnight, what needs attention, and what to do next — in plain English.",
  },
  {
    title: "Priority queue",
    body: "Stalled orders, blocked jobs, and at-risk customers ranked by urgency, not by tool.",
  },
  {
    title: "Scheduled reports",
    body: "Owner briefs, dispatch scans, and invoice follow-ups generated on a schedule.",
  },
  {
    title: "Alert thresholds",
    body: "Flag overdue invoices, untouched leads, and low stock using rules the business defines.",
  },
  {
    title: "Source sync status",
    body: "One view of every feed — CRM, orders, invoices, leads, and tickets.",
  },
  {
    title: "Bounded assistant",
    body: "Ask questions about today's operations and get answers backed by source records.",
  },
];

const businessTypes = [
  "Trades & field service",
  "B2B distributors",
  "Clinics & appointments",
  "Ecommerce & retail",
  "Marketing agencies",
  "Property management",
  "Professional services",
];

export default function LandingPage() {
  return (
    <div className="atmosphere min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <p className="font-mono text-xs tracking-wider text-fg-3 uppercase">
          Armatir <span className="text-fg-2">/</span> product demo
        </p>
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-3.5 py-1.5 text-sm text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
        >
          Open demo
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="rise eyebrow !text-accent-2">AI Workflow Dashboard</p>
            <h1 className="rise rise-1 mt-4 font-display text-4xl leading-[1.05] font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Turn scattered business data into{" "}
              <span className="text-accent-2">daily clarity</span>.
            </h1>
            <p className="rise rise-2 mt-5 max-w-xl text-base leading-relaxed text-fg-2 sm:text-lg">
              Daily summaries, priority alerts, and next-step visibility — a product-style demo
              showing how small and mid-sized companies can replace manual reporting with a custom
              dashboard powered by structured data and AI-generated operational briefs.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2"
              >
                Open Demo Dashboard
              </Link>
              <Link
                href="/customize"
                className="rounded-lg border border-line px-5 py-2.5 text-sm text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
              >
                See customization options
              </Link>
            </div>
            <p className="rise rise-4 mt-6 font-mono text-[0.6875rem] text-fg-3">
              Fictional business · seeded data · no real systems connected
            </p>
          </div>
          <div className="rise rise-3 space-y-3">
            <MiniDashboard />
            <HeroBrandPicker />
          </div>
        </section>

        {/* Before / after */}
        <section className="border-t border-line py-14 sm:py-20">
          <p className="eyebrow">The morning problem</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            One operator, six systems, ninety minutes — every single morning.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="panel p-6">
              <StatusBadge tone="risk">Before</StatusBadge>
              <ul className="mt-5 space-y-3">
                {beforeTimeline.map((row) => (
                  <li key={row.time} className="flex gap-4 text-sm">
                    <span className="w-16 shrink-0 font-mono text-xs leading-5 text-fg-3">
                      {row.time}
                    </span>
                    <span className="text-fg-2">{row.step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel relative overflow-hidden p-6">
              <div
                className="pointer-events-none absolute -top-16 right-8 h-32 w-48 rounded-full bg-accent/10 blur-3xl"
                aria-hidden
              />
              <StatusBadge tone="good">After</StatusBadge>
              <ul className="mt-5 space-y-3">
                {afterTimeline.map((row) => (
                  <li key={row.time} className="flex gap-4 text-sm">
                    <span className="w-16 shrink-0 font-mono text-xs leading-5 text-accent-2/80">
                      {row.time}
                    </span>
                    <span className="text-fg-2">{row.step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What it automates */}
        <section className="border-t border-line py-14 sm:py-20">
          <p className="eyebrow">What it automates</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            The first reporting pass of the day, done before anyone logs in.
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="panel panel-hover p-5">
                <h3 className="font-display text-base font-semibold text-fg">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-2">{feature.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Business types */}
        <section className="border-t border-line py-14 sm:py-20">
          <p className="eyebrow">Built to be adapted</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Prairie Signal is fictional. The workflow problem isn&apos;t.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-2">
            Swap in your own orders, jobs, invoices, and leads — the same structure adapts to the
            tools and reporting needs of a real company.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {businessTypes.map((type) => (
              <li
                key={type}
                className="rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-fg-2"
              >
                {type}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="border-t border-line py-14 sm:py-20">
          <div className="panel relative overflow-hidden p-8 text-center sm:p-12">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />
            <h2 className="mx-auto max-w-xl font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Build a dashboard like this for your workflow
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fg-2">
              This demo uses seeded data, but the same structure can be adapted to your CRM, forms,
              payments, analytics, spreadsheets, or internal systems.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2"
              >
                Open Demo Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 sm:px-6">
          <p className="max-w-xl text-xs leading-relaxed text-fg-3">
            Demo environment using seeded operational data. Built to show how this system can
            connect to real tools such as CRM, payments, analytics, and internal databases.
          </p>
          <p className="font-mono text-[0.6875rem] text-fg-3">An Armatir product demo</p>
        </div>
      </footer>
    </div>
  );
}
