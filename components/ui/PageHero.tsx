// PageHero — the shared page-opening hero: a Container holding a Home-rooted
// Breadcrumb and an <h1> SectionHeader, in the exact shape pages used to inline.
// Source of truth for visuals: docs/core/DESIGN_SYSTEM.md (§11 SectionHeader,
// §3 breadcrumb trail). Server-safe — composes Container/Breadcrumb/SectionHeader.
// The first breadcrumb crumb (Home) is always auto-prepended, so callers pass only
// their own current-page crumb. Anything extra inside the same Container (a call
// CTA, a "Book a show" button) is passed as `children`, rendered after the header.
import type { ReactNode } from "react";
import { Container } from "./Container";
import { Breadcrumb } from "./Breadcrumb";
import { SectionHeader } from "./SectionHeader";
import { SparkStar } from "@/components/brand/Glyphs";

export interface PageHeroProps {
  /** Current page crumb; Home ({ name: "Home", href: "/" }) is auto-prepended. */
  current: { name: string; href: string };
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Lantern/spark marker. Defaults to <SparkStar size={18} />; pass null to omit. */
  marker?: ReactNode;
  /** Container className. Defaults to the standard hero spacing. */
  containerClassName?: string;
  /** Optional extra hero content, inside the same Container after the header. */
  children?: ReactNode;
}

export function PageHero({
  current,
  title,
  eyebrow,
  subtitle,
  marker,
  containerClassName,
  children,
}: PageHeroProps) {
  return (
    <Container className={containerClassName ?? "pb-10 pt-10 md:pt-14"}>
      <Breadcrumb
        items={[{ name: "Home", href: "/" }, current]}
        className="mb-6"
      />
      <SectionHeader
        as="h1"
        eyebrow={eyebrow}
        marker={marker === undefined ? <SparkStar size={18} /> : marker ?? undefined}
        title={title}
        subtitle={subtitle}
      />
      {children}
    </Container>
  );
}
