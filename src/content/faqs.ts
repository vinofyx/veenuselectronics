import type { Faq } from "./types";
import type { Business } from "@/config/business";

/** General FAQs. Answers avoid specific prices, timeframes or warranty terms the business has not confirmed. */
export function getGeneralFaqs(b: Business): Faq[] {
  const brands = b.brands;
  const brandList = brands.length > 1 ? `${brands.slice(0, -1).join(", ")} and ${brands[brands.length - 1]}` : brands[0] ?? "most common brands";
  return [
  {
    q: "Is submitting an enquiry the same as a confirmed appointment?",
    a: "No. An enquiry tells us about your TV or device. A member of our team will call or WhatsApp you to discuss the problem and confirm a suitable time and service option.",
  },
  {
    q: "Do you charge for inspection?",
    a: b.inspectionCharges
      ? `${b.inspectionCharges.replace(/\.$/, "")}. We confirm the charge with you before any visit or work takes place.`
      : "Inspection and visit charges, if any, are explained to you when we contact you - before any visit or work takes place.",
  },
  {
    q: "Will I get an estimate before the repair?",
    a: "Yes. After diagnosis we explain the fault and give you an estimate. We only start the repair after you approve it.",
  },
  ...(b.homeVisit
    ? [
        {
          q: "Can you repair my TV at home?",
          a: "Some faults can be fixed at your home. Repairs such as backlight replacement need a clean workshop environment, so the TV may need to come to our workshop. We will advise which option suits your problem.",
        },
      ]
    : []),
  {
    q: "Which TV brands do you repair?",
    a: `We repair ${brandList} televisions. We are an independent repairer and not an authorised service centre of any manufacturer.`,
  },
  {
    q: "My TV is still under manufacturer warranty. Should I contact you?",
    a: "If your TV is under the manufacturer's warranty, contact the manufacturer first. Opening it elsewhere may affect that warranty.",
  },
  {
    q: "What information should I share in the enquiry?",
    a: "Your TV brand, model number (from the sticker on the back), screen size, a short description of the problem and, if possible, a photo of the screen. This helps us prepare and give you more accurate advice.",
  },
  {
    q: "Is a cracked TV screen repairable?",
    a: "A physically cracked panel cannot be repaired - it has to be replaced. Panel replacement is often expensive, sometimes close to the price of a new TV, and depends on availability. We will tell you honestly whether it is worthwhile.",
  },
  {
    q: "Should I try opening my TV to fix it?",
    a: "No. TVs contain power-supply capacitors that can hold a dangerous charge even when unplugged, and the panel is easily damaged. Please leave internal repairs to trained technicians.",
  },
  {
    q: "Do you repair devices other than TVs?",
    a: "Yes - home theatre systems, soundbars, speakers, amplifiers, projectors, DVD players and set top boxes. TV repair is our main speciality.",
  },
];
}
