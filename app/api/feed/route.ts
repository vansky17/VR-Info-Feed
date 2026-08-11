import { demoItems } from "@/lib/demo-data";
import { ingestSources } from "@/lib/ingest";
import type { FeedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const { items, warnings } = await ingestSources();
  const live = items.length > 0;
  const payload: FeedResponse = {
    items: live ? items : demoItems,
    generatedAt: new Date().toISOString(),
    mode: live ? "live" : "demo",
    warnings: live ? warnings : [...warnings, "Live sources are unavailable; showing the curated demonstration feed."],
  };
  return Response.json(payload, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}

