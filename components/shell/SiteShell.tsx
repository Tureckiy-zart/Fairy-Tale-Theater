// SiteShell — the global page frame every marketing route is wrapped in: sticky
// SiteHeader, the skip-link target <main>, and the SiteFooter. Spec:
// SITE_STRUCTURE_AND_BLOCKS.md §3 (globally persistent header/footer + skip-link).
// Server component. (The internal /design styleguide composes its own header and is
// deliberately NOT wrapped here.) `<main>` flex-grows so the footer sits at the
// bottom on short pages (body is a flex column — app/layout.tsx).
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({
  children,
  activeHref,
}: {
  children: ReactNode;
  /** Current nav href so the matching link gets the active treatment. */
  activeHref?: string;
}) {
  return (
    <>
      <SiteHeader activeHref={activeHref} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
