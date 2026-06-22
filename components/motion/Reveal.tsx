"use client";
// Reveal — one-shot scroll-reveal wrapper. Spec: DESIGN_SYSTEM.md §10.2 / §10.4.
// Reuses the canonical `.ll-reveal` → `.is-visible` mechanism from globals.css
// (opacity 0→1 + 16px rise, motion-safe-first; space reserved so there is no CLS).
// A light IntersectionObserver adds `.is-visible` once, then unobserves — no scroll
// listeners, no motion libs. Under prefers-reduced-motion the global backstop makes
// `.ll-reveal` visible immediately (and this still degrades gracefully without JS:
// the IO fallback below reveals everything when IntersectionObserver is absent).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cx } from "@/components/ui/cx";

export function Reveal({
  children,
  delayMs = 0,
  className,
}: {
  children: ReactNode;
  /** Stagger offset for grids/lists (ceiling ~400ms per group — §10.2). */
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cx("ll-reveal", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
