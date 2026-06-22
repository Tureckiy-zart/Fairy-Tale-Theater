// StubPage — minimal placeholder for nav targets whose real content is a later
// phase (SITE_STRUCTURE §7: /shows, /school-shows, /birthdays, /characters,
// /gallery, /about). Keeps navigation 404-free with the full shell: header,
// breadcrumb, a clearly-temporary "coming soon" header + phase note, and the
// BookingCTABand so every page still captures leads (§5). Composed from ui
// primitives (Section/SectionHeader/Breadcrumb/Tag). Server component.
import { Breadcrumb, Section, SectionHeader, Tag } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "./SiteShell";
import { BookingCTABand } from "./BookingCTABand";

export function StubPage({
  title,
  blurb,
  path,
  activeHref,
  phaseNote,
}: {
  title: string;
  blurb: string;
  /** This route's own path (breadcrumb current crumb). */
  path: string;
  /** Nav href so the matching link shows as active (omit if not in the header nav). */
  activeHref?: string;
  /** One line on what this page will become / which phase fills it in. */
  phaseNote: string;
}) {
  return (
    <SiteShell activeHref={activeHref}>
      <Section>
        <Breadcrumb items={[{ name: "Home", href: "/" }, { name: title, href: path }]} className="mb-6" />
        <div className="mb-4">
          <Tag>Coming soon</Tag>
        </div>
        <SectionHeader
          as="h1"
          eyebrow="In a later build"
          marker={<SparkStar size={16} />}
          title={title}
          subtitle={blurb}
        />
        <p className="mt-6 max-w-prose text-ink-soft">{phaseNote}</p>
      </Section>
      <BookingCTABand />
    </SiteShell>
  );
}
