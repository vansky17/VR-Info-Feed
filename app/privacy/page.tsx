import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy / Datenschutzerklärung | XR Signal",
  description: "How XR Signal handles technical request data and browser-local bookmarks.",
};

export default function PrivacyPage() {
  return (
    <div className="app-shell legal-shell">
      <header className="legal-header"><Link href="/">← Back to XR Signal</Link></header>
      <main className="legal-page">
        <span className="section-index">PRIVACY / DATENSCHUTZERKLÄRUNG</span>
        <h1>A small service with a small data footprint.</h1>
        <p className="legal-intro">This notice describes only the processing currently performed by XR Signal. Last updated: 11 August 2026.</p>

        <section>
          <h2>1. Controller and contact</h2>
          <p>The controller responsible for XR Signal is:</p>
          <address className="placeholder-block">Ivan Stefanov<br />Hannover 30173<br />Email: ivan.stefanov@gmx.de</address>
        </section>

        <section>
          <h2>2. Hosting and technical request data</h2>
          <p>XR Signal is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Vercel provides the hosting infrastructure and processes technical request data on behalf of the operator where it acts as a processor. Vercel states that it acts as a controller for certain service-generated data under its own Privacy Notice.</p>
          <p>When the site is requested, Vercel may process the IP address, user agent, requested URL or path, timestamp, approximate request region, request identifiers, and related firewall, cache, or function metadata. XR Signal does not add custom visitor logging.</p>
          <p>This processing is necessary to deliver, operate, protect, and diagnose the website. Its legal basis is Article 6(1)(f) GDPR: the operator&apos;s legitimate interest in providing a reliable and secure information service.</p>
          <p>Vercel&apos;s current documentation states that runtime logs on the Hobby plan are retained for one hour. Vercel may separately process data required to secure and operate its platform under its own documented terms.</p>
          <p>XR Signal&apos;s server functions are currently configured to run in Vercel&apos;s <code>iad1</code> region in the United States. Technical request data may therefore be processed in the United States.</p>
          <p>Vercel states in its Privacy Notice that it participates in the EU-U.S. Data Privacy Framework and uses standard contractual clauses or other appropriate mechanisms where required. Its published Data Processing Addendum applies to Pro and Enterprise customers.</p>
          <p>Further information is available in Vercel&apos;s <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">Privacy Notice</a>, <a href="https://vercel.com/docs/logs/runtime" target="_blank" rel="noreferrer">Runtime Logs documentation</a>, and <a href="https://vercel.com/legal/dpa" target="_blank" rel="noreferrer">Data Processing Addendum</a>.</p>
        </section>

        <section>
          <h2>3. Browser-local bookmarks and search</h2>
          <p>If a visitor bookmarks a signal, XR Signal stores only the signal&apos;s identifier in the browser&apos;s local storage under <code>xr-signal-bookmarks</code>. This information remains on the visitor&apos;s device and is not transmitted to XR Signal. It can be removed by unbookmarking signals or clearing the browser&apos;s site data.</p>
          <p>Search queries exist temporarily in browser memory while the page is open. They are not persisted and are not sent to the XR Signal server.</p>
        </section>

        <section>
          <h2>4. Analytics, cookies, and tracking</h2>
          <p>XR Signal does not currently use analytics or tracking. It does not set advertising or tracking cookies, and it does not use a consent-management platform.</p>
        </section>

        <section>
          <h2>5. News, RSS, and YouTube sources</h2>
          <p>News RSS feeds and direct YouTube channel feeds are fetched by XR Signal&apos;s server. Ordinary page loading therefore does not disclose the visitor&apos;s IP address to those publishers or to YouTube.</p>
          <p>YouTube videos are not embedded. XR Signal loads no YouTube scripts, players, or YouTube cookies. When a visitor follows a publisher, YouTube, GitHub, quiz, or other external link, the destination is an independent third-party service and processes data under its own privacy terms.</p>
        </section>

        <section>
          <h2>6. Functions that do not exist</h2>
          <p>XR Signal currently has no accounts, contact forms, newsletter, comments, user uploads, personalization profiles, production user database, advertising, third-party embeds, or AI summarization.</p>
        </section>

        <section>
          <h2>7. Your GDPR rights</h2>
          <p>Where the legal requirements are met, data subjects may request access, rectification, erasure, restriction, or portability of their personal data. They may object to processing based on legitimate interests and lodge a complaint with a competent data-protection supervisory authority.</p>
          <p>Because bookmarks and search terms are not transmitted to XR Signal, the operator cannot retrieve or identify them. Browser-local bookmarks must be managed on the visitor&apos;s device.</p>
        </section>

        <section>
          <h2>8. Privacy contact</h2>
          <p>Questions or requests concerning this notice can be sent to: <strong>ivan.stefanov@gmx.de</strong>.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
