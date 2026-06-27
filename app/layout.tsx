import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

// Type system per DESIGN_SYSTEM.md §4 — self-hosted via next/font (§4.3):
// one variable woff2 per family, subset latin + latin-ext, display: swap,
// metric-override fallback (adjustFontFallback default) for CLS ≈ 0.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"], // §4.1 — opsz (optical size) + SOFT (warmth) axes; wght is variable
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Site-wide noindex until launch (Phase 5) so placeholder content is never indexed —
// SITE_STRUCTURE_AND_BLOCKS.md §9 / task guardrail. Pages set their own title/
// description/canonical via lib/seo `buildMetadata` (also with noindex), so meta is
// launch-ready while indexing stays off. /design keeps its own noindex.
export const metadata: Metadata = {
  title: "Miss Lana's Fairy-Tale Theatre",
  description:
    "Touring children's live-costumed fairy-tale theater serving Los Angeles and beyond.",
  robots: { index: false, follow: false },
};

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
