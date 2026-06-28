"use client";
// Breadcrumb — page trail + BreadcrumbList JSON-LD in one primitive. Spec:
// docs/core/SITE_STRUCTURE_AND_BLOCKS.md §3 (Breadcrumb: nav + schema) and
// 04_SEO.md (BreadcrumbList). Client Component (renders a Phosphor separator,
// which uses React context); it still server-renders its markup + JSON-LD on
// first load. Renders a nav>ol with the last crumb
// as the current page (aria-current, not a link) and emits the matching schema
// unless `noSchema`. Crumb shape + schema come from lib/seo (single source).
import { CaretRight } from "@phosphor-icons/react";
import { breadcrumbSchema, type Crumb } from "@/lib/seo";
import { JsonLd } from "./JsonLd";
import { cx } from "./cx";

export interface BreadcrumbProps {
  /** Ordered trail, root → current. The last item is treated as the current page. */
  items: Crumb[];
  /** Skip the JSON-LD (e.g. when the page already emits a BreadcrumbList). */
  noSchema?: boolean;
  className?: string;
}

export function Breadcrumb({ items, noSchema = false, className }: BreadcrumbProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-body text-sm">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            // Position-based key: a trail is a fixed ordered list, and hrefs may legitimately
            // repeat (e.g. demo/anchor trails), so the index is the stable, collision-free key.
            <li key={`${i}-${c.href}`} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {c.name}
                </span>
              ) : (
                <a href={c.href} className="text-forest-700 underline-offset-4 hover:underline">
                  {c.name}
                </a>
              )}
              {!last && (
                <CaretRight size={14} aria-hidden className={cx("shrink-0 text-ink-muted")} />
              )}
            </li>
          );
        })}
      </ol>
      {!noSchema && <JsonLd data={breadcrumbSchema(items)} />}
    </nav>
  );
}