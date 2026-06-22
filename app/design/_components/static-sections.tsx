// Static (server-rendered) styleguide sections — no hooks, no icon library.
// All values verbatim from docs/core/DESIGN_SYSTEM.md.
import {
  Section,
  SubHead,
  Note,
  Swatch,
  SwatchGrid,
  LanternGlyph,
  StarGlyph,
} from "./primitives";

/* =========================================================== 1 · COLOR ===== */

const FOREST: [string, string][] = [
  ["forest-50", "#F2F7EE"],
  ["forest-100", "#E1EDD6"],
  ["forest-200", "#C4DCB0"],
  ["forest-300", "#9EC585"],
  ["forest-400", "#76A858"],
  ["forest-500", "#588A3D"],
  ["forest-600", "#41702C"],
  ["forest-700", "#335A23"],
  ["forest-800", "#29481D"],
  ["forest-900", "#1E3416"],
];

const GLOW: [string, string][] = [
  ["glow-50", "#FEF7E6"],
  ["glow-100", "#FBEBBF"],
  ["glow-200", "#F7D886"],
  ["glow-300", "#F1C455"],
  ["glow-400", "#EAAE35"],
  ["glow-500", "#D4942A"],
  ["glow-600", "#B17719"],
  ["glow-700", "#8C5D14"],
];

// text-on-cream samples — actual usage (§3.3)
const TEXT_ON_CREAM: { name: string; hex: string; sample: string; large?: boolean }[] = [
  { name: "ink", hex: "#2A2520", sample: "Primary body text — cocoa ink (14.2:1)" },
  { name: "ink-soft", hex: "#685F54", sample: "Secondary text (5.86:1)" },
  { name: "ink-muted", hex: "#8A8074", sample: "Meta / large only (3.63:1)", large: true },
  { name: "forest-700", hex: "#335A23", sample: "Headings & links (7.48:1)" },
  { name: "forest-600", hex: "#41702C", sample: "Link / text (5.49:1)" },
  { name: "glow-700", hex: "#8C5D14", sample: "Amber text — links/labels only (5.32:1)" },
  { name: "success-text", hex: "#256628", sample: "Success text (6.53:1)" },
  { name: "error-text", hex: "#A8301F", sample: "Error text (6.32:1)" },
];

type Pair = { text: string; bg: string; label: string; ratio: string; min: string; ok: boolean };
const PAIRS: Pair[] = [
  { text: "#2A2520", bg: "#FBF7EF", label: "ink → cream", ratio: "14.20", min: "4.5", ok: true },
  { text: "#685F54", bg: "#FBF7EF", label: "ink-soft → cream", ratio: "5.86", min: "4.5", ok: true },
  { text: "#335A23", bg: "#FBF7EF", label: "forest-700 → cream", ratio: "7.48", min: "4.5", ok: true },
  { text: "#FFFFFF", bg: "#41702C", label: "white → forest-600 (primary)", ratio: "5.87", min: "4.5", ok: true },
  { text: "#8C5D14", bg: "#FBF7EF", label: "glow-700 → cream", ratio: "5.32", min: "4.5", ok: true },
  { text: "#2A2520", bg: "#EAAE35", label: "ink → glow-400", ratio: "7.66", min: "4.5", ok: true },
  { text: "#FFFFFF", bg: "#C0392B", label: "white → error", ratio: "5.44", min: "4.5", ok: true },
  { text: "#FFFFFF", bg: "#2E7D32", label: "white → success", ratio: "5.13", min: "4.5", ok: true },
  { text: "#B17719", bg: "#FBF7EF", label: "glow-600 → cream as body", ratio: "3.56", min: "4.5", ok: false },
  { text: "#FFFFFF", bg: "#EAAE35", label: "white → glow-400 (never)", ratio: "1.98", min: "4.5", ok: false },
  { text: "#2A2520", bg: "#2E7D32", label: "ink → success (use white)", ratio: "2.96", min: "4.5", ok: false },
];

