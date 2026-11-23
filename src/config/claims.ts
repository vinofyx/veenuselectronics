import type { Business } from "./business";

/**
 * Marketing claims for the Trust Bar and "Why Choose Us".
 * Each claim is shown only when confirmed in Admin → Business details
 * (or, for experience and warranty, when those values are filled in).
 */
type Claim = { title: string; text: string; show: boolean };

export function trustItems(b: Business): Claim[] {
  return [
    { title: "Professional TV Repair", text: "TV repair is our core speciality", show: b.claims.professional_tv_repair },
    {
      title: "Multiple TV Brands Supported",
      text: b.brands.slice(0, 4).join(", ") + (b.brands.length > 4 ? " and more" : ""),
      show: b.claims.multiple_brands && b.brands.length > 1,
    },
    { title: "Transparent Estimates", text: "Estimate explained before any work", show: b.claims.transparent_estimates },
    { title: "Customer Support", text: "Call, WhatsApp or enquiry form", show: b.claims.customer_support },
  ].filter((c) => c.show);
}

export function whyChooseItems(b: Business): Claim[] {
  const options = [b.homeVisit && "home visit", b.workshopRepair && "workshop repair", b.pickupDelivery && "pickup"].filter(Boolean).join(", ");
  return [
    {
      title: b.yearsExperience ? `${b.yearsExperience}+ years of experience` : "Experienced technicians",
      text: "TV repair is what we do every day - from backlight strips to main boards.",
      show: Boolean(b.yearsExperience) || b.claims.experienced_technicians,
    },
    {
      title: "Transparent repair estimates",
      text: "We explain the fault in plain language and give you an estimate. Work starts only after you approve.",
      show: b.claims.transparent_estimates,
    },
    {
      title: "Multiple brands supported",
      text: "LED, LCD, Smart, OLED and QLED TVs from the major brands sold in India.",
      show: b.claims.multiple_brands && b.brands.length > 1,
    },
    {
      title: "Quality-tested replacement parts",
      text: "Replacement parts are checked before fitting and the TV is tested after repair.",
      show: b.claims.quality_tested_parts,
    },
    {
      title: "Customer-focused service",
      text: options ? `Choose ${options} depending on the fault and your convenience.` : "We agree the most convenient service option with you.",
      show: b.claims.customer_focused_service,
    },
    { title: "Repair warranty", text: b.warrantyText, show: Boolean(b.warrantyText) },
  ].filter((c) => c.show);
}
