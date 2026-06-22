"use client";
// Card — "show card" primitive. Spec: docs/core/DESIGN_SYSTEM.md §11 (show cards)
// + §9 (imagery) + §10 (hover-lift). Media on top (3:2, radius-lg, object-cover),
// Fraunces title (forest-800), meta row with small Phosphor icons, blurb, and a
// "See this show →" CTA. Equal heights: the card fills its grid cell (h-full) and
// the CTA is pushed to the bottom (mt-auto).
import Image from "next/image";
import { ArrowRight } from "phosphor-react";
import type { Icon } from "phosphor-react";
import { cx } from "./cx";

export interface CardMeta {
  /** Small Phosphor icon component (Regular). Optional. */
  icon?: Icon;
  label: string;
}

export interface CardProps {
  title: string;
  /** Destination for the card CTA. */
  href: string;
  blurb: string;
  meta?: CardMeta[];
  /** Photo src. When omitted a neutral placeholder is shown (assets are gated). */
  mediaSrc?: string;
  /** Alt text — scene + emotion (§9). Empty string only for decorative media. */
  mediaAlt?: string;
  /** CTA label; the arrow is rendered as a Phosphor icon. */
  ctaLabel?: string;
  /** Image `sizes` hint for responsive loading. */
  mediaSizes?: string;
  className?: string;
}

export function Card({
  title,
  href,
  blurb,
  meta,
  mediaSrc,
  mediaAlt = "",
  ctaLabel = "See this show",
  mediaSizes = "(min-width: 768px) 33vw, 100vw",
  className,
}: CardProps) {
  return (
    <article
      className={cx(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border-soft bg-white shadow-sm",
        "motion-safe:transition-[transform,box-shadow] motion-safe:duration-[var(--dur-fast)] motion-safe:ease-gentle-spring",
        "motion-safe:hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      {/* Media slot — fixed 3:2 so height is reserved (no CLS, §10.4). */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface">
        {mediaSrc ? (
          <Image src={mediaSrc} alt={mediaAlt} fill sizes={mediaSizes} className="object-cover" />
        ) : (
          <div
            aria-hidden
            className="flex h-full items-center justify-center font-body text-sm font-semibold uppercase tracking-[0.06em] text-ink-muted"
          >
            Photo — pending
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl text-forest-800">{title}</h3>

        {meta && meta.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
            {meta.map((m) => {
              const MetaIcon = m.icon;
              return (
                <li key={m.label} className="flex items-center gap-1.5">
                  {MetaIcon ? <MetaIcon size={16} aria-hidden className="shrink-0 text-forest-600" /> : null}
                  <span>{m.label}</span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <p className="text-ink">{blurb}</p>

        <a
          href={href}
          className="mt-auto inline-flex items-center gap-1 font-body font-bold text-forest-700 underline-offset-4 hover:underline focus-visible:underline"
        >
          {ctaLabel}
          <ArrowRight
            size={18}
            aria-hidden
            className="motion-safe:transition-transform motion-safe:duration-[var(--dur-fast)] group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </article>
  );
}
