import { getReportHistory } from "@/lib/get-reports";

export async function GET() {
  const result = await getReportHistory();
  return Response.json(result);
}
