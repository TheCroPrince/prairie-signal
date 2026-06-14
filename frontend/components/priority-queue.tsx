"use client";

import { useState } from "react";
import type { PriorityItem, PriorityLevel } from "@/lib/types";
import { StatusBadge, type BadgeTone } from "./status-badge";

const levelTone: Record<PriorityLevel, BadgeTone> = {
  high: "risk",
  medium: "watch",
  low: "neutral",
};

const levelBorder: Record<PriorityLevel, string> = {
  high: "border-l-risk/60",
  medium: "border-l-watch/50",
  low: "border-l-line-2",
};

function QueueItem({ item }: { item: PriorityItem }) {
  const [open, setOpen] = useState(false);

  return (
    <li className={`border-l-2 ${levelBorder[item.level]}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group w-full px-4 py-3.5 text-left transition-colors hover:bg-panel-2/60"
      >
        <div className="flex items-center justify-between gap-3">
          <StatusBadge tone={levelTone[item.level]}>{item.level}</StatusBadge>
          <span className="font-mono text-[0.6875rem] text-fg-3">Due {item.due}</span>
        </div>
        <p className="mt-2 text-sm font-medium leading-snug text-fg">{item.title}</p>
        <p className="mt-1 font-mono text-xs text-accent-2/80">{item.affectedRecord}</p>

        {open && (
          <div className="mt-3 space-y-2.5 border-t border-line pt-3">
            <div>
              <p className="eyebrow mb-1">Why it matters</p>
              <p className="text-sm leading-relaxed text-fg-2">{item.whyItMatters}</p>
            </div>
            <div>
              <p className="eyebrow mb-1">Suggested action</p>
              <p className="text-sm leading-relaxed text-fg-2">{item.recommendedAction}</p>
            </div>
            <p className="font-mono text-xs text-fg-3">Owner · {item.owner}</p>
          </div>
        )}
      </button>
    </li>
  );
}

export function PriorityQueue({ items }: { items: PriorityItem[] }) {
  return (
    <section aria-label="Priority queue" className="panel flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="eyebrow !text-fg-2">Priority queue</h2>
        <span className="font-mono text-xs text-fg-3">{items.length} items</span>
      </header>
      <ul className="divide-y divide-line overflow-y-auto">
        {items.map((item) => (
          <QueueItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
