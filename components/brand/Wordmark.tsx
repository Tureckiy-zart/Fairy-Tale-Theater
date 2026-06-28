"use client";
import { Sparkle } from "@phosphor-icons/react";
import { BRAND } from "@/lib/site";
import { cx } from "@/components/ui/cx";

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cx("flex items-center gap-2", className)}>
      <span data-icon="duotone-brand" className="text-forest-700">
        <Sparkle size={28} weight="duotone" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-xl text-forest-800"
          style={{ fontVariationSettings: "'SOFT' 60" }}
        >
          {BRAND.umbrella}&rsquo;s
        </span>
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.06em] text-forest-600">
          {BRAND.descriptor}
        </span>
      </span>
    </span>
  );
}
