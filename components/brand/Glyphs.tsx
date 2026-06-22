// Brand light-motif glyphs — server-safe (no hooks, no icon library) so the Hero
// (the LCP) and SectionHeader can render them without a client boundary. These are
// the signature "warm light" (Svitlana = "light"): a rounded 4-point spark + a soft
// glow orb. Token-coloured, decorative (aria-hidden by default). These are the
// PLACEHOLDER motif explicitly allowed during the build (SITE_STRUCTURE §9,
// DESIGN_SYSTEM §7.2) — NOT the final logo/character (trademark gate, §15).
import type { CSSProperties } from "react";

/** Rounded 4-point spark — the brand "light" marker. Glow-400 fill, decorative. */
export function SparkStar({
  size = 20,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const r = 12;
  const w = r * 0.34;
  const c = 12;
  const d = `M${c} ${c - r} C ${c + w} ${c - w}, ${c + w} ${c - w}, ${c + r} ${c}
             C ${c + w} ${c + w}, ${c + w} ${c + w}, ${c} ${c + r}
             C ${c - w} ${c + w}, ${c - w} ${c + w}, ${c - r} ${c}
             C ${c - w} ${c - w}, ${c - w} ${c - w}, ${c} ${c - r} Z`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
      style={style}
    >
      <path d={d} fill="var(--color-glow-400)" />
    </svg>
  );
}

/**
 * Soft warm glow orb — a static decorative halo (the "lantern light from off-frame").
 * Pure CSS radial gradient; never animated when used over the fold / on the LCP (§10.4).
 */
export function GlowOrb({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "block",
        background:
          "radial-gradient(closest-side, rgba(234,174,53,0.45), rgba(234,174,53,0.12) 60%, transparent)",
        ...style,
      }}
    />
  );
}
