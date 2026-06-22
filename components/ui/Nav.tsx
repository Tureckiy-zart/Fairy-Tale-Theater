"use client";
// Nav — sticky site header primitive. Spec: docs/core/DESIGN_SYSTEM.md §11 (nav)
// + §13 (a11y) + §10 (motion). Wordmark/persona slot (text placeholder — assets
// gated, §15), links with active underline, primary Book CTA, transparent → cream
// + shadow on scroll, and a mobile drawer with focus-trap, ESC, and a skip link.
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { List, X, Sparkle } from "@phosphor-icons/react";
import { Button } from "./Button";
import { cx } from "./cx";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  links: NavLink[];
  /** href of the current page/section — gets the active treatment + aria-current. */
  activeHref?: string;
  /** Primary CTA (defaults to "Book Miss Lana"). */
  cta?: { label: string; href: string };
  /** Wordmark/persona slot. Defaults to a text wordmark + placeholder light glyph. */
  wordmark?: ReactNode;
  /** Where the wordmark links — Home by default (not "#", which only scrolls to
   *  the top and leaves inner pages stranded). */
  homeHref?: string;
  /** id of the page <main> the skip link targets. */
  mainContentId?: string;
  className?: string;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

/** Placeholder wordmark — Fraunces "Miss Lana" + duotone spark (the "light"
 *  signature). NOT a final logo (trademark gate, §4.4 / §15). */
function DefaultWordmark() {
  return (
    <span className="flex items-center gap-2">
      <span data-icon="duotone-brand" className="text-forest-700">
        <Sparkle size={28} weight="duotone" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl text-forest-800" style={{ fontVariationSettings: '"SOFT" 60' }}>
          Miss Lana
        </span>
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-forest-600">
          Fairy-Tale Theater
        </span>
      </span>
    </span>
  );
}

export function Nav({
  links,
  activeHref,
  cta = { label: "Book Miss Lana", href: "#book" },
  wordmark,
  homeHref = "/",
  mainContentId = "main-content",
  className,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Scroll state via a sentinel + IntersectionObserver (no scroll listener, §10.4):
  // transparent at the top, cream + shadow once the sentinel scrolls away.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!!entry && !entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Drawer: focus-trap + ESC + scroll-lock while open; restore focus on close.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const toggle = toggleRef.current; // capture for the cleanup (stable header node)
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      drawer ? Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
    getFocusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      toggle?.focus(); // return focus to the burger
    };
  }, [open]);

  return (
    <>
      {/* Skip-to-content — first focusable element (§13). */}
      <a
        href={`#${mainContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest-600 focus:px-4 focus:py-2 focus:font-body focus:font-bold focus:text-white"
      >
        Skip to content
      </a>

      {/* In-flow sentinel sits above the sticky header so it scrolls away. */}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <header
        className={cx(
          "sticky top-0 z-40 motion-safe:transition-[background-color,box-shadow] motion-safe:duration-[var(--dur-fast)]",
          scrolled ? "bg-cream shadow-sm" : "bg-transparent",
          className,
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href={homeHref} aria-label="Miss Lana — home" className="flex items-center gap-2 rounded-sm">
            {wordmark ?? <DefaultWordmark />}
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = link.href === activeHref;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "inline-flex items-center border-b-2 px-3 py-2 font-body font-semibold",
                      "motion-safe:transition-colors motion-safe:duration-[var(--dur-fast)]",
                      active
                        ? "border-glow-400 text-forest-700"
                        : "border-transparent text-ink hover:text-forest-700",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex">
              <Button
                href={cta.href}
                size="sm"
                leadingIcon={
                  <span data-icon="duotone-brand">
                    <Sparkle size={18} weight="duotone" />
                  </span>
                }
              >
                {cta.label}
              </Button>
            </span>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest-700 md:hidden"
            >
              {open ? <X size={28} aria-hidden /> : <List size={28} aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/40" aria-hidden onClick={() => setOpen(false)} />
          <div
            ref={drawerRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col gap-2 bg-cream p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center justify-between">
              {wordmark ?? <DefaultWordmark />}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest-700"
              >
                <X size={28} aria-hidden />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {links.map((link) => {
                const active = link.href === activeHref;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cx(
                        "flex min-h-12 items-center rounded-md px-4 py-3 font-body text-lg font-semibold",
                        active ? "bg-forest-50 text-forest-700" : "text-ink hover:bg-forest-50",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4">
              <Button
                href={cta.href}
                fullWidth
                onClick={() => setOpen(false)}
                leadingIcon={
                  <span data-icon="duotone-brand">
                    <Sparkle size={20} weight="duotone" />
                  </span>
                }
              >
                {cta.label}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
