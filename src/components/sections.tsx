import Link from "next/link";
import { ClipboardList, ExternalLink, MapPin, PhoneCall, Search, Star, Truck, Wrench } from "lucide-react";
import { fullAddress, hasAddress, hasGeo } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { brands } from "@/content/brands";
import { reviews } from "@/content/reviews";
import { getServiceAreas } from "@/lib/data";

/* ---------------- How it works ---------------- */
export const HOW_IT_WORKS = [
  { icon: ClipboardList, title: "Submit Repair Request", text: "Fill in the short enquiry form, call us or send a WhatsApp message with your TV details." },
  { icon: PhoneCall, title: "Technician Contacts You", text: "We call you to understand the problem and agree on a home visit, workshop repair or pickup." },
  { icon: Search, title: "Inspection and Estimate", text: "The TV is diagnosed and you receive a clear explanation and estimate before any repair." },
  { icon: Wrench, title: "Repair and Testing", text: "After your approval we carry out the repair and test the TV thoroughly." },
  { icon: Truck, title: "Delivery and After-Service", text: "Your TV is returned working, and we remain available for any follow-up questions." },
];

export function HowItWorksSteps() {
  return (
    <ol className="grid gap-5 md:grid-cols-5">
      {HOW_IT_WORKS.map((s, i) => (
        <li key={s.title} className="card relative p-6">
          <span className="absolute right-5 top-5 font-display text-3xl font-bold text-brand-100">{i + 1}</span>
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent-50 text-accent-600">
            <s.icon className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-base font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Brand grid ---------------- */
export async function BrandGrid() {
  const business = await getBusiness();
  const list = brands.filter((x) => business.brands.includes(x.brand));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {list.map((b) => (
        <li key={b.slug}>
          <Link
            href={`/tv-brand-repair/${b.slug}`}
            className="card-hover flex h-20 items-center justify-center px-4 text-center font-display text-lg font-semibold text-brand-800"
          >
            {b.label} TV
          </Link>
        </li>
      ))}
      <li>
        <Link href="/book-repair" className="flex h-20 items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 px-4 text-center text-sm font-semibold text-brand hover:border-brand">
          Other brand? Ask us
        </Link>
      </li>
    </ul>
  );
}

/* ---------------- Reviews ---------------- */
export async function ReviewsBlock() {
  const b = await getBusiness();
  if (reviews.length === 0) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <Star className="mx-auto h-8 w-8 text-accent" aria-hidden />
        <p className="mt-3 font-display text-lg font-semibold text-brand-800">Customer reviews coming soon</p>
        <p className="mt-2 text-sm text-slate-600">
          We only publish genuine reviews from real customers.
          {b.reviewsUrl ? " You can read and leave reviews on our Google Business profile." : ""}
        </p>
        {b.reviewsUrl && (
          <a href={b.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5">
            View reviews on Google <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {reviews.map((r) => (
        <figure key={`${r.name}-${r.date ?? r.text.slice(0, 12)}`} className="card p-6">
          {r.rating && (
            <div className="mb-3 flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < r.rating! ? "fill-accent text-accent" : "text-brand-100"}`} aria-hidden />
              ))}
            </div>
          )}
          <blockquote className="text-sm leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-brand-800">
            {r.name}{" "}
            <span className="font-normal text-slate-500">
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
        {showHeading && <h2 className="mb-4 text-xl font-bold">Areas we serve</h2>}
        {areas.length === 0 ? (
          <p className="text-slate-700">
            Our service areas are being updated. Please{" "}
            <Link href="/contact-us" className="font-semibold text-brand underline">
              contact us
            </Link>{" "}
            or submit an enquiry with your locality and we will confirm whether we can help.
          </p>
        ) : (
          <div className="space-y-5">
            {Object.entries(byCity).map(([city, list]) => (
              <div key={city}>
                <p className="mb-2 font-semibold text-brand-800">{city}</p>
                <ul className="flex flex-wrap gap-2">
                  {list.map((a) => (
                    <li key={a} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-800">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {hasAddress(b) && (
          <div className="mt-6 flex items-start gap-2 border-t border-brand-100 pt-5 text-sm text-slate-700">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>
              <strong className="text-brand-800">Workshop:</strong> {fullAddress(b)}
            </span>
          </div>
        )}
        {b.mapsUrl && (
          <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5">
            <MapPin className="h-4 w-4" aria-hidden /> Get directions on Google Maps
          </a>
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
