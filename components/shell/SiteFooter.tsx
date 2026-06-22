"use client";
// SiteFooter — global footer. Spec: SITE_STRUCTURE_AND_BLOCKS.md §2/§3 (click-to-call
// phones, travel areas, social placeholders [OWNER], mini-sitemap, text wordmark,
// legal). Phosphor icons (single library, §6). Social links are owner-pending, so
// they render as non-interactive placeholders (no dead "#" links). The whole site is
// noindex pre-launch — stated here too.
import { Phone, MapPin, Sparkle } from "@phosphor-icons/react";
import { Tag } from "@/components/ui";
import { AREAS, BRAND, FACTS, FOOTER_LINKS, PHONES } from "@/lib/site";

const SOCIAL_PLACEHOLDERS = ["Instagram", "Facebook", "YouTube"];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <div className="flex items-center gap-2">
              <span data-icon="duotone-brand" className="text-forest-700">
                <Sparkle size={26} weight="duotone" aria-hidden />
              </span>
              <span className="flex flex-col leading-none">
                <span
                  className="font-display text-xl text-forest-800"
                  style={{ fontVariationSettings: '"SOFT" 60' }}
                >
                  {BRAND.umbrella}
                </span>
                <span className="font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-forest-600">
                  {BRAND.descriptor}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              {/* PLACEHOLDER tagline — swap for final copy in a later phase. */}
              Professional live children&rsquo;s theater that comes to you — {FACTS.experience} of
              kind, timeless fairy tales.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              {PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="inline-flex items-center gap-2 font-body font-semibold text-forest-700 underline-offset-4 hover:underline"
                >
                  <Phone size={18} weight="duotone" aria-hidden className="text-forest-600" />
                  {p.display}
                </a>
              ))}
            </div>
          </div>

          {/* Mini-sitemap */}
          <nav aria-label="Footer">
            <h2 className="font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-ink-soft underline-offset-4 hover:text-forest-700 hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Areas + social */}
          <div>
            <h2 className="font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
              Where we go
            </h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
              <MapPin size={18} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-forest-600" />
              <span>
                Based in {AREAS.base}; we travel to {AREAS.travel.join(", ")}. We come to you — no
                public venue.
              </span>
            </p>

            <h2 className="mt-6 flex items-center gap-2 font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
              Social
              <Tag>Links pending</Tag>
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOCIAL_PLACEHOLDERS.map((s) => (
                <li
                  key={s}
                  className="cursor-default select-none rounded-pill border border-border-soft bg-white px-3 py-1 text-sm text-ink-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal / status */}
        <div className="mt-12 flex flex-col gap-2 border-t border-border-soft pt-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <Tag>Preview build</Tag>
            <span>Placeholder content &amp; imagery · not for indexing yet.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
