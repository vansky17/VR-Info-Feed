import { Dashboard } from "@/components/dashboard";
import { demoItems } from "@/lib/demo-data";
import { ingestSources } from "@/lib/ingest";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items } = await ingestSources();
  const live = items.length > 0;

  return <Dashboard initialItems={live ? items : demoItems} initialMode={live ? "live" : "demo"} />;
}
