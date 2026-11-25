import Link from "next/link";
import { ClipboardList, ExternalLink, MapPin, MessageSquareQuote, Navigation, PhoneCall, Search, Wrench } from "lucide-react";
import { fullAddress, hasAddress, hasGeo, mapsSearchUrl } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { brands } from "@/content/brands";
import { reviews } from "@/content/reviews";
import { getServiceAreas } from "@/lib/data";

/* ---------------- How it works ---------------- */
export const HOW_IT_WORKS = [
  { icon: PhoneCall, title: "Contact Us", text: "Call or WhatsApp with your TV brand, model and the problem." },
  { icon: Search, title: "TV Diagnosis", text: "We find the actual fault at home or in our workshop." },
  { icon: ClipboardList, title: "Approve Estimate", text: "You get a clear estimate. Nothing starts without your approval." },
  { icon: Wrench, title: "Repair & Testing", text: "We repair the fault and test the TV before handover." },
];

/** Horizontal timeline on desktop, vertical on mobile. `tone="light"` for dark backgrounds. */
export function HowItWorksSteps({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <ol className="relative grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">
      <span className={`absolute bottom-6 left-[23px] top-6 w-px sm:hidden lg:block lg:left-6 lg:right-6 lg:top-[23px] lg:bottom-auto lg:h-px lg:w-auto ${light ? "bg-white/15" : "bg-brand-200"}`} aria-hidden />
      {HOW_IT_WORKS.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 sm:block">
          <span
            className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-[15px] font-bold ring-4 ${
              i === 0 ? "bg-accent text-brand-950" : light ? "bg-brand-800 text-white ring-brand-900" : "bg-white text-brand-800"
            } ${light ? "ring-brand-900" : "ring-page"} ${i === 0 ? "" : light ? "border border-white/20" : "border border-brand-200"}`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-1 sm:mt-5 sm:pt-0">
                        <h3 className={`text-[17px] ${light ? "text-white" : ""}`}>{s.title}</h3>
            <p className={`mt-2 text-[14.5px] leading-relaxed ${light ? "text-brand-200" : "text-ink-muted"}`}>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Brand grid ---------------- */
export async function BrandGrid({ showNotice = true }: { showNotice?: boolean }) {
  const business = await getBusiness();
  const list = brands.filter((x) => business.brands.includes(x.brand));
  return (
    <div>
      <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-brand-100 bg-brand-100 lg:grid-cols-9">
        {list.map((b) => (
          <li key={b.slug} className="bg-white">
            <Link
              href={`/tv-brand-repair/${b.slug}`}
              className="flex h-20 items-center justify-center px-2 text-center font-display text-[16px] font-bold tracking-tight text-brand-700 transition-colors hover:bg-brand-50 hover:text-accent-600 sm:text-[17px]"
            >
              {b.brand}
            </Link>
          </li>
        ))}
      </ul>
      {showNotice && (
        <p className="mt-4 text-[13px] text-ink-muted">
          Independent repair service &mdash; not an authorised service centre of any manufacturer. Brand names belong to their owners.
        </p>
      )}
    </div>
  );
}

/* ---------------- Reviews ---------------- */
export async function ReviewsBlock() {
  const b = await getBusiness();
  if (reviews.length === 0) {
    return (
      <div className="card mx-auto flex max-w-3xl flex-col items-center gap-5 p-8 text-center sm:flex-row sm:p-10 sm:text-left">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-600">
          <MessageSquareQuote className="h-7 w-7" aria-hidden />
        </span>
        <div className="flex-1">
          <p className="font-display text-[18px] font-bold text-brand-800">We only publish genuine customer reviews</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
            Verified reviews from real customers will appear here.{b.reviewsUrl ? " You can also read and leave reviews on our Google Business profile." : ""}
          </p>
        </div>
        {b.reviewsUrl && (
          <a href={b.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline shrink-0">
            Google reviews <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {reviews.map((r) => (
        <figure key={`${r.name}-${r.date ?? r.text.slice(0, 12)}`} className="card p-7">
          <blockquote className="text-[15px] leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption className="mt-5 text-[14px] font-semibold text-brand-800">
            {r.name}{" "}
            <span className="font-normal text-ink-muted">
              via{" "}
              {r.sourceUrl ? (
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  {r.source}
                </a>
              ) : (
                r.source
              )}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ---------------- Service areas + map ---------------- */
export async function ServiceAreasBlock({ showHeading = false }: { showHeading?: boolean }) {
  const [areas, b] = await Promise.all([getServiceAreas(), getBusiness()]);
  const byCity = areas.reduce<Record<string, string[]>>((acc, a) => {
    (acc[a.city] ??= []).push(a.area_name);
    return acc;
  }, {});
  const hasMapEmbed = hasGeo(b);

  return (
    <div className={`grid gap-6 ${hasMapEmbed ? "lg:grid-cols-2" : ""}`}>
      <div className="card p-6 sm:p-8">
        {showHeading && <h2 className="mb-5 text-[22px]">Areas we serve</h2>}
        {areas.length === 0 ? (
          <p className="leading-relaxed text-slate-700">
            Our list of service localities is being updated. Please{" "}
            <Link href="/contact-us" className="font-semibold text-brand-600 underline underline-offset-4">
              contact us
            </Link>{" "}
            or send an enquiry with your locality and we will confirm whether we can help.
          </p>
        ) : (
          <div className="space-y-5">
            {Object.entries(byCity).map(([city, list]) => (
              <div key={city}>
                <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{city}</p>
                <ul className="flex flex-wrap gap-2">
                  {list.map((a) => (
                    <li key={a} className="rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-[14px] font-medium text-brand-800">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {hasAddress(b) && (
          <div className="mt-6 flex items-start gap-3 border-t border-brand-100 pt-6 text-[15px] text-slate-700">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
            <div>
              <p className="font-semibold text-brand-800">Workshop</p>
              <p className="mt-0.5">{fullAddress(b)}</p>
              <a href={mapsSearchUrl(b)} target="_blank" rel="noopener noreferrer" className="btn-outline mt-4 h-11 text-[14px]">
                <Navigation className="h-4 w-4" aria-hidden /> Get directions
              </a>
            </div>
          </div>
        )}
      </div>
      {hasMapEmbed ? (
        <div className="card overflow-hidden">
          <iframe
            title={`Map showing ${b.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${b.geo.lat},${b.geo.lng}`)}&z=15&output=embed`}
            className="h-full min-h-[320px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
    </div>
  );
}
