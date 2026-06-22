# Miss Lana UI primitives (`components/ui/`)

The reusable, typed, accessible building blocks real pages are assembled from.
**Single source of truth for visuals:** `docs/core/DESIGN_SYSTEM.md` (DS v1.0). Every
style here resolves to a `@theme` token defined once in `app/globals.css` — do not
hard-code colours/spacing/shadows, and do not fork the token definitions.

- **Tokens:** Tailwind v4 CSS-first (`@theme` in `globals.css`). Utilities like
  `bg-forest-600`, `rounded-pill`, `shadow-glow`, `ease-gentle-spring` map to those tokens.
  Durations (`--dur-*`) are referenced via `duration-[var(--dur-fast)]`.
- **Type:** Fraunces (display) + Nunito (body) via `next/font` (`app/layout.tsx`).
- **Icons:** Phosphor (`@phosphor-icons/react`) only — Regular for UI, Duotone for the brand
  "light" accent. Wrap a Duotone icon in `data-icon="duotone-brand"` to tint its accent
  path glow-400 (§6). Max two weights per screen.
- **Motion:** motion-safe-first (`motion-safe:` variants). Under `prefers-reduced-motion`
  the global backstop snaps transitions; colour/opacity still convey state. Only
  `transform`/`opacity`/`box-shadow` animate — never layout or `transition: all` (§10).
- **A11y:** visible `:focus-visible` (forest-700 ring; light halo on green fills via
  `.focus-halo`), ≥44–48px touch targets, semantic HTML, colour never the sole signal.

```ts
import {
  Button, Field, Card, Nav, Breadcrumb,        // actions / forms / content / navigation
  Tag, Accordion, Container, Section, SectionHeader, // content + layout
  JsonLd,                                        // SEO
} from "@/components/ui";
import { buildMetadata, organizationSchema, theaterEventSchema, faqSchema } from "@/lib/seo";
```

**Server-safe** (no `"use client"`): `Button`, `Tag`, `Container`, `Section`, `SectionHeader`,
`JsonLd`. **Client Components** (hooks / Phosphor context): `Field`, `Card`, `Nav`, `Accordion`,
`Breadcrumb` — they still server-render their markup (and JSON-LD) on first load.

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

"Show card": media (3:2) on top, optional tag, Fraunces title, meta row, blurb, and **one**
call to action — a text link (`href`) **or** a Button (`cta`). Fills its grid cell (`h-full`)
for equal heights. An `accent` adds a top line-colour border + tints the tag (§12).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | Fraunces, forest-800 |
| `blurb` | `string` | — | body copy |
| `href` | `string` | — | text-link CTA destination (omit when using `cta`) |
| `cta` | `{ label; href; variant? }` | — | renders a **Button** instead of the text link |
| `tag` | `string` | — | small label above the title (tinted by `accent`) |
| `accent` | `"forest"\|"coral"\|"sage"\|"berry"` | — | service line (§12): top border + tag tint |
| `meta` | `{ icon?: Icon; label: string }[]` | — | `icon` is a Phosphor component |
| `mediaSrc` / `mediaAlt` | `string` | — / `""` | omit src → "Photo — pending" placeholder (gated) |
| `ctaLabel` | `string` | `"See this show"` | text-link label; arrow is a Phosphor icon |
| `mediaSizes` | `string` | `"(min-width:768px) 33vw, 100vw"` | `next/image` sizes |

```tsx
// Show card — text link
<Card title="The Lantern & the Lost Star" href="/shows/lantern"
  blurb="A gentle bedtime tale about courage…"
  meta={[{ icon: Users, label: "Ages 2–10" }, { icon: Clock, label: "~40 min" }]} />

// Service-line card — Button CTA + accent + tag
<Card accent="coral" tag="Birthday Parties" title="Parties that feel like a show"
  blurb="A real costumed performance comes to your celebration."
  cta={{ label: "See birthday shows", href: "/birthdays" }} />
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

## Breadcrumb

Page trail **and** `BreadcrumbList` JSON-LD in one primitive (§3 / 04_SEO). Ordered
root → current; the last crumb is the current page (`aria-current`, not a link).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ name: string; href: string }[]` | — | `Crumb[]` from `@/lib/seo` |
| `noSchema` | `boolean` | `false` | skip the JSON-LD (if the page emits its own) |

```tsx
<Breadcrumb items={[
  { name: "Home", href: "/" },
  { name: "Shows", href: "/shows" },
  { name: "The Gingerbread Man", href: "/shows/the-gingerbread-man" },
]} />
```

## Tag

Small pill label — format tags, line eyebrows, status chips. Server-safe.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `accent` | `Accent` | `"forest"` | service line (§12) |
| `tone` | `"neutral"\|"accent"\|"solid"` | `"neutral"` | solid = white text on the line fill |
| `icon` | `ReactNode` | — | Phosphor element, `aria-hidden` |

## Accordion

FAQ disclosure list (§11). Each row is a `<button>` toggling an `aria`-controlled region.
**No layout animation** (§10.4) — the panel shows/hides instantly; only the chevron rotates
(motion-safe). Pair the same items with `faqSchema()` for a `FAQPage`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ question: string; answer: ReactNode }[]` | — | |
| `allowMultiple` | `boolean` | `false` | keep several panels open |
| `defaultOpen` | `number` | — | index open on mount (single mode) |

## Layout — Container · Section · SectionHeader

- **`Container`** — centred `max-w-7xl` (1280px) with the standard gutter (`px-4 md:px-6`).
  `prose` narrows to a reading measure; `as` keeps it semantic.
- **`Section`** — full-width band, `py-clamp(4rem,8vw,8rem)`, optional `tone="surface"` for
  the tinted alternation; wraps content in a `Container` unless `bleed`.
- **`SectionHeader`** — `eyebrow` (amber glow-700, or line `accent`) + heading (`as` h1/h2/h3,
  Fraunces clamp) + `subtitle` + optional lantern `marker`; `align="center"` for heroes.

```tsx
<Section id="shows" tone="surface">
  <SectionHeader as="h2" eyebrow="Repertoire" title="Eight shows to choose from"
    subtitle="Each a real costumed performance — pick the tale, we bring the theater." />
  {/* …Card grid… */}
</Section>
```

## SEO — `JsonLd` + `lib/seo`

`<JsonLd data={…} />` emits `<script type="application/ld+json">` safely (escapes `<`; **no**
`dangerouslySetInnerHTML`, per governance). `lib/seo` provides the data:

- `buildMetadata({ title, description, path, image?, noindex? })` → Next `Metadata`
  (canonical, Open Graph, Twitter, robots). Use in a route's `export const metadata`.
- `organizationSchema()` — PerformingGroup + LocalBusiness (areaServed = touring cities).
- `theaterEventSchema({ name, description, path, image? })` — a show page.
- `breadcrumbSchema(items)` — used by `Breadcrumb`; call directly for a custom trail.
- `faqSchema(items)` — `FAQPage`, pair with `Accordion`.

```tsx
// app/shows/[slug]/page.tsx
export const metadata = buildMetadata({ title: "The Gingerbread Man",
  description: "A lively chase tale…", path: "/shows/the-gingerbread-man" });

<JsonLd data={theaterEventSchema({ name: "The Gingerbread Man",
  description: "A lively chase tale…", path: "/shows/the-gingerbread-man" })} />
```

---

The `/design` route is the internal, `noindex` **living gallery** that renders these
primitives. The wordmark, Miss Lana character, and production photography are placeholders
pending trademark-clearance (§7–§8, §15) — swap them for final assets in a later task.
