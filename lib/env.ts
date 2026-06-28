// Centralised, lazy environment access — the ONLY place that reads process.env
// (enforced by scripts/governance.mjs). Pattern: security/lazy-env-reader.md.
//
// Each getter is evaluated on first access, never at import/build time, and a
// required var fails with a named error instead of a silent undefined. Keys
// mirror .env.example; secrets (Telegram bot token) live here and must never be
// logged or shipped to the client — read them only in server code / route
// handlers, never in a "use client" component.

export const env = {
  /** Public site origin — used for canonical URLs, sitemap, OG tags. */
  get baseUrl(): string {
    return process.env.APP_BASE_URL ?? "http://localhost:3000";
  },
  /** True in production builds/runtime. Used to gate internal-only routes (e.g. /design). */
  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },
  /**
   * Google Maps Platform key (maps / service-area — planned, per docs/reports scoping).
   * Optional: not consumed yet. Returns undefined when unset (never throws) so it can
   * never crash a render before the feature is wired.
   */
  get googleMapsApiKey(): string | undefined {
    return process.env.GOOGLE_MAPS_API_KEY || undefined;
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
  /**
   * MongoDB Atlas connection string — the DURABLE production store for booking
   * inquiries (the system of record). SECRET, server-only: never log it, never import
   * it from a "use client" module. Lazy by design — read only inside a request, so a
   * build with no MONGODB_URI succeeds and a request with none fails cleanly (the
   * route falls back to the email webhook as the acceptance signal; see lib/leadStore).
   * Returns undefined when unset (the store reports a clean error, never throws here).
   */
  get mongodbUri(): string | undefined {
    return process.env.MONGODB_URI || undefined;
  },
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
   * On a read-only/serverless filesystem the pipeline falls back to a temp dir and
   * relies on the email webhook as the acceptance signal (see lib/notify).
   */
  get leadStoreDir(): string {
    return process.env.LEAD_STORE_DIR || ".leads";
  },
  /**
   * Optional trusted header to read the client IP from for rate-limiting (platform-
   * specific, e.g. an edge/proxy header). When unset, the limiter uses the LAST
   * X-Forwarded-For entry (appended by the nearest proxy), never the first
   * (client-controlled, spoofable). Best-effort only — see security/SECURITY.md.
   */
  get leadTrustedIpHeader(): string | undefined {
    return process.env.LEAD_TRUSTED_IP_HEADER || undefined;
  },
  /**
   * Max booking submissions per IP per 60 s window (in-memory limiter). Defaults to 5
   * in production. Overridable only so the e2e harness (one shared localhost IP across
   * a parallel suite) isn't throttled — never raise it in real deployments.
   */
  get leadRateLimitPerMinute(): number {
    const n = Number(process.env.LEAD_RATE_LIMIT_PER_MINUTE);
    return Number.isInteger(n) && n > 0 ? n : 5;
  },
} as const;
