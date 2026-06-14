import { StatusBadge } from "./status-badge";

const kpis = [
  { label: "Open orders", value: "14", color: "text-fg" },
  { label: "Delayed", value: "3", color: "text-risk" },
  { label: "At-risk rev", value: "$17.8K", color: "text-watch" },
];

const rows = [
  { level: "risk", text: "Order PS-1048 blocked by low stock — install tomorrow" },
  { level: "watch", text: "Invoice INV-3101 is 16 days overdue" },
];

// Token-driven preview card. Because every color comes from a theme token, it
// re-skins instantly when the accent or mode changes — used on the landing
// hero and the customize playground as the live "see it in your brand" sample.
export function MiniDashboard() {
  return (
    <div className="panel relative overflow-hidden p-5" aria-hidden>
      <div className="pointer-events-none absolute -top-20 right-0 h-40 w-60 rounded-full bg-accent/10 blur-3xl" />
      <div className="flex items-center justify-between">
        <StatusBadge tone="accent" pulse>
          AI Daily Brief
        </StatusBadge>
        <span className="font-mono text-[0.625rem] text-fg-3">Generated 7:38 AM</span>
      </div>
      <p className="mt-3 font-display text-sm leading-snug font-medium text-fg">
        Three items need attention before noon: a blocked priority order, a delayed dispatch
        dependency, and one high-value overdue invoice.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-line bg-panel-2/60 px-2.5 py-2">
            <p className="font-mono text-[0.5625rem] tracking-wider text-fg-3 uppercase">
              {kpi.label}
            </p>
            <p className={`mt-0.5 font-display text-base font-semibold tabular-nums ${kpi.color}`}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.text}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-panel-2/40 px-3 py-2"
          >
            <span
              className={`live-dot size-1.5 shrink-0 rounded-full ${
                row.level === "risk" ? "bg-risk text-risk" : "bg-watch text-watch"
              }`}
            />
            <span className="truncate text-xs text-fg-2">{row.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
