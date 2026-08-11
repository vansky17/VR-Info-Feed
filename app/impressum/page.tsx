import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Impressum | XR Signal",
  description: "Legal provider information for XR Signal.",
};

export default function ImpressumPage() {
  return (
    <div className="app-shell legal-shell">
      <header className="legal-header"><Link href="/">← Zurück zu XR Signal</Link></header>
      <main className="legal-page">
        <span className="section-index">IMPRESSUM</span>
        <h1>Anbieterkennzeichnung</h1>
        <section>
          <h2>Einordnung des Angebots</h2>
          <p>XR Signal ist ein privates, nicht kommerzielles Software- und Informationsprojekt. Es werden keine kostenpflichtigen Leistungen angeboten, keine Werbung geschaltet und keine Einnahmen mit dem Angebot erzielt.</p>
          <p lang="en">XR Signal is a private, non-commercial software and information project. No paid services are offered, no advertising is displayed, and no revenue is generated through the service.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
