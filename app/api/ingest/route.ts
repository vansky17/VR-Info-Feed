import { ingestSources } from "@/lib/ingest";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await ingestSources();
  return Response.json({ ...result, ingestedAt: new Date().toISOString(), persistence: "not-configured" });
}
