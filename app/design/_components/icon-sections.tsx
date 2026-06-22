"use client";

// Iconography (§6) + service-line accents (§12). Client component because
// phosphor-react reads defaults from React context. ONE icon library only.
import {
  House,
  MapPin,
  Phone,
  CalendarBlank,
  MagnifyingGlass,
  CaretRight,
  List,
  Check,
  Lightbulb,
  Star,
  Confetti,
  Heart,
  MaskHappy,
  Cake,
  GraduationCap,
  UsersThree,
  type IconProps,
} from "phosphor-react";
import type { ComponentType } from "react";
import { Section, SubHead, Note } from "./primitives";

type Icon = ComponentType<IconProps>;

const REGULAR: { Cmp: Icon; name: string }[] = [
  { Cmp: House, name: "House" },
  { Cmp: MapPin, name: "MapPin" },
  { Cmp: Phone, name: "Phone" },
  { Cmp: CalendarBlank, name: "CalendarBlank" },
  { Cmp: MagnifyingGlass, name: "MagnifyingGlass" },
  { Cmp: CaretRight, name: "CaretRight" },
  { Cmp: List, name: "List" },
  { Cmp: Check, name: "Check" },
];

const DUOTONE: { Cmp: Icon; name: string }[] = [
  { Cmp: Lightbulb, name: "Lightbulb" },
  { Cmp: Star, name: "Star" },
  { Cmp: Confetti, name: "Confetti" },
  { Cmp: Heart, name: "Heart" },
];

export function IconographySection() {
  return (
    <Section
      id="iconography"
      index={4}
      title="Iconography — Phosphor"
      lead="One library (phosphor-react). Regular for UI (ink / forest-700) on a 24px base; Duotone for delight (the light thread: forest body + glow accent). Max two weights per screen."
    >
      <SubHead>Regular — UI (24px)</SubHead>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-8">
        {REGULAR.map(({ Cmp, name }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-md border border-border-soft bg-white p-3"
          >
            <Cmp size={24} weight="regular" color="var(--color-ink)" />
            <code className="font-mono text-[10px] text-ink-soft">{name}</code>
          </div>
        ))}
      </div>

      <SubHead>Duotone — delight (brand thread, ≥24px)</SubHead>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {DUOTONE.map(({ Cmp, name }) => (
          <div
            key={name}
            data-icon="duotone-brand"
            className="flex flex-col items-center gap-2 rounded-md border border-border-soft bg-cream p-4"
          >
            <Cmp size={32} weight="duotone" color="var(--color-forest-700)" />
            <code className="font-mono text-[10px] text-ink-soft">{name}</code>
          </div>
        ))}
      </div>
      <Note>
        Body = forest, accent = glow — the brand &ldquo;light&rdquo; thread (§6). No second icon
        library; no more than two Phosphor weights on one screen (here: Regular + Duotone).
      </Note>
    </Section>
  );
}

/* ============================================ 8 · SERVICE-LINE ACCENTS ===== */

type Accent = {
  line: string;
  Cmp: Icon;
  textHex: string; // text-safe on cream
  fillHex: string; // fill with white text
  textLabel: string;
  fillLabel: string;
};

// Hexes verbatim from §12. Secondary accent hexes are flagged "finalize in build".
const ACCENTS: Accent[] = [
  {
    line: "Fairy-Tale Theater",
    Cmp: MaskHappy,
    textHex: "#335A23",
    fillHex: "#41702C",
    textLabel: "forest-700 · 7.48",
    fillLabel: "forest-600 · white 5.87",
  },
  {
    line: "Birthday Parties",
    Cmp: Cake,
    textHex: "#A8431F",
    fillHex: "#C0532E",
    textLabel: "coral-text · 5.63",
    fillLabel: "coral · white 4.65",
  },
  {
    line: "School Shows",
    Cmp: GraduationCap,
    textHex: "#4E6B3D",
    fillHex: "#4E6B3D",
    textLabel: "sage-text · 5.62",
    fillLabel: "sage · white 6.01",
  },
  {
    line: "& Friends",
    Cmp: UsersThree,
    textHex: "#8E4A63",
    fillHex: "#8E4A63",
    textLabel: "berry-text · 5.94",
    fillLabel: "berry · white 6.34",
  },
];

export function AccentsSection() {
  return (
    <Section
      id="accents"
      index={8}
      title="Service-line accents"
      lead="One system everywhere; each line differs only by a thin accent — a tag color, an icon tint, a hero touch. No re-skins, no different typefaces."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACCENTS.map((a) => (
          <div
            key={a.line}
            className="flex flex-col gap-3 rounded-lg border border-border-soft bg-white p-5 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <a.Cmp size={28} weight="duotone" color={a.textHex} />
              <span className="font-display text-xl text-forest-800">{a.line}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-pill border border-border-soft bg-cream px-3 py-1 text-sm font-semibold"
                style={{ color: a.textHex }}
              >
                Text-safe
              </span>
              <code className="font-mono text-[11px] text-ink-soft">{a.textLabel}</code>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-pill px-3 py-1 text-sm font-semibold text-white"
                style={{ backgroundColor: a.fillHex }}
              >
                Fill · white text
              </span>
              <code className="font-mono text-[11px] text-ink-soft">{a.fillLabel}</code>
            </div>
          </div>
        ))}
      </div>
      <Note>
        Secondary accent hexes (Birthdays / &amp; Friends) are directional — finalize and re-check
        contrast in the build (§12, §15).
      </Note>
    </Section>
  );
}
