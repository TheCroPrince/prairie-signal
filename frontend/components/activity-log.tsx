import type { ActivityEvent } from "@/lib/types";

const kindColor = {
  sync: "bg-accent",
  report: "bg-accent-2",
  alert: "bg-watch",
  user: "bg-fg-3",
} as const;

export function ActivityLog({ events }: { events: ActivityEvent[] }) {
  return (
    <section aria-label="Activity log" className="panel overflow-hidden">
      <header className="border-b border-line px-4 py-3">
        <h2 className="eyebrow !text-fg-2">Activity log</h2>
      </header>
      <ul className="divide-y divide-line">
        {events.map((event) => (
          <li key={event.id} className="flex items-baseline gap-3 px-4 py-2.5">
            <span className="font-mono text-[0.6875rem] whitespace-nowrap text-fg-3">
              {event.time}
            </span>
            <span className={`size-1.5 shrink-0 self-center rounded-full ${kindColor[event.kind]}`} aria-hidden />
            <span className="text-sm text-fg-2">{event.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
