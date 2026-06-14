export function getBackendBaseUrl(): string | null {
  return process.env.AI_BACKEND_URL?.trim() || process.env.BACKEND_URL?.trim() || null;
}

export function parseJsonBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

export async function proxyBackendPost(path: string, body: string): Promise<Response | null> {
  const base = getBackendBaseUrl();
  if (!base) return null;

  try {
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      signal: AbortSignal.timeout(5000),
    });

    const text = await response.text();
    if (response.status >= 500) return null;

    return new Response(text, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return null;
  }
}

export function demoJson(data: unknown): Response {
  return Response.json(data, {
    headers: {
      "x-demo-mode": "true",
    },
  });
}
