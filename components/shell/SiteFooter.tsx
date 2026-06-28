"use client";
// SiteFooter — global footer. Spec: SITE_STRUCTURE_AND_BLOCKS.md §2/§3 (click-to-call,
// primary email, travel areas, mini-sitemap, text wordmark, legal). Phosphor icons
// remain the single icon library (DESIGN_SYSTEM §6).
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";
import { BrandWordmark } from "@/components/brand/Wordmark";
import { AREAS, BRAND, EMAIL, FACTS, FOOTER_LINKS, PHONES } from "@/lib/site";
import { track } from "@/lib/analytics";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-soft bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <BrandWordmark />
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Professional live children&rsquo;s theater that comes to you — {FACTS.experience} of
              kind, timeless fairy tales.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              {PHONES.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  onClick={() => track("phone_click", { path: "footer" })}
                  className="inline-flex items-center gap-2 font-body font-semibold text-forest-700 underline-offset-4 hover:underline"
                >
                  <Phone size={18} weight="duotone" aria-hidden className="text-forest-600" />
                  {p.display}
                </a>
              ))}
              <a
                href={EMAIL.href}
                onClick={() => track("email_click", { path: "footer" })}
                className="inline-flex items-center gap-2 font-body font-semibold text-forest-700 underline-offset-4 hover:underline"
              >
                <EnvelopeSimple size={18} weight="duotone" aria-hidden className="text-forest-600" />
                {EMAIL.address}
              </a>
              <p className="mt-1 max-w-xs text-sm text-ink-soft">
                Text, email or WhatsApp anytime. Miss Lana replies within 1–2 business days.
              </p>
            </div>
          </div>

          {/* Mini-sitemap */}
          <nav aria-label="Footer">
            <h2 className="font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-ink-soft underline-offset-4 hover:text-forest-700 hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Areas */}
          <div>
            <h2 className="font-body text-sm font-bold uppercase tracking-[0.06em] text-ink">
              Where we go
            </h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
              <MapPin size={18} weight="duotone" aria-hidden className="mt-0.5 shrink-0 text-forest-600" />
              <span>
                Based in {AREAS.base}; serving {AREAS.region} and traveling to {AREAS.travel.join(", ")}
                {" "}and {AREAS.byRequest.toLowerCase()} by request. We come to you — no public venue.
              </span>
            </p>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 border-t border-border-soft pt-6 text-sm text-ink-soft">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