function ContrastPair({ p }: { p: Pair }) {
  return (
    <div className="overflow-hidden rounded-md border border-border-soft">
      <div className="px-4 py-5" style={{ backgroundColor: p.bg }}>
        <span className="text-base font-semibold" style={{ color: p.text }}>
          Aa — body text 16px
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 bg-white px-3 py-2">
        <div>
          <code className="block font-mono text-xs text-ink">{p.label}</code>
          <span className="font-mono text-xs text-ink-soft">
            {p.ratio}:1 · needs {p.min}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-pill px-2 py-0.5 text-xs font-semibold ${
            p.ok ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
          }`}
        >
          {p.ok ? "✓ safe" : "✗ forbidden"}
        </span>
      </div>
    </div>
  );
}

export function ColorSection() {
  return (
    <Section
      id="color"
      index={1}
      title="Color"
      lead="Forest (primary) · Glow (accent / light) · warm neutrals · semantic. Light theme. Hex values are documented raw; component instances exercise the Tailwind tokens."
    >
      <SubHead>Forest — primary</SubHead>
      <SwatchGrid>
        {FOREST.map(([name, hex], i) => (
          <Swatch key={name} name={name} hex={hex} on={i <= 2 ? "ink" : i >= 6 ? "white" : "none"} />
        ))}
      </SwatchGrid>

      <SubHead>Glow — accent (golden / amber = light)</SubHead>
      <SwatchGrid>
        {GLOW.map(([name, hex], i) => (
          <Swatch key={name} name={name} hex={hex} on={i <= 3 ? "ink" : "none"} />
        ))}
      </SwatchGrid>
      <Note>
        White text is <strong>never</strong> placed on gold (glow-*) — only dark ink. glow-400…600
        are fills/icons/large; amber <em>text</em> only at glow-700 (§3.2).
      </Note>

      <SubHead>Warm neutrals</SubHead>
      <SwatchGrid>
        <Swatch name="cream (page)" hex="#FBF7EF" on="ink" />
        <Swatch name="surface" hex="#F5EEE0" on="ink" />
        <Swatch name="white (cards)" hex="#FFFFFF" on="ink" />
        <Swatch name="border-soft" hex="#E8DEC9" caption="decorative dividers only" />
        <Swatch name="border-strong" hex="#9A8767" caption="field / meaningful borders ≥3:1" />
      </SwatchGrid>

      <SubHead>Semantic (forms)</SubHead>
      <SwatchGrid>
        <Swatch name="success" hex="#2E7D32" on="white" />
        <Swatch name="success-bg" hex="#E6F2E1" on="ink" />
        <Swatch name="warning" hex="#B17719" caption="icon / large ≥3" />
        <Swatch name="warning-bg" hex="#FBEBBF" on="ink" />
        <Swatch name="error" hex="#C0392B" on="white" />
        <Swatch name="error-bg" hex="#FBE4E0" on="ink" />
        <Swatch name="info" hex="#2F6F92" on="white" />
        <Swatch name="info-bg" hex="#E2EDF3" on="ink" />
      </SwatchGrid>

      <SubHead>Text colors on cream (actual usage)</SubHead>
      <div className="space-y-2 rounded-lg border border-border-soft bg-cream p-5">
        {TEXT_ON_CREAM.map((t) => (
          <p
            key={t.name}
            className={t.large ? "text-2xl" : "text-base"}
            style={{ color: t.hex }}
          >
            <code className="mr-2 font-mono text-xs text-ink-soft">{t.name}</code>
            {t.sample}
          </p>
        ))}
      </div>

      <SubHead>Contrast reference (§3.3) — safe vs forbidden</SubHead>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAIRS.map((p) => (
          <ContrastPair key={p.label} p={p} />
        ))}
      </div>
    </Section>
  );
}

/* ====================================================== 2 · TYPOGRAPHY ===== */

const SCALE: { token: string; px: number; lh: number; weight: number; role: string; display?: boolean }[] = [
  { token: "text-6xl", px: 60, lh: 1.05, weight: 600, role: "hero (Fraunces, opsz↑)", display: true },
  { token: "text-5xl", px: 48, lh: 1.1, weight: 600, role: "h1 (Fraunces)", display: true },
  { token: "text-4xl", px: 36, lh: 1.2, weight: 600, role: "h2 (Fraunces)", display: true },
  { token: "text-3xl", px: 30, lh: 1.3, weight: 600, role: "h3 (Fraunces)", display: true },
  { token: "text-2xl", px: 24, lh: 1.35, weight: 600, role: "h4", display: true },
  { token: "text-xl", px: 20, lh: 1.5, weight: 600, role: "small card titles" },
  { token: "text-lg", px: 18, lh: 1.6, weight: 400, role: "lead paragraph" },
  { token: "text-base", px: 16, lh: 1.6, weight: 400, role: "body — minimum" },
  { token: "text-sm", px: 14, lh: 1.5, weight: 400, role: "meta, helper" },
  { token: "text-xs", px: 12, lh: 1.5, weight: 600, role: "labels, captions" },
];

export function TypographySection() {
  return (
    <Section
      id="typography"
      index={2}
      title="Typography"
      lead="Fraunces (display) + Nunito (body), self-hosted via next/font. Warmth comes from the Fraunces SOFT axis, not heavy weights."
    >
      <SubHead>Type scale</SubHead>
      <div className="space-y-5">
        {SCALE.map((s) => (
          <div key={s.token} className="flex flex-col gap-1 border-b border-border-soft pb-4">
            <div
              className={`${s.display ? "font-display" : "font-body"} text-ink`}
              style={{
                fontSize: `${s.px}px`,
                lineHeight: s.lh,
                fontWeight: s.weight,
                ...(s.display
                  ? { fontVariationSettings: `"opsz" ${Math.min(144, s.px * 2)}, "SOFT" 50` }
                  : {}),
              }}
            >
              The lantern lights the way
            </div>
            <code className="font-mono text-xs text-ink-soft">
              {s.token} · {s.px}px / lh {s.lh} · {s.weight} · {s.role}
            </code>
          </div>
        ))}
      </div>

      <SubHead>Body weights — Nunito</SubHead>
      <div className="max-w-prose space-y-2 font-body text-base text-ink">
        <p style={{ fontWeight: 400 }}>Regular 400 — the workhorse for long-form copy and B2B detail.</p>
        <p style={{ fontWeight: 600 }}>Semibold 600 — labels, emphasis, helper headers.</p>
        <p style={{ fontWeight: 700 }}>Bold 700 — buttons and strong emphasis.</p>
      </div>

      <SubHead>Lead paragraph &amp; labels</SubHead>
      <p className="max-w-prose text-lg text-ink-soft">
        Lead paragraph at text-lg (18px / 1.6) in Nunito — generous, warm, easy to read across the
        ~66–72ch measure the system targets.
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.06em] text-glow-700">
        Caps label · text-xs · +0.06em tracking
      </p>

      <SubHead>Wordmark — direction only</SubHead>
      <div className="flex items-center gap-4 rounded-xl border border-border-soft bg-white p-6 shadow-sm">
        <LanternGlyph size={56} decorative={false} />
        <div>
          <div
            className="font-display text-3xl text-forest-800"
            style={{ fontVariationSettings: '"opsz" 96, "SOFT" 80', fontWeight: 600 }}
          >
            Miss Lana
          </div>
          <div className="font-body text-sm font-semibold uppercase tracking-[0.06em] text-forest-600">
            Fairy-Tale Theater
          </div>
        </div>
        <span className="ml-auto self-start rounded-pill bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning-text">
          DIRECTION — pending trademark
        </span>
      </div>
      <Note>
        Forbidden for headings: Fredoka, Baloo 2, Quicksand (shouty / toy-like), Outfit (cold
        geometric). The light glyph is a placeholder, not a final logo (§4.4, §15).
      </Note>
    </Section>
  );
}

/* ============================================ 3 · SPACING / RADIUS / ELEV === */

const SPACING: [string, number][] = [
  ["space-1", 4],
  ["space-2", 8],
  ["space-3", 12],
  ["space-4", 16],
  ["space-5", 20],
  ["space-6", 24],
  ["space-8", 32],
  ["space-10", 40],
  ["space-12", 48],
  ["space-16", 64],
  ["space-20", 80],
  ["space-24", 96],
];

const RADII: [string, string][] = [
  ["rounded-xs", "6px"],
  ["rounded-sm", "10px"],
  ["rounded-md", "14px"],
  ["rounded-lg", "20px"],
  ["rounded-xl", "28px"],
  ["rounded-2xl", "36px"],
  ["rounded-pill", "9999px"],
];

const SHADOWS: { token: string; cls: string }[] = [
  { token: "shadow-xs", cls: "shadow-xs" },
  { token: "shadow-sm", cls: "shadow-sm" },
  { token: "shadow-md", cls: "shadow-md" },
  { token: "shadow-lg", cls: "shadow-lg" },
  { token: "shadow-xl", cls: "shadow-xl" },
  { token: "shadow-glow", cls: "shadow-glow" },
];

export function SystemSection() {
  return (
    <Section
      id="system"
      index={3}
      title="Spacing · Radius · Elevation"
      lead="4px spacing base (aligned with Tailwind), warm-tinted shadows (never pure black), and the signature shadow-glow."
    >
      <SubHead>Spacing scale (base 4px)</SubHead>
      <div className="space-y-2">
        {SPACING.map(([name, px]) => (
          <div key={name} className="flex items-center gap-4">
            <code className="w-28 shrink-0 font-mono text-xs text-ink-soft">{name}</code>
            <div className="h-4 rounded-sm bg-forest-400" style={{ width: `${px}px` }} />
            <span className="font-mono text-xs text-ink-soft">{px}px</span>
          </div>
        ))}
      </div>

      <SubHead>Radius</SubHead>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {RADII.map(([cls, px]) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div
              className={`h-16 w-16 border-2 border-forest-600 bg-forest-100 ${cls}`}
            />
            <code className="font-mono text-[11px] text-ink-soft">{cls}</code>
            <span className="font-mono text-[11px] text-ink-soft">{px}</span>
          </div>
        ))}
      </div>

      <SubHead>Elevation</SubHead>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {SHADOWS.map((s) => (
          <div key={s.token} className="flex flex-col items-center gap-3">
            <div className={`h-20 w-full rounded-lg bg-white ${s.cls}`} />
            <code className="font-mono text-[11px] text-ink-soft">{s.token}</code>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================ 5 · MOTIF ==== */

export function MotifSection() {
  return (
    <Section
      id="motif"
      index={5}
      title="Motif — direction"
      lead="The signature is warm light: a lantern + 4-point spark (Svitlana = 'light'). Placeholder SVG only — not a final asset."
    >
      <div className="flex flex-wrap items-center gap-8 rounded-xl border border-border-soft bg-cream p-8">
        <div className="flex flex-col items-center gap-2">
          <LanternGlyph size={96} decorative={false} />
          <span className="font-mono text-xs text-ink-soft">lantern</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <StarGlyph size={56} />
          <span className="font-mono text-xs text-ink-soft">4-point spark</span>
        </div>
        <span className="rounded-pill bg-warning-bg px-3 py-1 text-sm font-semibold text-warning-text">
          DIRECTION — pending trademark-clearance
        </span>
      </div>
      <Note>
        One light direction, brown (not black) line, closed/soft mouths. Zero Slavic / Russian /
        Ukrainian visual coding; no &ldquo;big open mouths&rdquo; cartoon. Final lantern, Miss Lana
        character, and production illustrations are gated on trademark-clearance (§7, §8, §15).
      </Note>
    </Section>
  );
}

/* ==================================================== 9 · ACCESSIBILITY ==== */

export function AccessibilitySection() {
  return (
    <Section
      id="accessibility"
      index={9}
      title="Accessibility"
      lead="WCAG AA is built in (§13). Use the keyboard: Tab through the controls below to see the focus-visible treatment."
    >
      <SubHead>Focus-visible</SubHead>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border-soft bg-white p-6">
        <button
          type="button"
          className="focus-halo rounded-pill bg-forest-600 px-6 py-3 font-body font-bold text-white"
        >
          Green button (light halo)
        </button>
        <button
          type="button"
          className="rounded-pill border-[1.5px] border-forest-600 bg-transparent px-6 py-3 font-body font-bold text-forest-700"
        >
          Outline button (forest ring)
        </button>
        <a href="#accessibility" className="font-body font-semibold text-forest-700 underline">
          A focusable link
        </a>
        <input
          type="text"
          aria-label="Focus demo field"
          placeholder="Focus me"
          className="rounded-md border-[1.5px] border-border-strong bg-white px-4 py-3 text-ink placeholder:text-ink-soft"
        />
      </div>
      <Note>
        Baseline (§13): body ≥16px &amp; line-height ≥1.5; contrast ≥4.5 (≥3 for large/UI); color is
        never the sole signal (color + icon + text); touch targets ≥44–48px; visible focus order;
        semantic HTML; skip-to-content; full keyboard support; meaningful borders use border-strong.
      </Note>
    </Section>
  );
}
