"use client";
// Accordion — FAQ disclosure list. Spec: docs/core/DESIGN_SYSTEM.md §11
// (FAQAccordion), §13 (a11y), §10.4 (CWV: no layout animation). Each row is a
// real <button> toggling an aria-controlled region; only the chevron animates
// (transform, motion-safe) — the panel shows/hides instantly so we never animate
// layout/height (§10.4). Pair the same items with seo.faqSchema() for FAQPage.
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { cx } from "./cx";

export interface AccordionItem {
  /** Question (plain text — also feeds FAQPage schema if used). */
  question: string;
  /** Answer — node for rich content; use plain text when also building schema. */
  answer: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Default: single (others close). */
  allowMultiple?: boolean;
  /** Index open on mount (single mode). */
  defaultOpen?: number;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, defaultOpen, className }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen !== undefined ? [defaultOpen] : []),
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set<number>();
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={cx("divide-y divide-border-soft border-y border-border-soft", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const btnId = `${baseId}-h-${i}`;
        const panelId = `${baseId}-p-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-12 w-full items-center justify-between gap-4 py-4 text-left font-body text-lg font-semibold text-ink hover:text-forest-700"
              >
                <span>{item.question}</span>
                <CaretDown
                  size={22}
                  aria-hidden
                  className={cx(
                    "shrink-0 text-forest-600 motion-safe:transition-transform motion-safe:duration-[var(--dur-fast)]",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-5 text-ink"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
