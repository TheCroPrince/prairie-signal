import { getDemoReportHistory } from "./demo-engine";
import type { StructuredReport } from "./types";

export type ReportsResult = {
  reports: StructuredReport[];
  live: boolean;
};

export async function getReportHistory(): Promise<ReportsResult> {
  const base = process.env.AI_BACKEND_URL?.trim();
  if (base) {
    try {
      const res = await fetch(`${base}/reports`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return { reports: (await res.json()) as StructuredReport[], live: true };
      }
    } catch {}
  }
  return { reports: getDemoReportHistory(), live: false };
}
