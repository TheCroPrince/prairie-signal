import { getDemoAutomations } from "./demo-engine";
import type { AutomationsPayload } from "./types";

export type AutomationsResult = {
  data: AutomationsPayload;
  live: boolean;
};

export async function getAutomations(): Promise<AutomationsResult> {
  const base = process.env.AI_BACKEND_URL?.trim();
  if (base) {
    try {
      const res = await fetch(`${base}/automations`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return { data: (await res.json()) as AutomationsPayload, live: true };
      }
    } catch {}
  }
  return { data: getDemoAutomations(), live: false };
}
