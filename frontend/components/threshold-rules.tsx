"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RuleMatch, RulePreview, ThresholdRules } from "@/lib/types";

type RuleConfig = {
  field: keyof ThresholdRules;
  matchId: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
};

const ruleConfigs: RuleConfig[] = [
  {
    field: "invoice_overdue_days",
    matchId: "invoice_overdue",
    label: "Flag invoices overdue by",
    unit: "days",
    min: 1,
    max: 30,
    step: 1,
  },
  {
    field: "lead_untouched_hours",
    matchId: "lead_untouched",
    label: "Flag leads untouched for",
    unit: "hours",
    min: 12,
    max: 168,
    step: 12,
  },
  {
    field: "ticket_age_hours",
    matchId: "ticket_age",
    label: "Flag open tickets older than",
    unit: "hours",
    min: 6,
    max: 72,
    step: 6,
  },
  {
    field: "inventory_buffer_units",
    matchId: "inventory_low",
    label: "Flag stock within",
    unit: "units of reorder point",
    min: 0,
    max: 10,
    step: 1,
  },
];

export function ThresholdRulesPanel({ initialRules }: { initialRules: ThresholdRules }) {
  const [rules, setRules] = useState(initialRules);
  const [matches, setMatches] = useState<Record<string, RuleMatch>>({});
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preview = useCallback(async (next: ThresholdRules) => {
    try {
      const res = await fetch("/api/automations/preview", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Preview failed.");
      const byId: Record<string, RuleMatch> = {};
      for (const match of (payload as RulePreview).rules) byId[match.id] = match;
      setMatches(byId);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed.");
    }
  }, []);

  useEffect(() => {
    // initial preview; later adjustments re-trigger it from adjust()
    debounce.current = setTimeout(() => preview(initialRules), 0);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [preview, initialRules]);

  function adjust(field: keyof ThresholdRules, delta: number, config: RuleConfig) {
    const value = Math.min(config.max, Math.max(config.min, rules[field] + delta));
    const next = { ...rules, [field]: value };
    setRules(next);
    setSaveState("idle");
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => preview(next), 250);
  }

  async function save() {
    setSaveState("saving");
    try {
      const res = await fetch("/api/automations/rules", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(rules),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Save failed.");
      setSaveState("saved");
      setError(null);
    } catch (err) {
      setSaveState("idle");
      setError(err instanceof Error ? err.message : "Save failed.");
    }
  }

  return (
    <section aria-label="Alert thresholds" className="panel p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="eyebrow !text-fg-2">Alert thresholds</h2>
        <p className="font-mono text-[0.6875rem] text-fg-3">
          Counts preview against the seeded records
        </p>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {ruleConfigs.map((config) => {
          const match = matches[config.matchId];
          return (
            <li key={config.field} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
              <div className="flex min-w-52 flex-1 flex-wrap items-baseline gap-x-1.5">
                <span className="text-sm text-fg-2">{config.label}</span>
                <span className="font-display text-base font-semibold text-fg tabular-nums">
                  {rules[config.field]}
                </span>
                <span className="text-sm text-fg-2">{config.unit}</span>
              </div>

              <div className="flex items-center gap-1.5" role="group" aria-label={`${config.label} ${config.unit}`}>
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={() => adjust(config.field, -config.step, config)}
                  className="grid size-7 place-items-center rounded-lg border border-line text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={() => adjust(config.field, config.step, config)}
                  className="grid size-7 place-items-center rounded-lg border border-line text-fg-2 transition-colors hover:border-line-2 hover:text-fg"
                >
                  +
                </button>
              </div>

              <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto sm:min-w-44">
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.6875rem] ${
                    match && match.count > 0
                      ? "border-watch/30 bg-watch/10 text-watch"
                      : "border-line text-fg-3"
                  }`}
                >
                  {match ? `${match.count} would trigger` : "—"}
                </span>
                {match?.records.map((record) => (
                  <span key={record} className="font-mono text-[0.625rem] text-accent-2/70">
                    {record}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={save}
          disabled={saveState === "saving"}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save demo rules"}
        </button>
        <p className="font-mono text-[0.6875rem] text-fg-3">
          {saveState === "saved"
            ? "Recorded in the activity log"
            : "Saved rules are recorded in the activity log"}
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-risk/30 bg-risk/10 px-4 py-3 text-sm text-risk">
          {error}
        </p>
      )}
    </section>
  );
}
