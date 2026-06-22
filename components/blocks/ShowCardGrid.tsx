"use client";
// ShowCardGrid — the reusable repertoire grid (SITE_STRUCTURE §3 ShowCard/ShowCardGrid),
// used by the /shows hub, a show page's "related shows", and Home's Featured shows.
// Built from the Card primitive; takes plain Show data (lib/shows) so server pages can
// pass it across the RSC boundary. Phosphor meta icons + the brand light icons live here
// (client) — that's why this is the boundary. Photos render Card's marked "Photo —
// pending" placeholder until real assets land (Phase 4 [ASSET]). Scroll-reveal staggered.
import { UsersThree, Clock } from "@phosphor-icons/react";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/motion/Reveal";
import type { Show } from "@/lib/shows";

export function ShowCardGrid({
  shows,
  /** Tailwind grid-template-columns classes (default: 1 → 2 → 3). */
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  shows: Show[];
  columnsClassName?: string;
}) {
  return (
    <div className={`grid gap-6 ${columnsClassName}`}>
      {shows.map((show, i) => (
        <Reveal key={show.slug} delayMs={i * 75} className="h-full">
          <Card
            title={show.title}
            blurb={show.teaser}
            href={`/shows/${show.slug}`}
            ctaLabel="See this show"
            mediaSrc={show.image}
            meta={[
              { icon: UsersThree, label: show.ages },
              { icon: Clock, label: show.length },
            ]}
          />
        </Reveal>
      ))}
    </div>
  );
}
