"use client";
// TrustStrip — Home block #2 (SITE_STRUCTURE §4.1). Five quick trust markers that
// speak to BOTH audiences (schools + families) at once. Small Phosphor Duotone icons
// (§6), real facts from lib/site. Rendered statically (sits near the fold — no reveal).
import { Medal, UsersThree, MapPin, Smiley, Heart } from "@phosphor-icons/react";

const ITEMS = [
  { icon: Medal, label: "30+ years of experience" },
  { icon: UsersThree, label: "Professional troupe of 4" },
  { icon: MapPin, label: "We come to you" },
  { icon: Smiley, label: "Ages 2–10" },
  { icon: Heart, label: "Kind, timeless values" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why schools and families book us" className="border-y border-border-soft bg-surface">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-6 md:justify-between md:px-6">
        {ITEMS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span data-icon="duotone-brand" className="text-forest-700">
              <Icon size={26} weight="duotone" aria-hidden />
            </span>
            <span className="font-body text-sm font-semibold text-ink">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
