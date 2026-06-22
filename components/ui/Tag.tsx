// Tag / Badge — a small pill label for format tags, section-line eyebrows, and
// status chips. Spec: docs/core/DESIGN_SYSTEM.md §5.2 (pill), §12 (line accents),
// §4.1 (Nunito caps label). Server-safe (no hooks). Decorative by default; pass
// an icon element (Phosphor) for the chip variant.
import type { ReactNode } from "react";
import { cx } from "./cx";
import { ACCENT_TEXT, ACCENT_FILL, type Accent } from "./accent";

export type TagTone = "neutral" | "accent" | "solid";

export interface TagProps {
  children: ReactNode;
  /** Service line (§12) — tints the tag. Defaults to forest. */
  accent?: Accent;
  /**
   * neutral = subtle forest on cream · accent = line-coloured text on a soft tint ·
   * solid = filled chip with white text (white never on gold — §3.2; glow isn't an accent here).
   */
  tone?: TagTone;
  /** Optional leading icon element (Phosphor) — decorative, aria-hidden. */
  icon?: ReactNode;
  className?: string;
}

const TONE: Record<TagTone, (a: Accent) => string> = {
  neutral: () => "bg-forest-50 text-forest-700",
  accent: (a) => cx("bg-cream", ACCENT_TEXT[a]),
  solid: (a) => cx(ACCENT_FILL[a], "text-white"),
};

export function Tag({ children, accent = "forest", tone = "neutral", icon, className }: TagProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1",
        "font-body text-xs font-semibold uppercase tracking-[0.06em]",
        TONE[tone](accent),
        className,
      )}
    >
      {icon ? <span aria-hidden className="inline-flex shrink-0">{icon}</span> : null}
      {children}
    </span>
  );
}
