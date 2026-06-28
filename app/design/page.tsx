import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/ui";
import { env } from "@/lib/env";
import {
  ColorSection,
  TypographySection,
  SystemSection,
  MotifSection,
  AccessibilitySection,
} from "./_components/static-sections";
import { IconographySection, AccentsSection } from "./_components/icon-sections";
import { MotionSection } from "./_components/motion-section";
import { ComponentsSection } from "./_components/components-section";

// ⚠️ INTERNAL design-system preview / visual QA — NOT a marketing page and NOT part
// of the public site. ENV-GUARDED: served in dev only; returns 404 in production
// (NODE_ENV==="production") so it never ships to the live site. Also noindex,nofollow.
export const metadata: Metadata = {
  title: "Design preview — Miss Lana (internal)",
  robots: { index: false, follow: false },
};

// Hard 404 in production — the preview exists in dev (and `next dev`) only.
function assertDevOnly() {
  if (env.isProduction) notFound();
}

// The header is the live Nav primitive; these are its links (anchors to sections).
const NAV_LINKS = [
  { label: "Color", href: "#color" },
  { label: "Type", href: "#typography" },
  { label: "Icons", href: "#iconography" },
  { label: "Components", href: "#components" },
  { label: "A11y", href: "#accessibility" },
];

export default function DesignPreviewPage() {
  assertDevOnly();
  return (
    <>
      {/* The real Nav primitive — sticky, scroll state, mobile drawer, skip link. */}
      <Nav
        links={NAV_LINKS}
        activeHref="#components"
        cta={{ label: "Book a show", href: "#book" }}
        mainContentId="content"
      />

      <main id="content" className="mx-auto max-w-[1280px] px-4 pb-24 md:px-8">
        <div className="border-b border-border-soft py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-glow-700">
            Lantern Light
          </p>
          <h1 className="mt-2 max-w-[20ch] font-display text-5xl text-forest-800">
            Miss Lana&rsquo;s Fairy-Tale Theater — design system
          </h1>
          <p className="mt-4 max-w-prose text-lg text-ink-soft">
            A single internal page to confirm the locked design system before the real build:
            color, type, spacing, icons, motif direction, motion, and the live component primitives.
            All values come from{" "}
            <code className="font-mono text-base text-ink">docs/core/DESIGN_SYSTEM.md</code>; the
            Components section renders the real{" "}
            <code className="font-mono text-base text-ink">components/ui/</code> primitives.
          </p>
          <p className="mt-3 max-w-prose text-sm text-ink-soft">
            Placeholders (lantern glyph, &ldquo;Miss Lana&rdquo; wordmark, show photos) are{" "}
            <strong>direction only</strong>, pending trademark-clearance — never final assets.
          </p>
        </div>

        <ColorSection />
        <TypographySection />
        <SystemSection />
        <IconographySection />
        <MotifSection />
        <MotionSection />
        <ComponentsSection />
        <AccentsSection />
        <AccessibilitySection />
      </main>

      <footer className="border-t border-border-soft px-4 py-8 text-center text-sm text-ink-soft md:px-8">
        Internal design preview · remove or env-guard before production · source of truth:
        docs/core/DESIGN_SYSTEM.md
      </footer>
    </>
  );
}
