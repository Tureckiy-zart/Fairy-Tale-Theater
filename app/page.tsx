// Placeholder home — neutral holding page until the real marketing pages are
// built (a separate TUNG task, once copy/IA are ready). The component library
// it will be assembled from lives in components/ui/ and is previewed at /design.
// Intentionally minimal: no final wordmark/illustration (trademark gate, §15).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="font-body text-sm font-semibold uppercase tracking-[0.06em] text-forest-600">
        Coming soon
      </p>
      <h1 className="max-w-2xl font-display text-4xl text-forest-800 sm:text-5xl">
        Miss Lana&rsquo;s Fairy-Tale Theater
      </h1>
      <p className="max-w-md text-lg text-ink-soft">
        A touring children&rsquo;s live-costumed fairy-tale theater. The website is
        being built — stories on their way.
      </p>
    </main>
  );
}
