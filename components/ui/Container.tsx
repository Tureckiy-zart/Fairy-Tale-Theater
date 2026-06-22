// Container — centred max-width wrapper with the standard gutter. Spec:
// docs/core/DESIGN_SYSTEM.md §5.1 (container ~1280px centred; gutter 16 → 24).
// Server-safe. Polymorphic `as` so sections/headers/footers stay semantic.
import type { ElementType, ReactNode } from "react";
import { cx } from "./cx";

export interface ContainerProps {
  children: ReactNode;
  /** Semantic element to render. Default <div>. */
  as?: ElementType;
  /** Narrower measure for prose-heavy content (≤72ch reading width, §4.2/§5.1). */
  prose?: boolean;
  className?: string;
}

export function Container({ children, as: Tag = "div", prose = false, className }: ContainerProps) {
  return (
    <Tag
      className={cx(
        "mx-auto w-full px-4 md:px-6",
        prose ? "max-w-prose" : "max-w-7xl", // 80rem = 1280px (§5.1)
        className,
      )}
    >
      {children}
    </Tag>
  );
}
