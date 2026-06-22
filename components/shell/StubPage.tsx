// StubPage — minimal placeholder for nav targets whose real content is a later
// phase (SITE_STRUCTURE §7: /shows, /school-shows, /birthdays, /characters,
// /gallery, /about). Keeps navigation 404-free with the full shell: header,
// breadcrumb, a friendly visitor-facing "coming soon" message, and the
// BookingCTABand so every page still captures leads (§5). Composed from ui
// primitives (Section/SectionHeader/Breadcrumb/Tag). Server component.
import { Breadcrumb, Section, SectionHeader, Tag } from "@/components/ui";
import { SiteShell } from "./SiteShell";
import { BookingCTABand } from "./BookingCTABand";

export function StubPage({
  title,
  blurb,
  path,
  activeHref,
}: {
  title: string;
  blurb: string;
  /** This route's own path (breadcrumb current crumb). */
  path: string;
  /** Nav href so the matching link shows as active (omit if not in the header nav). */
  activeHref?: string;
}) {
  return (
    <SiteShell activeHref={activeHref}>
      <Section>
        <Breadcrumb items={[{ name: "Home", href: "/" }, { name: title, href: path }]} className="mb-6" />
        <div className="mb-4">
          <Tag>Coming soon</Tag>
        </div>
        <SectionHeader as="h1" title={title} subtitle={blurb} />
        <p className="mt-6 max-w-prose text-ink-soft">
          We&rsquo;re putting this page together — coming soon. In the meantime, you can send a
          booking request or give us a call.
        </p>
      </Section>
      <BookingCTABand />
    </SiteShell>
  );
}
