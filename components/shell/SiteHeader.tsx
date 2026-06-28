// SiteHeader — the global sticky header. Composes the Nav primitive (sticky,
// transparent→cream on scroll, mobile drawer with focus-trap/ESC, skip-link) with
// the real site nav + the primary "Book a show" CTA → /booking. Spec:
// SITE_STRUCTURE_AND_BLOCKS.md §3 + DESIGN_SYSTEM.md §11. Server component (renders
// the client Nav). Wordmark remains text-only until the trademark-cleared artwork.
import { Nav } from "@/components/ui";
import { BrandWordmark } from "@/components/brand/Wordmark";
import { BOOK_CTA, NAV_LINKS } from "@/lib/site";

export function SiteHeader({ activeHref }: { activeHref?: string }) {
  return (
    <Nav
      links={NAV_LINKS.map((l) => ({ label: l.label, href: l.href }))}
      activeHref={activeHref}
      cta={{ label: BOOK_CTA.label, href: BOOK_CTA.href }}
      wordmark={<BrandWordmark />}
      homeHref="/"
      mainContentId="main-content"
    />
  );
}
