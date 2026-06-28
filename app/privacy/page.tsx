import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PageHero, Section } from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy",
  description: "How Miss Lana's Fairy-Tale Theatre handles information submitted through the booking website.",
  path: "/privacy",
});

const SECTIONS = [
  {
    title: "Information you send",
    paragraphs: [
      "When you request a booking, we collect the details needed to answer and plan the event: your name, phone number, optional email, event type, date and time, city or area, number of children, preferred show, reply preference, and any notes you choose to add.",
      "Please send only information needed for the event. The booking form does not ask for children's names or payment information.",
    ],
  },
  {
    title: "How we use it",
    paragraphs: [
      "We use inquiry information to respond, check availability, prepare a quote, plan and deliver a show, keep a booking record, and prevent duplicate or abusive submissions.",
      "Your reply preference is included so Miss Lana can contact you by text, email, WhatsApp, or phone as requested.",
    ],
  },
  {
    title: "Where an inquiry may go",
    paragraphs: [
      "A submitted inquiry may be stored in the theatre's booking database and operational spreadsheet and sent to the theatre team through private email or Telegram notifications. Multiple channels help make sure a request is not lost.",
      "We do not sell inquiry information to advertisers. Service providers handle information only to operate the website, store the inquiry, deliver notifications, or support the booking workflow.",
    ],
  },
  {
    title: "Limited campaign information",
    paragraphs: [
      "The site may attach the page path and campaign tags such as UTM source, medium, and campaign to an inquiry so we can understand which promotion produced it.",
      "Booking analytics events are designed not to include names, phone numbers, email addresses, addresses, notes, or child information.",
    ],
  },
  {
    title: "Retention and security",
    paragraphs: [
      "We keep inquiry and booking records only as long as reasonably needed to respond, manage the event, maintain business records, and meet applicable obligations.",
      "We use reasonable safeguards, but no internet transmission or storage system can be guaranteed completely secure.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      `You can ask what inquiry information we hold about you, request a correction, or ask us to delete information that we no longer need. Email ${EMAIL.address} with the subject “Privacy request.”`,
      "You may contact us directly instead of using the web form.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <SiteShell>
      <PageHero
        current={{ name: "Privacy", href: "/privacy" }}
        containerClassName="pt-10 md:pt-14"
        eyebrow="Privacy"
        marker={<SparkStar size={16} />}
        title="Your booking information, explained plainly"
        subtitle="We collect only what we need to answer your inquiry and plan the show."
      />

      <Section>
        <p className="max-w-prose text-sm text-ink-soft">Last updated: June 28, 2026</p>
        <div className="mt-10 flex max-w-3xl flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-3xl text-forest-800">{section.title}</h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-border-soft bg-surface p-6 md:p-8">
          <h2 className="font-display text-2xl text-forest-800">Questions?</h2>
          <p className="mt-3 text-ink">
            Email{" "}
            <a href={EMAIL.href} className="font-semibold text-forest-700 underline underline-offset-4">
              {EMAIL.address}
            </a>
            .
          </p>
        </div>
      </Section>
    </SiteShell>
  );
}
