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
 * Lantern silhouette — the brand "warm light" signature (Svitlana = "light"), a lantern
 * (NOT an idea bulb). Frame uses `currentColor` (set it via a text-* class so it reads on
 * dark bands), the window is a fixed warm glow. Decorative placeholder/DIRECTION only —
 * not the final trademark-gated illustration (§7.2 / §15).
 */
export function Lantern({
  size = 24,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
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
      {/* handle */}
      <path d="M8.6 6.6 C9 3.8, 15 3.8, 15.4 6.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* top cap */}
      <rect x="8.4" y="6.2" width="7.2" height="1.9" rx="0.95" fill="currentColor" />
      {/* body frame */}
      <rect x="7.3" y="7.8" width="9.4" height="9.8" rx="3" stroke="currentColor" strokeWidth="1.5" />
      {/* warm light window */}
      <rect x="9.6" y="9.6" width="4.8" height="6" rx="2" fill="var(--color-glow-300)" />
      {/* base */}
      <rect x="8.6" y="17.2" width="6.8" height="1.9" rx="0.95" fill="currentColor" />
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
          "radial-gradient(closest-side, color-mix(in srgb, var(--color-glow-400) 45%, transparent), color-mix(in srgb, var(--color-glow-400) 12%, transparent) 60%, transparent)",
        ...style,
      }}
    />
  );
}
