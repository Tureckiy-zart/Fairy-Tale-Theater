# Quarantine — isolated assets (DO NOT ship to production)

These files were moved out of `public/` so they are **never served on the website**,
but are kept (not deleted) for provenance/review.

- `COMPETITOR-magic-castle-morozko-poster.jpg` — a competitor's show poster. Not ours;
  must not appear on the site (IP + brand reasons).
- `scraped-tilda-assets/` — images whose `tild********__…` filenames are the signature of
  the **Tilda** website builder, i.e. assets pulled from an external/old Tilda site
  (plus `red.jpeg`). Provenance/rights unverified → kept out of `public/`.

If any of these turn out to be owner-owned and cleared, move the specific file back into
`public/images/` and wire it explicitly. Until then it stays here.
