"use client";
// Card — "show card" primitive. Spec: docs/core/DESIGN_SYSTEM.md §11 (show cards)
// + §9 (imagery) + §10 (hover-lift) + §12 (service-line accents). Media on top
// (3:2, radius-lg, object-cover), Fraunces title (forest-800), optional tag + meta
// row, blurb, and ONE of two calls to action:
//   • a text link  "See this show →"  (default, given an href), or
//   • a Button CTA  (pass `cta` — used for service-line / conversion cards).
// Equal heights: the card fills its grid cell (h-full); actions sit at the bottom.
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button, type ButtonVariant } from "./Button";
import { Tag } from "./Tag";
import { cx } from "./cx";
import { ACCENT_BORDER_TOP, type Accent } from "./accent";

export interface CardMeta {
  /** Small Phosphor icon component (Regular). Optional. */
  icon?: Icon;
  label: string;
}

export interface CardCta {
  label: string;
  href: string;
  /** Button variant — defaults to primary. */
  variant?: ButtonVariant;
}

export interface CardProps {
  title: string;
  blurb: string;
  /** Text-link destination ("See this show →"). Omit when using `cta`. */
  href?: string;
  /** Button CTA — rendered instead of the text link when provided. */
  cta?: CardCta;
  meta?: CardMeta[];
  /** Small label above the title (format / line). Tinted by `accent`. */
  tag?: string;
  /** Service line (§12) — adds a top accent border and tints the tag. */
  accent?: Accent;
  /** Photo src. When omitted a neutral placeholder is shown (assets are gated, §15). */
  mediaSrc?: string;
  /** Alt text — scene + emotion (§9). Empty string only for decorative media. */
  mediaAlt?: string;
  /** CTA label for the text link; the arrow is a Phosphor icon. */
  ctaLabel?: string;
  /** Image `sizes` hint for responsive loading. */
  mediaSizes?: string;
  className?: string;
}

export function Card({
  title,
  blurb,
  href,
  cta,
  meta,
  tag,
  accent,
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
        accent && ACCENT_BORDER_TOP[accent],
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
        {tag ? (
          <Tag accent={accent ?? "forest"} tone="accent" className="self-start">
            {tag}
          </Tag>
        ) : null}

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

        {/* Actions pinned to the bottom for equal-height grids. One of: Button CTA, or text link. */}
        {cta ? (
          <div className="mt-auto pt-1">
            <Button href={cta.href} variant={cta.variant ?? "primary"} size="sm">
              {cta.label}
            </Button>
          </div>
        ) : href ? (
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
        ) : null}
      </div>
    </article>
  );
}
