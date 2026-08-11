import { Dashboard } from "@/components/dashboard";
import { demoItems } from "@/lib/demo-data";

export default function Home() {
  return <Dashboard initialItems={demoItems} />;
}

