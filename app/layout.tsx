import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

// Type system per DESIGN_SYSTEM.md §4 — self-hosted via next/font (§4.3):
// one variable woff2 per family, subset latin + latin-ext, display: swap,
// metric-override fallback (adjustFontFallback default) for CLS ≈ 0.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Public launch state: real marketing pages are indexable. /design retains its own
// noindex and robots.txt keeps /design and /api outside the public crawl surface.
export function generateMetadata(): Metadata {
  const googleSiteVerification = env.googleSiteVerification;
  return {
    metadataBase: new URL(env.baseUrl),
    title: "Miss Lana's Fairy-Tale Theatre",
    description:
      "Touring live children's fairy-tale theater serving Los Angeles, Southern California and farther California locations by request.",
    applicationName: "Miss Lana's Fairy-Tale Theatre",
    ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
