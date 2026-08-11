import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XR Signal — Spatial intelligence, distilled",
  description: "A focused intelligence feed for virtual, augmented, and mixed reality.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
