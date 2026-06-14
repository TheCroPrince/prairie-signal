import { demoJson, parseJsonBody, proxyBackendPost } from "@/lib/backend-proxy";
import { previewDemoRules } from "@/lib/demo-engine";

export async function POST(request: Request) {
  const body = await request.text();
  const proxied = await proxyBackendPost("/automations/rules/preview", body);
  if (proxied) return proxied;

  return demoJson(previewDemoRules(parseJsonBody(body)));
}
