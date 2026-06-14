import { demoJson, parseJsonBody, proxyBackendPost } from "@/lib/backend-proxy";
import { generateDemoReport } from "@/lib/demo-engine";

export async function POST(request: Request) {
  const body = await request.text();
  const proxied = await proxyBackendPost("/reports/generate", body);
  if (proxied) return proxied;

  return demoJson(generateDemoReport(parseJsonBody(body)));
}
