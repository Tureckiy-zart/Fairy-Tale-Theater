// Service-line accents — docs/core/DESIGN_SYSTEM.md §12. One system everywhere;
// the line is a *thin* accent only (tag tint, icon tint, hero accent), never a
// re-skin. Every hex is verified for contrast in §12; the tokens live in
// globals.css (@theme). Keeping the class maps here means Card/Tag/SectionHeader
// all tint identically and a new line is one entry, not scattered strings.
export type Accent = "forest" | "coral" | "sage" | "berry";

export const ACCENT_LINE: Record<Accent, string> = {
  forest: "Fairy-Tale Theater",
  coral: "Birthday Parties",
  sage: "School Shows",
  berry: "& Friends",
};

// text-safe colour on cream (≥4.5:1, §12 table) — for tags, labels, links.
export const ACCENT_TEXT: Record<Accent, string> = {
  forest: "text-forest-700",
  coral: "text-coral-text",
  sage: "text-sage-text",
  berry: "text-berry-text",
};

// solid fill that carries white text (≥4.5:1, §12 table) — for chips/markers.
export const ACCENT_FILL: Record<Accent, string> = {
  forest: "bg-forest-600",
  coral: "bg-coral",
  sage: "bg-sage",
  berry: "bg-berry",
};

// soft top border used to mark a card's line without a re-skin.
export const ACCENT_BORDER_TOP: Record<Accent, string> = {
  forest: "border-t-4 border-t-forest-600",
  coral: "border-t-4 border-t-coral",
  sage: "border-t-4 border-t-sage",
  berry: "border-t-4 border-t-berry",
};
