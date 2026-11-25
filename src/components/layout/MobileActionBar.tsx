import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { hasPhone, hasWhatsApp, telHref, whatsappHref } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { TrackedLink } from "../TrackedLink";

/** Sticky bottom bar on phones with the three primary conversion actions. */
export async function MobileActionBar() {
  const b = await getBusiness();
  const cols = 1 + (hasPhone(b) ? 1 : 0) + (hasWhatsApp(b) ? 1 : 0);
  const item = "flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-xl text-[12px] font-semibold active:scale-[0.97] transition-transform";
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 px-3 pt-2 shadow-[0_-8px_24px_-12px_rgba(9,29,51,0.25)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className={`grid gap-2 ${cols === 3 ? "grid-cols-3" : cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {hasPhone(b) && (
          <TrackedLink href={telHref(b)} event="click_call" eventParams={{ location: "mobile_bar" }} className={`${item} bg-brand-800 text-white`} aria-label={`Call Now - ${b.phoneDisplay || b.phone}`}>
            <Phone className="h-[18px] w-[18px]" aria-hidden />
            <span>Call Now</span>
          </TrackedLink>
        )}
        {hasWhatsApp(b) && (
          <TrackedLink
            href={whatsappHref(b)}
            event="click_whatsapp"
            eventParams={{ location: "mobile_bar" }}
            className={`${item} bg-whatsapp-700 text-white`}
            aria-label="Chat on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
            <span>WhatsApp</span>
          </TrackedLink>
        )}
        <TrackedLink href="/book-repair" event="click_book_repair" eventParams={{ location: "mobile_bar" }} className={`${item} bg-accent text-brand-950`}>
          <CalendarCheck className="h-[18px] w-[18px]" aria-hidden />
          <span>Book Repair</span>
        </TrackedLink>
      </div>
    </div>
  );
}
