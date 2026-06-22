// Button — primary / secondary / tertiary CTA primitive.
// Spec: docs/core/DESIGN_SYSTEM.md §11 (CTAs) + §10 (motion) + §13 (a11y).
// Every value is a design token (utilities map to the @theme tokens in globals.css).
//
// Server-safe (no hooks, no icon import): renders <button> by default, or <a>
// when `href` is given. Pass a Phosphor icon element via `leadingIcon`
// (Duotone for the brand "light", Regular otherwise) — created by the caller so
// this component stays usable from both server and client trees.
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

interface OwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading icon element (Phosphor). Decorative — wrapped aria-hidden. */
  leadingIcon?: ReactNode;
  /** Optional trailing icon element (Phosphor). Decorative — wrapped aria-hidden. */
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonAsButton = OwnProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = OwnProps & ComponentPropsWithoutRef<"a"> & { href: string };
export type ButtonProps = ButtonAsButton | ButtonAsLink;

// Shared shape + motion. motion-safe-first: transform/colour/shadow tween only
// when motion is allowed; under reduce the global backstop snaps them (§10.3).
const BASE = cx(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-body font-bold",
  "motion-safe:transition-[transform,background-color,border-color,box-shadow,color]",
  "motion-safe:duration-[var(--dur-fast)] motion-safe:ease-gentle-spring",
  "motion-safe:active:duration-[var(--dur-instant)]",
);

// Sizes apply to the pill variants only (sm 44px / md 48px / lg 56px — all ≥44px §13).
const SIZE: Record<ButtonSize, string> = {
  sm: "min-h-11 rounded-pill px-5 py-2 text-sm",
  md: "min-h-12 rounded-pill px-6 py-3 text-base",
  lg: "min-h-14 rounded-pill px-8 py-4 text-lg",
};

const VARIANT: Record<ButtonVariant, string> = {
  // §11 PRIMARY: forest-600 + white (5.87:1), shadow-sm; hover forest-700 + scale
  // 1.02 + shadow-glow; active scale .97; focus = light halo (.focus-halo);
  // disabled forest-300 + ink-muted.
  primary: cx(
    "focus-halo bg-forest-600 text-white shadow-sm",
    "hover:bg-forest-700 hover:shadow-glow",
    "motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97]",
    "disabled:bg-forest-300 disabled:text-ink-muted disabled:shadow-none",
    "disabled:hover:bg-forest-300 disabled:hover:shadow-none motion-safe:disabled:hover:scale-100",
    "aria-disabled:bg-forest-300 aria-disabled:text-ink-muted aria-disabled:shadow-none aria-disabled:pointer-events-none",
  ),
  // §11 SECONDARY: 1.5px forest-600 outline, forest-700 text, transparent fill;
  // hover fills forest-50.
  secondary: cx(
    "border-[1.5px] border-forest-600 bg-transparent text-forest-700",
    "hover:bg-forest-50",
    "motion-safe:active:scale-[0.97]",
    "disabled:border-forest-300 disabled:text-ink-muted disabled:hover:bg-transparent",
    "aria-disabled:border-forest-300 aria-disabled:text-ink-muted aria-disabled:pointer-events-none",
  ),
  // §11 TERTIARY: forest-700 text link, underline on hover. No pill / min-height.
  tertiary: cx(
    "rounded-xs px-1 py-0.5 text-forest-700 underline-offset-4",
    "hover:underline",
    "disabled:text-ink-muted disabled:no-underline disabled:hover:no-underline",
    "aria-disabled:text-ink-muted aria-disabled:pointer-events-none",
  ),
};

function classesFor(variant: ButtonVariant, size: ButtonSize, fullWidth: boolean | undefined, className: string | undefined) {
  return cx(
    BASE,
    variant === "tertiary" ? VARIANT.tertiary : cx(SIZE[size], VARIANT[variant]),
    fullWidth && "w-full",
    className,
  );
}

function Content({ leadingIcon, trailingIcon, children }: Pick<OwnProps, "leadingIcon" | "trailingIcon" | "children">) {
  return (
    <>
      {leadingIcon ? <span aria-hidden className="inline-flex shrink-0">{leadingIcon}</span> : null}
      {children}
      {trailingIcon ? <span aria-hidden className="inline-flex shrink-0">{trailingIcon}</span> : null}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = "primary", size = "md", leadingIcon, trailingIcon, fullWidth, className, children, href, ...rest } = props;
    return (
      <a href={href} className={classesFor(variant, size, fullWidth, className)} {...rest}>
        <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>{children}</Content>
      </a>
    );
  }
  const { variant = "primary", size = "md", leadingIcon, trailingIcon, fullWidth, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={classesFor(variant, size, fullWidth, className)} {...rest}>
      <Content leadingIcon={leadingIcon} trailingIcon={trailingIcon}>{children}</Content>
    </button>
  );
}
