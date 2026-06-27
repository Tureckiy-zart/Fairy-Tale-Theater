# Final Show Copy Pack

> `ADAPT_MISS_LANA_LEGACY_SHOW_CONTENT_001` (2026-06-27). The implemented public copy
> for the eight shows + the philosophy surfaces. Source of truth for later media
> selection, metadata refinement, and Svitlana's review. Titles/slugs unchanged.
> Implemented in `lib/shows.ts` (teaser = card · synopsis = detail story · theme =
> values) and the page files noted below.

## Philosophy surfaces

- **Home** (`components/blocks/FormatExplainer.tsx` subtitle): "A story steps out of
  the book, familiar characters come close, and children are invited to feel,
  imagine, laugh, and discover something new together."
- **About** (`app/about/page.tsx` mission): "For Miss Lana, theatre has never been
  only a performance. It is a place where a child can meet courage, kindness,
  friendship, and wonder in a form they can see and feel. For more than 30 years…"
- **Shows hub** (`app/shows/page.tsx`): "Every Miss Lana production begins with a
  familiar fairy-tale feeling and grows into a live, shared adventure…"
- **School Shows** (`app/school-shows/page.tsx` "Kind values & SEL"): "Through the
  choices the characters make, children see friendship in action…"

## Eight shows (card teaser · values theme)

1. **Donkey's Birthday** — *A warm birthday story about friendship, thoughtful
   surprises, and making someone feel truly loved.* · Friendship, mutual respect and
   thoughtful giving.
2. **Little Red Riding Hood** *(provisional)* — *A lively forest adventure where
   courage and a helpful friend outsmart a very confident Wolf.* · Courage, caring for
   others and listening to warnings.
3. **The Bunny's Little House** *(provisional)* — *When Bunny loses a beloved home,
   loyal friends prove that no one has to face trouble alone.* · Friendship, mutual
   help and standing by a friend.
4. **Cinderella** *(alt The Magic Slipper)* — *A gentle Cinderella story in which
   kindness opens a door that cruelty never could.* · Kindness, hope and inner strength.
5. **The Magic Castle** *(provisional)* — *A fairy-tale adventure where friendship and
   helping hands open the way to wonder.* · Friendship, cooperation and shared discovery.
6. **The Winter's Gift** *(alt Father Frost, provisional)* — *A snowy fairy tale where
   kindness and honest work bring warmth even on the coldest day.* · Kindness, hard
   work and patience over envy.
7. **The Gingerbread Man** — *A quick little hero races through the world, certain that
   cleverness can solve everything.* · Listening, caution and thoughtful choices.
8. **Suzy Bee** — *A bright little bee works with care and discovers how much one
   helpful friend can change.* · Kindness, sharing and caring for a community.

Full detail synopses live in `lib/shows.ts`. Per-show plot/title/format confirmations
are in `SHOW_COPY_OWNER_REVIEW.md`; rejected legacy facts in
`LEGACY_CONTENT_PROVENANCE_MATRIX.md`.

## Material departures from the copy seeds

- All synopses **expanded** from the seeds into single flowing paragraphs (the seeds'
  detail-opening + story were merged for one cohesive detail-page read).
- **No team-bio seeds were published** — names/roles only; career details await
  verification (owner-gated).
- Show **format wording removed** everywhere (no "puppet"/"live" per show) to respect
  the owner-confirmation gate; the seeds that mentioned puppets were softened.
- No price beyond "From $350"; no logistics on show pages; current canon facts
  (duration ~1h, contact, geography) kept over legacy facts.
