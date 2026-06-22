// JsonLd — emit a schema.org block as <script type="application/ld+json">.
// Spec: docs/core/04_SEO.md §"Schema.org" (PerformingGroup/LocalBusiness,
// TheaterEvent, BreadcrumbList, FAQPage). Server-safe. No extra deps.
//
// We deliberately avoid React's raw-HTML escape hatch (forbidden by
// scripts/governance.mjs). React does not escape text inside <script>, so the ONLY
// injection risk is a literal "<" / "</script>" sequence in the data — we neutralise
// it by escaping "<" to its JSON unicode form. XSS-safe and lint-clean.

/** A JSON-LD document: a plain serialisable object with an @context. */
export type JsonLdData = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json">{json}</script>;
}
