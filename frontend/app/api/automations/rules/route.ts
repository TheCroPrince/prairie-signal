import { demoJson, parseJsonBody, proxyBackendPost } from "@/lib/backend-proxy";
import { saveDemoRules } from "@/lib/demo-engine";

export async function POST(request: Request) {
  const body = await request.text();
  const proxied = await proxyBackendPost("/automations/rules", body);
  if (proxied) return proxied;

  return demoJson(saveDemoRules(parseJsonBody(body)));
}
