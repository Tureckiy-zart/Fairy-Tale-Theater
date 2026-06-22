# Miss Lana UI primitives (`components/ui/`)

The reusable, typed, accessible building blocks real pages are assembled from.
**Single source of truth for visuals:** `docs/core/DESIGN_SYSTEM.md` (DS v1.0). Every
style here resolves to a `@theme` token defined once in `app/globals.css` — do not
hard-code colours/spacing/shadows, and do not fork the token definitions.

- **Tokens:** Tailwind v4 CSS-first (`@theme` in `globals.css`). Utilities like
  `bg-forest-600`, `rounded-pill`, `shadow-glow`, `ease-gentle-spring` map to those tokens.
  Durations (`--dur-*`) are referenced via `duration-[var(--dur-fast)]`.
- **Type:** Fraunces (display) + Nunito (body) via `next/font` (`app/layout.tsx`).
- **Icons:** Phosphor (`phosphor-react`) only — Regular for UI, Duotone for the brand
  "light" accent. Wrap a Duotone icon in `data-icon="duotone-brand"` to tint its accent
  path glow-400 (§6). Max two weights per screen.
- **Motion:** motion-safe-first (`motion-safe:` variants). Under `prefers-reduced-motion`
  the global backstop snaps transitions; colour/opacity still convey state. Only
  `transform`/`opacity`/`box-shadow` animate — never layout or `transition: all` (§10).
- **A11y:** visible `:focus-visible` (forest-700 ring; light halo on green fills via
  `.focus-halo`), ≥44–48px touch targets, semantic HTML, colour never the sole signal.

```ts
import { Button, Field, Card, Nav } from "@/components/ui";
```

`Button` is server-safe. `Field`, `Card`, and `Nav` are Client Components (`"use client"`)
because Phosphor icons use context and `Nav`/`Field` need hooks; they still server-render
their markup on first load.

---

## Button

Primary / secondary / tertiary CTA. Renders `<button>`, or `<a>` when `href` is set.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "tertiary"` | `"primary"` | §11 CTAs |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 44 / 48 / 56px min height (pill variants) |
| `leadingIcon` / `trailingIcon` | `ReactNode` | — | Phosphor element, rendered `aria-hidden` |
| `fullWidth` | `boolean` | `false` | full-width (mobile submit) |
| `href` | `string` | — | when set, renders an `<a>` |
| …rest | button/anchor attrs | — | `disabled`, `type`, `onClick`, `aria-*`, … |

```tsx
<Button leadingIcon={<span data-icon="duotone-brand"><Lightbulb weight="duotone" size={20} /></span>}>
  Book Miss Lana
</Button>
<Button variant="secondary" href="/shows">See the shows</Button>
<Button variant="tertiary">Learn more</Button>
```

Primary = forest-600 + white (5.87:1) → hover forest-700 + scale 1.02 + `shadow-glow`;
active scale .97; disabled forest-300 + ink-muted. Provide an `aria-label` for icon-only use.

## Field

Labelled `<input>` / `<textarea>`. **Presentational only** — no submission/backend.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | always visible (§11) |
| `name` | `string` | — | builds the stable label↔control↔message ids |
| `helper` | `string` | — | neutral hint |
| `error` | `string` | — | sets error state (border + icon + `role="alert"`) |
| `success` | `string` | — | sets success state (tint + check) |
| `required` | `boolean` | `false` | rendered as the word "(required)" |
| `multiline` | `boolean` | `false` | renders a `<textarea>` |
| `rows` | `number` | `4` | textarea rows |
| …rest | input attrs | — | `type`, `placeholder`, `value`, `onChange`, … |

```tsx
<Field label="Email" name="email" type="email" required placeholder="you@example.com" />
<Field label="Event date" name="date" error="Please add a date so we can check availability." />
<Field label="Tell us about your event" name="about" multiline rows={4} helper="Audience age, venue…" />
```

Precedence for the message line: `error` → `success` → `helper`. Each status pairs an inline
Phosphor icon with the text (colour is never the only signal). Linked via `aria-describedby`.

## Card

"Show card": media (3:2) on top, Fraunces title, meta row with small Phosphor icons, blurb,
and a "See this show →" CTA. Fills its grid cell (`h-full`) for equal heights.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | Fraunces, forest-800 |
| `href` | `string` | — | CTA destination |
| `blurb` | `string` | — | body copy |
| `meta` | `{ icon?: Icon; label: string }[]` | — | `icon` is a Phosphor component |
| `mediaSrc` | `string` | — | omit → "Photo — pending" placeholder (assets gated) |
| `mediaAlt` | `string` | `""` | scene + emotion; empty only if decorative |
| `ctaLabel` | `string` | `"See this show"` | arrow rendered as a Phosphor icon |
| `mediaSizes` | `string` | `"(min-width:768px) 33vw, 100vw"` | `next/image` sizes |

```tsx
<Card title="The Lantern & the Lost Star" href="/shows/lantern"
  blurb="A gentle bedtime tale about courage…"
  meta={[{ icon: Users, label: "Ages 2–10" }, { icon: Clock, label: "~40 min" }]} />
```

## Nav

Sticky site header: wordmark/persona slot, links with active underline, primary Book CTA,
transparent → cream + shadow on scroll, mobile drawer (focus-trap + ESC), and a skip link.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `links` | `{ label: string; href: string }[]` | — | primary nav links |
| `activeHref` | `string` | — | active link (underline + `aria-current="page"`) |
| `cta` | `{ label: string; href: string }` | `{ "Book Miss Lana", "#book" }` | primary CTA (uses `Button`) |
| `wordmark` | `ReactNode` | text placeholder | persona/wordmark slot (no final logo — TM gate) |
| `mainContentId` | `string` | `"main-content"` | skip-link target; the page `<main>` must use this id |

```tsx
<Nav
  links={[{ label: "Shows", href: "/shows" }, { label: "Parties", href: "/parties" }]}
  activeHref="/shows"
  cta={{ label: "Book Miss Lana", href: "/booking" }}
/>
<main id="main-content">…</main>
```

The drawer traps focus while open, closes on `Esc` (returning focus to the burger), and
locks body scroll. Scroll state uses an `IntersectionObserver` sentinel (no scroll listener).

---

The `/design` route is the internal, `noindex` **living gallery** that renders these
primitives. The wordmark, Miss Lana character, and production photography are placeholders
pending trademark-clearance (§7–§8, §15) — swap them for final assets in a later task.
