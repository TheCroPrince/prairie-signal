"use client";

import { useState } from "react";

type Vertical = {
  id: string;
  label: string;
  blurb: string;
  modules: string[];
  automations: string[];
};

// Mirrors the verticals in the planning pack: each business type maps to the
// modules and automations that matter most for its workflow.
const verticals: Vertical[] = [
  {
    id: "trades",
    label: "Trades & field service",
    blurb: "Plumbing, HVAC, electrical, and maintenance teams juggling jobs, parts, and invoices.",
    modules: ["Job board", "Dispatch risk", "Technician schedule", "Parts & inventory", "Invoice follow-up"],
    automations: ["Daily owner brief", "Dispatch risk scan", "Overdue invoice warnings", "Parts restock alerts"],
  },
  {
    id: "distributor",
    label: "B2B distributor",
    blurb: "Supply and wholesale operations balancing orders, stock, and customer commitments.",
    modules: ["Order status", "Inventory risk", "Supplier delays", "Customer priority queue", "Revenue at risk"],
    automations: ["Daily owner brief", "Fulfillment risk scan", "Backorder alerts", "Weekly performance summary"],
  },
  {
    id: "clinic",
    label: "Clinics & appointments",
    blurb: "Practices managing appointments, referrals, and patient follow-ups.",
    modules: ["Appointment fill rate", "No-show tracking", "Referral follow-up", "Inquiry queue", "Daily ops summary"],
    automations: ["Daily ops summary", "No-show alerts", "Referral follow-up digest", "Inquiry response reminders"],
  },
  {
    id: "ecommerce",
    label: "Ecommerce & retail",
    blurb: "Small teams connecting orders, returns, inventory, and support in one view.",
    modules: ["Orders & returns", "Inventory", "Failed payments", "Support tickets", "Product performance"],
    automations: ["Daily revenue brief", "Failed payment follow-up", "Low-stock alerts", "Returns digest"],
  },
  {
    id: "agency",
    label: "Marketing agency",
    blurb: "Agencies preparing client reports and watching lead and campaign performance.",
    modules: ["Client reporting", "Lead performance", "Campaign anomalies", "Website analytics", "Task follow-up"],
    automations: ["Monthly client reports", "Campaign anomaly alerts", "Stale lead reminders", "Weekly status"],
  },
  {
    id: "services",
    label: "Professional services",
    blurb: "Bookkeeping, consulting, and legal admin teams tracking clients and deadlines.",
    modules: ["Client task queue", "Document status", "Deadline tracking", "Revenue pipeline", "Weekly status"],
    automations: ["Weekly status reports", "Deadline reminders", "Document chase-ups", "Pipeline digest"],
  },
];

export function CustomizeExplorer() {
  const [activeId, setActiveId] = useState(verticals[0].id);
  const active = verticals.find((v) => v.id === activeId) ?? verticals[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Business type">
        {verticals.map((vertical) => {
          const selected = vertical.id === activeId;
          return (
            <button
              key={vertical.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(vertical.id)}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                selected
                  ? "border-accent/50 bg-accent/10 text-accent-2"
                  : "border-line text-fg-2 hover:border-line-2 hover:text-fg"
              }`}
            >
              {vertical.label}
            </button>
          );
        })}
      </div>

      <div key={active.id} className="rise panel p-6">
        <p className="max-w-2xl text-sm leading-relaxed text-fg-2">{active.blurb}</p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2.5">Dashboard modules</p>
            <ul className="space-y-1.5">
              {active.modules.map((module) => (
                <li key={module} className="flex gap-2.5 text-sm text-fg-2">
                  <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {module}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-2.5">Example automations</p>
            <ul className="space-y-1.5">
              {active.automations.map((automation) => (
                <li key={automation} className="flex gap-2.5 text-sm text-fg-2">
                  <span className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-good" aria-hidden />
                  {automation}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
