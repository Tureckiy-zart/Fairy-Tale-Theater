// SectionHeader — eyebrow + heading + optional subtitle + optional lantern marker.
// Spec: docs/core/DESIGN_SYSTEM.md §11 (SectionHeader), §4.2 (Fraunces scale +
// clamp), §3 (eyebrow = glow-700 amber text — the only amber-text token, §3.2).
// Server-safe. The heading level is configurable so pages keep a correct outline
// (h1 on a page hero, h2 for sections) without restyling.
import type { ReactNode } from "react";
import { cx } from "./cx";
import { ACCENT_TEXT, type Accent } from "./accent";

export interface SectionHeaderProps {
  title: ReactNode;
  /** Small caps label above the title (amber glow-700, or line accent). */
  eyebrow?: string;
  subtitle?: ReactNode;
  /** Heading level for a correct document outline. Default h2. */
  as?: "h1" | "h2" | "h3";
  /** Tint the eyebrow with a service-line accent (§12). Default amber glow-700. */
  accent?: Accent;
  /** Optional lantern/spark marker element (Phosphor Duotone) — the §2 signature. */
  marker?: ReactNode;
  /** Centre the header (hero / section intro). */
  align?: "left" | "center";
  className?: string;
}

// Fraunces, weight 600, tracking −0.01em, clamp per §4.2 (h1 hero / h2 / h3).
const TITLE_SIZE: Record<NonNullable<SectionHeaderProps["as"]>, string> = {
  h1: "text-[clamp(2.5rem,5vw,3.75rem)]",
  h2: "text-[clamp(1.875rem,4vw,2.25rem)]",
  h3: "text-[clamp(1.5rem,3vw,1.875rem)]",
};

export function SectionHeader({
  title,
  eyebrow,
  subtitle,
  as = "h2",
  accent = "forest",
  marker,
  align = "left",
  className,
}: SectionHeaderProps) {
  const Heading = as;
  // forest accent keeps the canonical amber eyebrow (glow-700); other lines tint to their colour.
  const eyebrowColor = accent === "forest" ? "text-glow-700" : ACCENT_TEXT[accent];
  return (
    <header
      className={cx(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(eyebrow || marker) && (
        <p className={cx("flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em]", eyebrowColor)}>
          {marker ? <span aria-hidden className="inline-flex">{marker}</span> : null}
          {eyebrow}
        </p>
      )}
      <Heading className={cx("font-display tracking-[-0.01em] text-forest-800", TITLE_SIZE[as])}>
        {title}
      </Heading>
      {subtitle ? (
        <p className={cx("max-w-prose text-lg text-ink-soft", align === "center" && "mx-auto")}>{subtitle}</p>
      ) : null}
    </header>
  );
}
