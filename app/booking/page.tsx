// Booking / Contact (/booking) — SITE_STRUCTURE_AND_BLOCKS.md §4.7. The #1
// conversion page: production LeadForm + direct written/call contacts + finished
// service-area guidance. Server component; metadata via lib/seo.
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Button, PageHero, Section, SectionHeader, Tag } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { LeadForm } from "@/components/shell/LeadForm";
import { AREAS, EMAIL, PHONES } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Book a show / Contact",
  description:
    "Request a booking for Miss Lana's Fairy-Tale Theatre — preschools, schools, birthdays and parties across Los Angeles, Southern California and farther California locations by request. Text, email, WhatsApp or call.",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <SiteShell>
      <PageHero
        current={{ name: "Book / Contact", href: "/booking" }}
        containerClassName="pt-10 md:pt-14"
        eyebrow="Book / Contact"
        marker={<SparkStar size={16} />}
        title="Book a show"
        subtitle="Tell us about your event and the best way to reach you. Miss Lana will check availability and reply within 1–2 business days."
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href={EMAIL.href} variant="secondary" size="sm">
            Email {EMAIL.address}
          </Button>
          {PHONES.map((p) => (
            <Button key={p.tel} href={`tel:${p.tel}`} variant="secondary" size="sm">
              Call or text {p.display}
            </Button>
          ))}
        </div>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">
          SMS, email and WhatsApp are welcome. A phone call is optional — choose the reply method that works best for you.
        </p>
      </PageHero>

      {/* The form (its own section, max-w-3xl). Confirmation state is on-screen. */}
      <LeadForm />

      {/* Finished service-area content; no storefront address or internal map placeholder. */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          title="Where we go"
          subtitle={`We're based in ${AREAS.base}, serve ${AREAS.region}, and travel farther across California by request. Your booking quote confirms any travel cost before you commit.`}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="solid" accent="forest">
            {AREAS.base} base
          </Tag>
          <Tag>{AREAS.region}</Tag>
          {AREAS.travel.map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
          <Tag>{AREAS.byRequest}</Tag>
        </div>
        <div className="mt-8 rounded-2xl border border-border-soft bg-cream p-6 md:p-8">
          <h3 className="font-display text-2xl text-forest-800">A touring theater — we come to you</h3>
          <p className="mt-3 max-w-3xl text-ink">
            We perform at preschools, schools, homes, parks and event venues. There is no public theater address to visit.
            Tell us the city or area in your request and we&rsquo;ll include the travel details in your quote.
          </p>
          <p className="mt-4 text-sm text-ink-soft">
            New to hosting a show? See{" "}
            <a href="/planning-your-event" className="font-semibold text-forest-700 underline-offset-4 hover:underline">
              planning your event
            </a>{" "}
            for space, setup, parking and weather guidance.
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
