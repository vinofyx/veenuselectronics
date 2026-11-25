import { MessageCircle } from "lucide-react";
import { hasWhatsApp, whatsappHref } from "@/config/business";
import { getBusiness } from "@/lib/business";
import { TrackedLink } from "../TrackedLink";

/** Floating WhatsApp button (tablet/desktop; phones use the bottom action bar). */
export async function FloatingWhatsApp() {
  const b = await getBusiness();
  if (!hasWhatsApp(b)) return null;
  return (
    <TrackedLink
      href={whatsappHref(b)}
      event="click_whatsapp"
      eventParams={{ location: "floating" }}
      className="group fixed bottom-6 right-6 z-40 hidden h-14 items-center gap-2 rounded-full bg-whatsapp-700 pl-4 pr-4 text-white shadow-float transition-all duration-300 hover:bg-whatsapp-800 hover:pr-5 focus:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/40 md:inline-flex"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle className="h-6 w-6 shrink-0" aria-hidden />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[120px] group-hover:opacity-100">
        WhatsApp us
      </span>
    </TrackedLink>
  );
}
