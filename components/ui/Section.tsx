// Section — a full-width page band with vertical rhythm and optional tone, with
// its content centred in a Container. Spec: docs/core/DESIGN_SYSTEM.md §5.1
// (section-py = clamp(4rem,8vw,8rem)), §3 (cream / surface alternation). Pages
// stack Sections; the SectionHeader + blocks go inside. Server-safe.
import type { ReactNode } from "react";
import { cx } from "./cx";
import { Container } from "./Container";

export interface SectionProps {
  children: ReactNode;
  /** Anchor id (for in-page nav / skip targets). */
  id?: string;
  /** Background band: page cream (default) or the tinted alternation surface (§3). */
  tone?: "cream" | "surface";
  /** Accessible label for the <section> landmark (use when there is no visible heading). */
  ariaLabel?: string;
  /** Drop the inner Container (full-bleed content manages its own width). */
  bleed?: boolean;
  className?: string;
  /** Extra classes for the inner Container (ignored when `bleed`). */
  innerClassName?: string;
}

// section-py = clamp(4rem, 8vw, 8rem) — §5.1.
const PY = "py-[clamp(4rem,8vw,8rem)]";

export function Section({
  children,
  id,
  tone = "cream",
  ariaLabel,
  bleed = false,
  className,
  innerClassName,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cx(PY, tone === "surface" && "bg-surface", className)}
    >
      {bleed ? children : <Container className={innerClassName}>{children}</Container>}
    </section>
  );
}
