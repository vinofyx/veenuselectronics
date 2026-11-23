"use client";

import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { hasPhone, hasWhatsApp, telHref, whatsappHref } from "@/config/business";
import { useBusiness } from "./BusinessProvider";
import { TrackedLink } from "./TrackedLink";

type Variant = "default" | "onDark";

export function CallButton({ className = "", variant = "default", label = "Call Now" }: { className?: string; variant?: Variant; label?: string }) {
  const b = useBusiness();
  if (!hasPhone(b)) return null;
  return (
    <TrackedLink
      href={telHref(b)}
      event="click_call"
      className={`${variant === "onDark" ? "btn-ghost-light" : "btn-primary"} ${className}`}
      aria-label={`Call ${b.name}${b.phoneDisplay ? ` on ${b.phoneDisplay}` : ""}`}
    >
      <Phone className="h-4 w-4" aria-hidden />
      {label}
    </TrackedLink>
  );
}

/** `booking` uses the longer "request a repair" template message. */
export function WhatsAppButton({ className = "", booking = false, label = "WhatsApp Us" }: { className?: string; booking?: boolean; label?: string }) {
  const b = useBusiness();
  if (!hasWhatsApp(b)) return null;
  const msg = booking
    ? `Hello ${b.name}. I would like to request a repair. My enquiry details are: Customer Name, Mobile Number, TV Brand, TV Model, TV Problem and Location.`
    : undefined;
  return (
    <TrackedLink href={whatsappHref(b, msg)} event="click_whatsapp" className={`btn-whatsapp ${className}`} aria-label="Chat with us on WhatsApp (opens in a new tab)">
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </TrackedLink>
  );
}

export function BookButton({ className = "", label = "Book Repair", href = "/book-repair" }: { className?: string; label?: string; href?: string }) {
  return (
    <TrackedLink href={href} event="click_book_repair" className={`btn-accent ${className}`}>
      <CalendarCheck className="h-4 w-4" aria-hidden />
      {label}
    </TrackedLink>
  );
}

export function CtaGroup({ variant = "default", bookLabel = "Book TV Repair", bookHref }: { variant?: Variant; bookLabel?: string; bookHref?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <BookButton label={bookLabel} href={bookHref} />
      <CallButton variant={variant} />
      <WhatsAppButton />
    </div>
  );
}
