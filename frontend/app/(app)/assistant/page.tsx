import type { Metadata } from "next";
import { OperationsAssistant } from "@/components/operations-assistant";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Assistant — AI Workflow Dashboard",
};

export default function AssistantPage() {
  return (
    <div className="space-y-4">
      <div className="rise flex flex-wrap items-center gap-3">
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">
          Operations Assistant
        </h1>
        <StatusBadge tone="accent">Bounded to seeded data</StatusBadge>
      </div>

      <p className="rise rise-1 max-w-2xl text-sm leading-relaxed text-fg-2">
        A controlled business assistant, not an open chatbot — it only answers from the operational
        records on this dashboard and cites the source records behind every answer.
      </p>

      <div className="rise rise-2">
        <OperationsAssistant />
      </div>
    </div>
  );
}
