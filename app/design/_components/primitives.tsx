// Shared, presentation-only primitives for the /design styleguide.
// Server-safe (no hooks, no icon library) so they can be imported from both
// server and client section components.
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ layout -- */

export function Section({
  id,
  index,
  title,
  lead,
  children,
}: {
  id: string;
  index: number;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-28 border-t border-border-soft py-12 md:py-16"
    >
      <header className="mb-8 max-w-prose">
        <p className="text-xs font-semibold uppercase tracking-[0.06em] text-glow-700">
          {String(index).padStart(2, "0")} — section
        </p>
        <h2
          id={`${id}-heading`}
          className="mt-1 font-display text-4xl text-forest-800"
        >
          {title}
        </h2>
        {lead ? <p className="mt-3 text-lg text-ink-soft">{lead}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function SubHead({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-10 font-display text-2xl text-forest-700 first:mt-0">
      {children}
    </h3>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 max-w-prose rounded-md border border-border-soft bg-surface px-4 py-3 text-sm text-ink-soft">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------- color -- */

type OnColor = "ink" | "white" | "none";

/** A documented color chip showing the raw hex (inline style = exact value) plus
 *  an on-color text demo following the §3.2 rules passed by the caller. */
export function Swatch({
  name,
  hex,
  on = "none",
  caption,
}: {
  name: string;
  hex: string;
  on?: OnColor;
  caption?: string;
}) {
  const onStyle =
    on === "ink" ? { color: "#2a2520" } : on === "white" ? { color: "#ffffff" } : undefined;
  return (
    <figure className="overflow-hidden rounded-lg border border-border-soft bg-white shadow-xs">
      <div
        className="flex h-20 items-end p-2"
        style={{ backgroundColor: hex }}
      >
        {on !== "none" ? (
          <span className="text-sm font-semibold" style={onStyle}>
            Aa text
          </span>
        ) : null}
      </div>
      <figcaption className="px-3 py-2">
        <code className="block font-mono text-xs text-ink">{name}</code>
        <span className="block font-mono text-xs uppercase text-ink-soft">{hex}</span>
        {caption ? <span className="mt-1 block text-xs text-ink-soft">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export function SwatchGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">{children}</div>
  );
}

/* ------------------------------------------------------- motif placeholders -- */

/** Direction-only lantern + 4-point spark. NOT a final asset (trademark gate,
 *  §15). Body = forest, light = glow. Decorative by default (aria-hidden). */
export function LanternGlyph({
  size = 64,
  className,
  decorative = true,
}: {
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Lantern motif — direction, pending trademark"}
    >
      {/* warm glow halo */}
      <circle cx="32" cy="36" r="22" fill="var(--color-glow-400)" opacity="0.18" />
      {/* handle */}
      <path
        d="M26 14c0-4 12-4 12 0"
        stroke="var(--color-forest-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* lantern body */}
      <rect
        x="22"
        y="20"
        width="20"
        height="26"
        rx="6"
        fill="var(--color-forest-600)"
      />
      {/* warm light window */}
      <rect x="27" y="26" width="10" height="14" rx="3" fill="var(--color-glow-300)" />
      {/* base + top cap */}
      <rect x="24" y="44" width="16" height="4" rx="2" fill="var(--color-forest-800)" />
      <rect x="27" y="17" width="10" height="4" rx="2" fill="var(--color-forest-800)" />
      {/* 4-point spark */}
      <FourPointStar x={46} y={18} r={7} />
    </svg>
  );
}

export function FourPointStar({
  x = 12,
  y = 12,
  r = 8,
  className,
}: {
  x?: number;
  y?: number;
  r?: number;
  className?: string;
}) {
  const w = r * 0.34;
  const d = `M${x} ${y - r} C ${x + w} ${y - w}, ${x + w} ${y - w}, ${x + r} ${y}
             C ${x + w} ${y + w}, ${x + w} ${y + w}, ${x} ${y + r}
             C ${x - w} ${y + w}, ${x - w} ${y + w}, ${x - r} ${y}
             C ${x - w} ${y - w}, ${x - w} ${y - w}, ${x} ${y - r} Z`;
  return <path d={d} fill="var(--color-glow-400)" className={className} />;
}

/** Standalone star, sized for inline use. */
export function StarGlyph({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <FourPointStar x={12} y={12} r={11} />
    </svg>
  );
}
