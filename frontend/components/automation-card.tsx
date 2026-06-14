import type { AutomationStatus } from "@/lib/types";
import { StatusBadge, type BadgeTone } from "./status-badge";

const statusTone: Record<AutomationStatus["status"], BadgeTone> = {
  active: "good",
  paused: "neutral",
  warning: "watch",
};

export function AutomationCard({ automation }: { automation: AutomationStatus }) {
  return (
    <div className="panel panel-hover p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-fg">{automation.name}</p>
        <StatusBadge tone={statusTone[automation.status]}>{automation.status}</StatusBadge>
      </div>
      <p className="mt-1.5 font-mono text-[0.6875rem] text-fg-3">
        {automation.schedule} · last run {automation.lastRun}
      </p>
      <p className="mt-2.5 border-t border-line pt-2.5 text-xs leading-relaxed text-fg-2">
        {automation.result}
      </p>
    </div>
  );
}
