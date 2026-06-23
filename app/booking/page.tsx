// Booking / Contact (/booking) — SITE_STRUCTURE_AND_BLOCKS.md §4.7. The #1
// conversion page: the LeadForm (client validation + on-screen confirmation; no
// backend yet) + click-to-call + a service-area placeholder block. Server component;
// metadata via lib/seo (noindex pre-launch).
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb, Button, Container, Section, SectionHeader, Tag } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { LeadForm } from "@/components/shell/LeadForm";
import { AREAS, PHONES } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book a show / Contact",
  description:
    "Request a booking for Miss Lana's Fairy-Tale Theater — preschools, schools, birthdays and parties across Los Angeles, San Diego, Sacramento and San Jose. Call or send a request.",
  path: "/booking",
  noindex: true,
});

export default function BookingPage() {
  return (
    <SiteShell>
      <Container className="pt-10 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Book / Contact", href: "/booking" },
          ]}
          className="mb-6"
        />
        <SectionHeader
          as="h1"
          eyebrow="Book / Contact"
          marker={<SparkStar size={16} />}
          title="Book a show"
          subtitle="Tell us about your event — we'll check the date and call you back. It's the fastest way to reach us."
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-body text-sm font-semibold text-ink">Prefer to call?</span>
          {PHONES.map((p) => (
            <Button key={p.tel} href={`tel:${p.tel}`} variant="secondary" size="sm">
              {p.display}
            </Button>
          ))}
        </div>
      </Container>

      {/* The form (its own section, max-w-3xl). Confirmation state is on-screen. */}
      <LeadForm />

      {/* Service-area placeholder (GBP-first; live map embed is a later phase — §4.7). */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          title="Where we go"
          subtitle="A touring, service-area theater — we come to you. Free within 30 miles of Los Angeles; beyond that, travel is quoted by distance."
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="solid" accent="forest">
            {AREAS.base}
          </Tag>
          {AREAS.travel.map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
        </div>
        <div className="mt-6 flex h-48 items-center justify-center rounded-2xl border border-border-soft bg-cream text-center md:h-64">
          <div className="flex flex-col items-center gap-2">
            <SparkStar size={28} />
            <p className="font-display text-xl text-forest-700">Service-area map</p>
            <Tag>GBP-first · embed later</Tag>
          </div>
        </div>
      </Section>
    </SiteShell>
  );
}
