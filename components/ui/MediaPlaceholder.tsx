// MediaPlaceholder — the single, neutral on-brand fill for a media slot that has no
// asset yet. Decorative ONLY: no "pending" / "coming soon" / "placeholder" copy ever
// appears on the public site. The caller owns the aspect/size box (so height is
// reserved → no CLS); this just fills it. Used by Card, GalleryGrid and the show-detail
// hero so the empty-media treatment is identical everywhere and can't drift.
import { SparkStar } from "@/components/brand/Glyphs";
import { cx } from "./cx";

/** Server-safe play triangle for video tiles (no client icon lib). */
function PlayMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="var(--color-forest-600)" />
      <path d="M10 8.5 16 12 10 15.5Z" fill="white" />
    </svg>
  );
}

export interface MediaPlaceholderProps {
  /** Photo (brand spark) or video (play mark). */
  kind?: "photo" | "video";
  /** Glyph size in px. */
  size?: number;
  className?: string;
}

export function MediaPlaceholder({ kind = "photo", size = 34, className }: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden
      className={cx(
        "flex h-full w-full items-center justify-center bg-linear-to-br from-cream to-surface",
        className,
      )}
    >
      {kind === "video" ? <PlayMark size={size} /> : <SparkStar size={size} />}
    </div>
  );
}
