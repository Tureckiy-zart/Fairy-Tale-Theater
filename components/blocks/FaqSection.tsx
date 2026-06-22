// FaqSection — a reusable FAQ band: SectionHeader + the Accordion primitive +
// matching FAQPage JSON-LD (SITE_STRUCTURE §3 FAQAccordion + §6 schema; 04_SEO).
// Server component — it renders the (client) Accordion island and emits the schema
// server-side from the SAME items, so the disclosure list and the FAQPage never drift.
// Used by /school-shows and /birthdays. Copy is temporary, refined before launch.
import { Accordion, JsonLd, Section, SectionHeader } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { faqSchema, type QA } from "@/lib/seo";

export function FaqSection({
  items,
  eyebrow = "Good to know",
  title = "Frequently asked questions",
  tone,
}: {
  /** Plain Q/A pairs — fed to BOTH the Accordion and faqSchema. */
  items: QA[];
  eyebrow?: string;
  title?: string;
  tone?: "cream" | "surface";
}) {
  return (
    <Section tone={tone}>
      <JsonLd data={faqSchema(items)} />
      <SectionHeader
        as="h2"
        eyebrow={eyebrow}
        marker={<SparkStar size={16} />}
        title={title}
      />
      <Accordion className="mt-8 max-w-3xl" items={items} />
    </Section>
  );
}
