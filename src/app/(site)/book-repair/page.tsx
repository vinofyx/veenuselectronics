import { Camera, CheckCircle2, MapPin, MessageCircle, MessageSquare, Navigation, PhoneCall } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/blocks";
import { getBusiness } from "@/lib/business";
import { allPhones, allSms, allWhatsApps, fullAddress, mapsSearchUrl, serviceTypes, SMS_BOOKING, WHATSAPP_BOOKING } from "@/config/business";
import { TrackedLink } from "@/components/TrackedLink";

export const generateMetadata = () =>
  buildMetadata({
    title: "Book a TV Repair - Call, WhatsApp or Message",
    description: "Book a TV or electronics repair with Veenus Electronics. Connect directly by phone call, WhatsApp or SMS.",
    path: "/book-repair",
  });

const PREPARE = ["TV brand and model number (sticker on the back)", "Screen size", "What happens when you switch it on", "A photo or short video of the problem", "Your locality"];

export default async function BookRepairPage() {
  const b = await getBusiness();
  const addressStr = fullAddress(b);
  const phones = allPhones(b);
  const whatsapps = allWhatsApps(b, WHATSAPP_BOOKING(b));
  const smsList = allSms(b, SMS_BOOKING(b));
  const modes = serviceTypes(b);

  return (
    <>
      <PageHero
        title="Book a TV Repair"
        eyebrow="Direct booking"
        intro="Speak directly to a technician. Call, WhatsApp or SMS with your TV details and we'll arrange the next step - a home visit, workshop repair or pickup."
        breadcrumbs={[{ name: "Book Repair", href: "/book-repair" }]}
        showCtas={false}
        size="compact"
      />

      <section className="relative z-10 -mt-px pb-6 pt-10 sm:pt-14">
        <div className="container">
          <p className="eyebrow mb-3">Choose how to book</p>
          <h2 className="text-display-md">Three ways to reach a technician</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* 1. Call */}
            <article className="card relative flex flex-col overflow-hidden p-7">
              <span className="absolute inset-x-0 top-0 h-1 bg-brand-800" aria-hidden />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-800 text-white">
                <PhoneCall className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-[22px]">Call us</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">Explain the problem to a technician and agree on a home visit, workshop drop-off or pickup.</p>
              <div className="mt-6 space-y-2.5">
                {phones.map((item, idx) => (
                  <TrackedLink
                    key={item.href}
                    href={item.href}
                    event="click_call"
                    eventParams={{ location: "book_page" }}
                    className={idx === 0 ? "btn-primary w-full" : "btn-outline w-full"}
                    aria-label={`Call ${item.display}`}
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden />
                    {idx === 0 ? `Call ${item.display}` : `Alternate: ${item.display}`}
                  </TrackedLink>
                ))}
              </div>
            </article>

            {/* 2. WhatsApp */}
            <article className="card relative flex flex-col overflow-hidden border-whatsapp/40 p-7 ring-1 ring-whatsapp/20">
              <span className="absolute inset-x-0 top-0 h-1 bg-whatsapp" aria-hidden />
              <span className="absolute right-5 top-5 rounded-full bg-whatsapp/10 px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wider text-whatsapp-700">Send photos</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-whatsapp text-white">
                <MessageCircle className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-[22px]">WhatsApp</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">
                Opens a pre-filled booking message. Add photos or a short video of the screen so we can understand the fault.
              </p>
              <div className="mt-6 space-y-2.5">
                {whatsapps.map((item, idx) => (
                  <TrackedLink
                    key={item.href}
                    href={item.href}
                    event="click_whatsapp"
                    eventParams={{ location: "book_page" }}
                    className={idx === 0 ? "btn-whatsapp w-full" : "btn-outline w-full"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={idx === 0 ? `Book on WhatsApp (${item.display})` : `WhatsApp ${item.display}`}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {idx === 0 ? "Book on WhatsApp" : `WhatsApp ${item.display}`}
                  </TrackedLink>
                ))}
              </div>
            </article>

            {/* 3. SMS */}
            <article className="card relative flex flex-col overflow-hidden p-7">
              <span className="absolute inset-x-0 top-0 h-1 bg-accent" aria-hidden />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-white">
                <MessageSquare className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-[22px]">SMS</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">Opens your messaging app with a booking text ready - just add your TV brand and the problem.</p>
              <div className="mt-6 space-y-2.5">
                {smsList.map((item, idx) => (
                  <TrackedLink
                    key={item.href}
                    href={item.href}
                    event="click_sms"
                    eventParams={{ location: "book_page" }}
                    className={idx === 0 ? "btn-accent w-full" : "btn-outline w-full"}
                    aria-label={`Send SMS to ${item.display}`}
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden />
                    {idx === 0 ? "Send SMS" : `SMS ${item.display}`}
                  </TrackedLink>
                ))}
              </div>
            </article>
          </div>

        </div>
      </section>

      <section className="section pt-10">
        <div className="container grid gap-6 lg:grid-cols-2">
          <div className="card p-7">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-50 text-accent-600">
              <Camera className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-5 text-[20px]">Have these ready</h2>
            <ul className="mt-4 space-y-2.5">
              {PREPARE.map((t) => (
                <li key={t} className="flex gap-2.5 text-[14.5px] leading-relaxed text-slate-700">
                  <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0 text-accent-600" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-dark relative overflow-hidden p-7">
            <div className="pointer-events-none absolute inset-0 tech-grid" aria-hidden />
            <div className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-accent">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-5 text-[20px] text-white">Workshop drop-off</h2>
              {addressStr && <p className="mt-3 text-[15px] leading-relaxed text-brand-100">{addressStr}</p>}
              {b.workingHours && <p className="mt-2 text-[14px] text-brand-200">Hours: {b.workingHours}</p>}
              {modes.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {modes.map((m) => (
                    <li key={m} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12.5px] text-brand-100">
                      {m}
                    </li>
                  ))}
                </ul>
              )}
              {addressStr && (
                <a href={mapsSearchUrl(b)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light mt-6">
                  <Navigation className="h-4 w-4" aria-hidden /> Get directions
                </a>
              )}
              <p className="mt-5 text-[13px] text-brand-300">Please call before visiting so we can confirm a technician is available.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
