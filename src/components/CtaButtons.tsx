/** Contact / booking buttons. Server components: only the small tracking link ships JavaScript. */
import { CalendarCheck, MessageCircle, MessageSquare, Phone } from "lucide-react";
import {
  hasPhone,
  hasSecondaryPhone,
  hasWhatsApp,
  hasSecondaryWhatsApp,
  telHref,
  secondaryTelHref,
  whatsappHref,
  secondaryWhatsappHref,
  smsHref,
  secondarySmsHref,
} from "@/config/business";
import { getBusiness } from "@/lib/business";
import { TrackedLink } from "./TrackedLink";

type Variant = "default" | "onDark";

export async function CallButton({
  className = "",
  variant = "default",
  label = "Call Now",
  secondary = false,
}: {
  className?: string;
  variant?: Variant;
  label?: string;
  secondary?: boolean;
}) {
  const b = await getBusiness();
  const phoneActive = secondary ? hasSecondaryPhone(b) : hasPhone(b);
  if (!phoneActive) return null;
  const href = secondary ? secondaryTelHref(b) : telHref(b);
  const display = secondary ? b.phoneSecondaryDisplay || b.phoneSecondary : b.phoneDisplay || b.phone;
  return (
    <TrackedLink
      href={href}
      event="click_call"
      className={`${variant === "onDark" ? "btn-ghost-light" : "btn-primary"} ${className}`}
      aria-label={`${label}${display ? ` - ${display}` : ""}`}
    >
      <Phone className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </TrackedLink>
  );
}

/** `booking` uses the longer "request a repair" template message. */
export async function WhatsAppButton({
  className = "",
  booking = false,
  label = "WhatsApp Us",
  secondary = false,
}: {
  className?: string;
  booking?: boolean;
  label?: string;
  secondary?: boolean;
}) {
  const b = await getBusiness();
  const waActive = secondary ? hasSecondaryWhatsApp(b) : hasWhatsApp(b);
  if (!waActive) return null;
  const msg = booking
    ? `Hello ${b.name}. I would like to request a repair. My enquiry details are: Customer Name, Mobile Number, TV Brand, TV Model, TV Problem and Location.`
    : undefined;
  const href = secondary ? secondaryWhatsappHref(b, msg) : whatsappHref(b, msg);
  return (
    <TrackedLink
      href={href}
      event="click_whatsapp"
      className={`btn-whatsapp ${className}`}
      aria-label={`${label} (opens WhatsApp in a new tab)`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </TrackedLink>
  );
}

export async function SmsButton({
  className = "",
  message,
  label = "Send SMS",
  secondary = false,
}: {
  className?: string;
  message?: string;
  label?: string;
  secondary?: boolean;
}) {
  const b = await getBusiness();
  const phoneActive = secondary ? hasSecondaryPhone(b) : hasPhone(b);
  if (!phoneActive) return null;
  const href = secondary ? secondarySmsHref(b, message) : smsHref(b, message);
  const display = secondary ? b.phoneSecondaryDisplay || b.phoneSecondary : b.phoneDisplay || b.phone;
  return (
    <TrackedLink
      href={href}
      event="click_sms"
      className={`btn-outline ${className}`}
      aria-label={`${label}${display ? ` - ${display}` : ""}`}
    >
      <MessageSquare className="h-4 w-4 text-brand-600" aria-hidden />
      <span>{label}</span>
    </TrackedLink>
  );
}

export function BookButton({ className = "", label = "Book Repair", href = "/book-repair" }: { className?: string; label?: string; href?: string }) {
  return (
    <TrackedLink href={href} event="click_book_repair" className={`btn-accent ${className}`}>
      <CalendarCheck className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </TrackedLink>
  );
}

export function CtaGroup({
  variant = "default",
  bookLabel = "Book TV Repair",
  bookHref,
  waLabel = "WhatsApp Us",
  order = "book-first",
}: {
  variant?: Variant;
  bookLabel?: string;
  bookHref?: string;
  waLabel?: string;
  /** "call-first" puts Call and WhatsApp before Book (used in closing CTAs). */
  order?: "book-first" | "call-first";
}) {
  const book = <BookButton key="book" label={bookLabel} href={bookHref} />;
  const call = <CallButton key="call" variant={variant} />;
  const wa = <WhatsAppButton key="wa" label={waLabel} />;
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{order === "call-first" ? [call, wa, book] : [book, call, wa]}</div>;
}
