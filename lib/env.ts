// Centralised, lazy environment access — the ONLY place that reads process.env
// (enforced by scripts/governance.mjs). Pattern: security/lazy-env-reader.md.
//
// Each getter is evaluated on first access, never at import/build time, and a
// required var fails with a named error instead of a silent undefined. Keys
// mirror .env.example; secrets (Telegram bot token) live here and must never be
// logged or shipped to the client — read them only in server code / route
// handlers, never in a "use client" component.

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  /** Public site origin — used for canonical URLs, sitemap, OG tags. */
  get baseUrl(): string {
    return process.env.APP_BASE_URL ?? "http://localhost:3000";
  },
  /** Google Maps Platform key (maps / service-area, per docs/reports scoping). */
  get googleMapsApiKey(): string {
    return required("GOOGLE_MAPS_API_KEY");
  },
  /** Google Search Console verification token (SEO, docs/core/04_SEO.md). */
  get googleSiteVerification(): string | undefined {
    return process.env.GOOGLE_SITE_VERIFICATION;
  },
  /** Telegram bot token — booking-form notifications. SECRET, server-only. */
  get telegramBotToken(): string {
    return required("TELEGRAM_BOT_TOKEN");
  },
  /** Telegram chat id that receives booking notifications. */
  get telegramChatId(): string {
    return required("TELEGRAM_CHAT_ID");
  },
} as const;
