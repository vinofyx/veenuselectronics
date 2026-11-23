import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { fullAddress, hasAddress, hasPhone, hasWhatsApp, telHref, whatsappHref } from "@/config/business";
import { getBusiness } from "@/lib/business";

/** Contact information block - only renders details that are configured. */
export async function ContactCard({ title = "Contact information" }: { title?: string }) {
  const b = await getBusiness();
  const rows = [
    hasPhone(b) && { icon: Phone, label: "Phone", value: b.phoneDisplay, href: telHref(b) },
    hasWhatsApp(b) && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: whatsappHref(b) },
    b.email && { icon: Mail, label: "Email", value: b.email, href: `mailto:${b.email}` },
    hasAddress(b) && { icon: MapPin, label: "Workshop", value: fullAddress(b), href: b.mapsUrl || undefined },
    b.workingHours && { icon: Clock, label: "Working hours", value: b.workingHours },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];

  return (
    <section className="card p-6">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-slate-700">Please use the enquiry form on this page and our team will contact you.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.label} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand">
                <r.icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
                {r.href ? (
                  <a
                    href={r.href}
                    className="font-medium text-brand-800 hover:underline"
                    {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {r.value}
                  </a>
                ) : (
                  <p className="font-medium text-brand-800">{r.value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
