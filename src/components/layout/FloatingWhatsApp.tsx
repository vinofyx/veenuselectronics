"use client";

import { MessageCircle } from "lucide-react";
import { hasWhatsApp, whatsappHref } from "@/config/business";
import { useBusiness } from "../BusinessProvider";
import { TrackedLink } from "../TrackedLink";

/** Floating WhatsApp button (desktop/tablet; mobile uses the sticky action bar). */
export function FloatingWhatsApp() {
  const b = useBusiness();
  if (!hasWhatsApp(b)) return null;
  return (
    <TrackedLink
      href={whatsappHref(b)}
      event="click_whatsapp"
      eventParams={{ location: "floating" }}
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 md:grid"
      aria-label="Chat with Veenus Electronics on WhatsApp (opens in a new tab)"
    >
      <MessageCircle className="h-7 w-7" aria-hidden />
    </TrackedLink>
  );
}
