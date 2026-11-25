import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { allPhones, allWhatsApps, fullAddress, hasAddress, mapsSearchUrl } from "@/config/business";
import { getBusiness } from "@/lib/business";

/** Contact information block - verified business contact details with working actions. */
export async function ContactCard({ title = "Contact information" }: { title?: string }) {
  const b = await getBusiness();
  const phones = allPhones(b);
  const whatsapps = allWhatsApps(b);
  const mapsUrl = mapsSearchUrl(b);

  return (
    <section className="card p-6 sm:p-8">
      <h2 className="text-[24px]">{title}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {phones.length > 0 && (
          <Tile icon={<Phone className="h-5 w-5" aria-hidden />} label="Phone" tone="brand">
            {phones.map((p) => (
              <a key={p.number} href={p.href} className="block font-display text-[17px] font-bold text-brand-800 hover:text-accent-600">
                {p.display}
              </a>
            ))}
          </Tile>
        )}
        {whatsapps.length > 0 && (
          <Tile icon={<MessageCircle className="h-5 w-5" aria-hidden />} label="WhatsApp" tone="whatsapp">
            {whatsapps.map((w) => (
              <a key={w.number} href={w.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-brand-800 hover:text-whatsapp-700">
                Chat on {w.display} <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted" aria-hidden />
              </a>
            ))}
          </Tile>
        )}
        {b.email && (
          <Tile icon={<Mail className="h-5 w-5" aria-hidden />} label="Email" tone="brand">
            <a href={`mailto:${b.email}`} className="break-all font-semibold text-brand-800 hover:text-accent-600">
              {b.email}
            </a>
          </Tile>
        )}
        {b.workingHours && (
          <Tile icon={<Clock className="h-5 w-5" aria-hidden />} label="Working hours" tone="brand">
            <p className="font-semibold text-brand-800">{b.workingHours}</p>
          </Tile>
        )}
        {hasAddress(b) && (
          <div className="sm:col-span-2">
            <Tile icon={<MapPin className="h-5 w-5" aria-hidden />} label="Workshop address" tone="accent">
              <p className="font-medium leading-relaxed text-brand-800">{fullAddress(b)}</p>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 h-10 min-h-0 px-4 text-[13.5px]">
                <Navigation className="h-4 w-4" aria-hidden /> Get directions
              </a>
            </Tile>
          </div>
        )}
      </div>
    </section>
  );
}

function Tile({ icon, label, tone, children }: { icon: ReactNode; label: string; tone: "brand" | "accent" | "whatsapp"; children: ReactNode }) {
  const t = { brand: "bg-brand-800 text-white", accent: "bg-accent text-white", whatsapp: "bg-whatsapp text-white" }[tone];
  return (
    <div className="flex h-full gap-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${t}`}>{icon}</span>
      <div className="min-w-0 space-y-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
        {children}
      </div>
    </div>
  );
}
