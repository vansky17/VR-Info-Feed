import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand" href="/" aria-label="XR Signal home">
        <Image className="brand-logo" src="/logo_version1.png" alt="" width={40} height={43} />
        <span>XR<span>SIGNAL</span></span>
      </Link>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link href="/#sources">Sources</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/impressum">Impressum</Link>
      </nav>
      <p className="footer-credit">Built by Ivan Stefanov · © 2026 XR Signal</p>
    </footer>
  );
}
