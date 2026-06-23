// Show detail (/shows/{slug}) — SITE_STRUCTURE_AND_BLOCKS.md §4.2 detail template,
// one indexable URL per show (×8 from lib/shows). Block order: hero (title + meta +
// "Book this show" primary CTA + placeholder photo) → synopsis + theme/value →
// photo/video (placeholder) → related shows → areas + "from $350" → BookingCTABand.
// Schema: TheaterEvent (JsonLd) + BreadcrumbList (via Breadcrumb). NO format tag
// (owner-gated — non-goal). Titles/slugs canonical (lib/shows); synopsis final;
// photos render the marked placeholder treatment (Phase 4 [ASSET]). Server component;
// unique metadata per page (noindex pre-launch).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Container,
  JsonLd,
  Section,
  SectionHeader,
  Tag,
} from "@/components/ui";
import { SparkStar } from "@/components/brand/Glyphs";
import { SiteShell } from "@/components/shell/SiteShell";
import { BookingCTABand } from "@/components/shell/BookingCTABand";
import { ShowCardGrid } from "@/components/blocks/ShowCardGrid";
import { buildMetadata, theaterEventSchema } from "@/lib/seo";
import { AREAS, FACTS } from "@/lib/site";
import { SHOWS, getShow, relatedShows } from "@/lib/shows";

// All 8 slugs are known and the set is closed — 404 anything else.
export const dynamicParams = false;
export function generateStaticParams() {
  return SHOWS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) return {};
  return buildMetadata({
    title: show.title,
    description: `${show.teaser} A live costumed fairy-tale show plus interactive play for ${show.ages.toLowerCase()} — ${show.length}, brought to your venue across LA and beyond.`,
    path: `/shows/${show.slug}`,
    image: show.image,
    noindex: true,
  });
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = getShow(slug);
  if (!show) notFound();

  const meta = [`${show.ages}`, show.length];
  const description = `${show.teaser} A live costumed fairy-tale show plus interactive play for ${show.ages.toLowerCase()} — ${show.length}.`;

  return (
    <SiteShell activeHref="/shows">
      <JsonLd
        data={theaterEventSchema({
          name: show.title,
          description,
          path: `/shows/${show.slug}`,
          image: show.image,
        })}
      />

      {/* Hero — title, meta, primary "Book this show" CTA + placeholder photo */}
      <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Shows", href: "/shows" },
            { name: show.title, href: `/shows/${show.slug}` },
          ]}
          className="mb-6"
        />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Tag accent="forest" tone="accent" className="mb-3">
              Fairy-Tale Theater
            </Tag>
            <SectionHeader as="h1" title={show.title} subtitle={show.teaser} />
            {show.altTitle ? (
              <p className="mt-2 font-display text-lg text-ink-soft">Also known as {show.altTitle}</p>
            ) : null}

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
              {meta.map((m) => (
                <li key={m} className="flex items-center gap-1.5">
                  <SparkStar size={14} />
                  <span>{m}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/booking">Book this show</Button>
              <Button href="/shows" variant="secondary">
                See all shows
              </Button>
            </div>
          </div>

          {/* Placeholder media (assets gated — Phase 4 [ASSET]) */}
          <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-border-soft bg-surface p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <SparkStar size={28} />
              <p className="font-display text-2xl text-forest-700">Show photo</p>
              <Tag>Photo — pending</Tag>
            </div>
          </div>
        </div>
      </Container>

      {/* Synopsis + theme / value */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeader as="h2" title="The story" />
            <p className="mt-5 max-w-prose text-lg text-ink">{show.synopsis}</p>
          </div>
          <aside className="flex h-full flex-col gap-3 rounded-2xl border border-border-soft bg-cream p-6">
            <h3 className="font-display text-xl text-forest-800">What it&rsquo;s about</h3>
            <p className="flex items-start gap-2 text-ink">
              <span className="mt-1 shrink-0">
                <SparkStar size={16} />
              </span>
              <span>{show.theme}</span>
            </p>
            <dl className="mt-2 flex flex-col gap-2 text-sm text-ink">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Ages</dt>
                <dd className="font-semibold">{show.ages}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Length</dt>
                <dd className="font-semibold">{show.length}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Section>

      {/* Photo / video — placeholder */}
      <Section>
        <SectionHeader
          as="h2"
          eyebrow="See it in action"
          marker={<SparkStar size={16} />}
          title="Photos & video"
          subtitle="Real photos and video of this show are coming soon."
        />
        <div className="mt-8 flex aspect-video items-center justify-center rounded-2xl border border-border-soft bg-surface text-center">
          <div className="flex flex-col items-center gap-3">
            <SparkStar size={28} />
            <p className="font-display text-xl text-forest-700">Video — pending</p>
            <Tag>Asset pending</Tag>
          </div>
        </div>
      </Section>

      {/* Related shows */}
      <Section tone="surface">
        <SectionHeader
          as="h2"
          eyebrow="More from the repertoire"
          marker={<SparkStar size={16} />}
          title="Related shows"
          subtitle="Other kind tales families and schools love."
        />
        <div className="mt-10">
          <ShowCardGrid shows={relatedShows(show.slug)} />
        </div>
      </Section>

      {/* Areas + from $350 */}
      <Section>
        <div className="flex flex-col gap-6 rounded-2xl border border-border-soft bg-cream p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-display text-2xl text-forest-800">We come to you</p>
            <p className="mt-2 max-w-md text-ink-soft">
              Based in {AREAS.base}; we travel to {AREAS.travel.join(", ")}. Distance is quoted on
              request.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <p className="font-display text-3xl capitalize text-forest-700">{FACTS.priceFrom}</p>
            <Button href="/pricing" variant="secondary">
              See pricing
            </Button>
          </div>
        </div>
      </Section>

      <BookingCTABand
        heading={`Book ${show.title}`}
        sub="Tell us your date and group size — we'll confirm availability and pricing from $350."
      />
    </SiteShell>
  );
}
