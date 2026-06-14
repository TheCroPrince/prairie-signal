import { getBackendBaseUrl } from "./backend-proxy";
import { getDemoDashboardPayload } from "./demo-engine";
import type { DashboardPayload } from "./types";

export type DashboardResult = {
  data: DashboardPayload;
  /** true when the payload came from the live API rather than the bundled snapshot */
  live: boolean;
};

// Server-side only — the backend URL never reaches the browser. When the API
// is unreachable (or AI_BACKEND_URL is unset) the dashboard degrades to the
// bundled seed snapshot so the demo never renders broken.
export async function getDashboardPayload(): Promise<DashboardResult> {
  const base = getBackendBaseUrl();
  if (base) {
    try {
      const res = await fetch(`${base}/dashboard/today`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return { data: (await res.json()) as DashboardPayload, live: true };
      }
    } catch {}
  }
  return { data: getDemoDashboardPayload(), live: false };
}
