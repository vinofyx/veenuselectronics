"use client";

import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { hasPhone, hasWhatsApp, telHref, whatsappHref } from "@/config/business";
import { useBusiness } from "../BusinessProvider";
import { TrackedLink } from "../TrackedLink";

/** Sticky bottom bar on mobile with the three primary conversion actions. */
export function MobileActionBar() {
  const b = useBusiness();
  const cols = 1 + (hasPhone(b) ? 1 : 0) + (hasWhatsApp(b) ? 1 : 0);
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 p-2 shadow-[0_-4px_16px_rgba(18,52,90,0.08)] backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className={`grid gap-2 ${cols === 3 ? "grid-cols-3" : cols === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {hasPhone(b) && (
          <TrackedLink href={telHref(b)} event="click_call" eventParams={{ location: "mobile_bar" }} className="btn-primary px-2 py-3 text-sm">
            <Phone className="h-4 w-4" aria-hidden /> Call
          </TrackedLink>
        )}
        {hasWhatsApp(b) && (
          <TrackedLink href={whatsappHref(b)} event="click_whatsapp" eventParams={{ location: "mobile_bar" }} className="btn-whatsapp px-2 py-3 text-sm">
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
          </TrackedLink>
        )}
        <TrackedLink href="/book-repair" event="click_book_repair" eventParams={{ location: "mobile_bar" }} className="btn-accent px-2 py-3 text-sm">
          <CalendarCheck className="h-4 w-4" aria-hidden /> Book Repair
        </TrackedLink>
      </div>
    </div>
  );
}
