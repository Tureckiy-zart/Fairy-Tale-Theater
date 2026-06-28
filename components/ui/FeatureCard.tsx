// FeatureCard — the shared "icon + title + body" card shell used across the
// marketing blocks (FormatExplainer points, HowItWorksAreas steps). Source of
// truth for visuals: docs/core/DESIGN_SYSTEM.md. Server-safe. The icon is wrapped
// in the brand duotone slot (data-icon="duotone-brand") so Phosphor duotone glyphs
// pick up the §6 forest tint; the heading uses the Fraunces display face.
import type { ReactNode } from "react";
import { cx } from "./cx";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}

export function FeatureCard({ icon, title, children, className }: FeatureCardProps) {
  return (
    <div
      className={cx(
        "flex h-full flex-col gap-3 rounded-lg border border-border-soft bg-white p-6 shadow-sm",
        className,
      )}
    >
      <span data-icon="duotone-brand" className="text-forest-700">
        {icon}
      </span>
      <h3 className="font-display text-xl text-forest-800">{title}</h3>
      <p className="text-ink">{children}</p>
    </div>
  );
}
