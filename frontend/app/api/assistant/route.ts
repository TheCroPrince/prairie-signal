import { demoJson, parseJsonBody, proxyBackendPost } from "@/lib/backend-proxy";
import { answerDemoQuestion } from "@/lib/demo-engine";

export async function POST(request: Request) {
  const body = await request.text();
  const proxied = await proxyBackendPost("/assistant/query", body);
  if (proxied) return proxied;

  return demoJson(answerDemoQuestion(parseJsonBody(body)));
}
