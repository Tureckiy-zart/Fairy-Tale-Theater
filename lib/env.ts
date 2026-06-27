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
  /** Telegram bot token — optional secondary booking alert. SECRET, server-only. */
  get telegramBotToken(): string | undefined {
    return process.env.TELEGRAM_BOT_TOKEN || undefined;
  },
  /** Telegram chat id that receives booking notifications (optional). */
  get telegramChatId(): string | undefined {
    return process.env.TELEGRAM_CHAT_ID || undefined;
  },

  // --- Lead pipeline (booking inquiries) -------------------------------------
  /** Owner notification destination (canonical — BRAND.md). Override per deploy. */
  get leadNotifyEmail(): string {
    return process.env.LEAD_NOTIFY_EMAIL || "info@misslanatheatre.com";
  },
  /**
   * Transactional-email delivery webhook (provider-agnostic). A POST to this URL
   * with {to, subject, text} sends the owner notification. Works with Resend/
   * Postmark/SES-relay/a serverless function. Optional: if unset, email delivery
   * is "not configured" and the durable store + Telegram (if set) are the record.
   * SECRET-adjacent (may embed an auth token in the URL) — server-only.
   */
  get leadEmailWebhookUrl(): string | undefined {
    return process.env.LEAD_EMAIL_WEBHOOK_URL || undefined;
  },
  /** Optional bearer token sent as `Authorization: Bearer …` to the email webhook. */
  get leadEmailWebhookToken(): string | undefined {
    return process.env.LEAD_EMAIL_WEBHOOK_TOKEN || undefined;
  },
  /**
   * Directory for the durable lead record (recovery if a provider fails). Defaults
   * to a git-ignored `.leads` dir at the project root. Server-only; never served.
   */
  get leadStoreDir(): string {
    return process.env.LEAD_STORE_DIR || ".leads";
  },
} as const;
