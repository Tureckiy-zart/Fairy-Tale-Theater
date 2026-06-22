"use client";

// Motion demos (§10). motion-safe-first: movement is applied only via Tailwind
// `motion-safe:` variants (= prefers-reduced-motion: no-preference). Under reduce
// everything stills (globals backstop) and the reveal falls back to visible.
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import { Section, SubHead, Note, LanternGlyph, StarGlyph } from "./primitives";

export function MotionSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Scroll-reveal: one-shot IntersectionObserver → `.is-visible`. Triggers early
  // (rootMargin) and unobserves after firing. CSS reserves space (no CLS).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".ll-reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("is-visible"));
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
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <Section
      id="motion"
      index={6}
      title="Motion"
      lead="Only transform / opacity animate; never layout, never transition-all, never the LCP element. Hover/press are instant feedback; reveals are one-shot; ambient light loops can be paused."
    >
      <div ref={rootRef}>
        <SubHead>Hover &amp; press (interactive)</SubHead>
        <div className="flex flex-wrap items-center gap-6">
          <div className="rounded-lg border border-border-soft bg-white p-5 shadow-md motion-safe:transition-[transform,box-shadow] motion-safe:duration-200 motion-safe:ease-gentle-spring hover:shadow-lg motion-safe:hover:-translate-y-1">
            <p className="text-sm font-semibold text-ink">Hover-lift card</p>
            <p className="text-sm text-ink-soft">translateY −4px + shadow md→lg</p>
          </div>

          <button
            type="button"
            className="focus-halo rounded-pill bg-forest-600 px-6 py-3 font-body font-bold text-white shadow-sm hover:bg-forest-700 hover:shadow-glow motion-safe:transition motion-safe:duration-200 motion-safe:ease-gentle-spring motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97]"
          >
            CTA hover glow · press
          </button>

          <span className="text-sm text-ink-soft">
            Hover for glow, press to feel the 0.97 scale.
          </span>
        </div>

        <SubHead>Scroll-reveal (one-shot)</SubHead>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="ll-reveal rounded-lg border border-border-soft bg-surface p-5"
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <p className="text-sm font-semibold text-ink">Reveal {i + 1}</p>
              <p className="text-sm text-ink-soft">opacity 0→1 + 16px rise, staggered 75ms</p>
            </div>
          ))}
        </div>

        <SubHead>Ambient signature (with pause)</SubHead>
        <div className={paused ? "ll-paused" : undefined}>
          <div className="relative flex items-center gap-10 overflow-hidden rounded-xl border border-border-soft bg-cream p-8">
            <div className="ll-float">
              <LanternGlyph size={72} />
            </div>
            <StarGlyph size={28} className="ll-twinkle" />
            <StarGlyph size={20} className="ll-twinkle-delay" />
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="focus-halo ml-auto inline-flex items-center gap-2 rounded-pill bg-forest-600 px-4 py-2 text-sm font-bold text-white"
            >
              {paused ? <Play size={18} weight="fill" /> : <Pause size={18} weight="fill" />}
              {paused ? "Play" : "Pause"} motion
            </button>
          </div>
        </div>
      </div>

      <Note>
        <strong>Reduced motion:</strong> with the OS &ldquo;reduce motion&rdquo; setting on, the
        lantern float, twinkle, hover-lift and scroll-reveal all stop — reveals appear instantly with
        no layout shift, and only opacity/color transitions remain. Ambient loops also offer the
        manual pause above (WCAG 2.2.2).
      </Note>
    </Section>
  );
}
