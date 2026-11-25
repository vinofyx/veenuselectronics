/**
 * Business details model - safe to import from server AND client code.
 *
 * Source of truth:
 *   1. NEXT_PUBLIC_* environment variables (production verified values)
 *   2. Empty / Unset → the website hides whatever depends on that value.
 * Nothing is invented: there are no hard-coded phone numbers, addresses or claims.
 */
import { BRANDS, EQUIPMENT_TYPES } from "@/lib/constants";

export const CLAIM_KEYS = [
  "professional_tv_repair",
  "multiple_brands",
  "transparent_estimates",
  "customer_support",
  "experienced_technicians",
  "quality_tested_parts",
  "customer_focused_service",
] as const;
export type ClaimKey = (typeof CLAIM_KEYS)[number];

export const CLAIM_LABELS: Record<ClaimKey, string> = {
  professional_tv_repair: "Professional TV repair is our core speciality",
  multiple_brands: "We repair multiple TV brands",
  transparent_estimates: "We give an estimate before any repair work",
  customer_support: "Customers can reach us by call, WhatsApp or SMS",
  experienced_technicians: "Our technicians are experienced (shown with years of experience if set)",
  quality_tested_parts: "Replacement parts are quality-tested before fitting",
  customer_focused_service: "We offer flexible service options (home visit / workshop / pickup)",
};

/** Claims shown before the owner reviews them in the admin. These describe how the brief says the business works. */
export const DEFAULT_CLAIMS: Record<ClaimKey, boolean> = {
  professional_tv_repair: true,
  multiple_brands: true,
  transparent_estimates: true,
  customer_support: true,
  experienced_technicians: false,
  quality_tested_parts: false,
  customer_focused_service: true,
};

export type Business = {
  name: string;
  logoUrl: string;
  phone: string; // E.164, e.g. +919876543210
  phoneDisplay: string;
  phoneSecondary: string;
  phoneSecondaryDisplay: string;
  whatsapp: string; // digits only incl. country code
  whatsappSecondary: string;
  email: string;
  address: { doorNumber: string; street: string; locality: string; city: string; state: string; postcode: string; country: "IN" };
  geo: { lat: number | null; lng: number | null };
  mapsUrl: string;
  reviewsUrl: string;
  workingHours: string;
  yearsExperience: number | null;
  brands: string[]; // supported TV brands (subset of BRANDS, excluding "Other")
  equipment: string[]; // supported equipment (subset of EQUIPMENT_TYPES, excluding "Other")
  inspectionCharges: string; // customer-facing inspection / visit charge policy, "" = explained by phone
  homeVisit: boolean;
  workshopRepair: boolean;
  pickupDelivery: boolean;
  warrantyText: string;
  claims: Record<ClaimKey, boolean>;
};

const env = (v: string | undefined) => (v ?? "").trim();
const num = (v: string) => (v !== "" && Number.isFinite(Number(v)) ? Number(v) : null);

export const ALL_TV_BRANDS: string[] = BRANDS.filter((b) => b !== "Other");
export const ALL_EQUIPMENT: string[] = EQUIPMENT_TYPES.filter((e) => e !== "Other");

/** Business details from NEXT_PUBLIC_* env vars (works on server and client). */
export function envBusiness(): Business {
  const phone = env(process.env.NEXT_PUBLIC_BUSINESS_PHONE);
  const phoneSecondary = env(process.env.NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY);
  const years = env(process.env.NEXT_PUBLIC_YEARS_EXPERIENCE);
  return {
    name: "Veenus Electronics",
    logoUrl: "",
    phone,
    phoneDisplay: env(process.env.NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY) || phone,
    phoneSecondary,
    phoneSecondaryDisplay: env(process.env.NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY_DISPLAY) || phoneSecondary,
    whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, ""),
    whatsappSecondary: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_SECONDARY).replace(/\D/g, ""),
    email: env(process.env.NEXT_PUBLIC_BUSINESS_EMAIL),
    address: {
      doorNumber: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_DOOR),
      street: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_STREET),
      locality: env(process.env.NEXT_PUBLIC_BUSINESS_ADDRESS_LOCALITY),
      city: env(process.env.NEXT_PUBLIC_BUSINESS_CITY),
      state: env(process.env.NEXT_PUBLIC_BUSINESS_STATE),
      postcode: env(process.env.NEXT_PUBLIC_BUSINESS_POSTCODE),
      country: "IN",
    },
    geo: { lat: num(env(process.env.NEXT_PUBLIC_BUSINESS_LAT)), lng: num(env(process.env.NEXT_PUBLIC_BUSINESS_LNG)) },
    mapsUrl: env(process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL),
    reviewsUrl: env(process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL),
    workingHours: env(process.env.NEXT_PUBLIC_WORKING_HOURS),
    yearsExperience: /^\d{1,2}$/.test(years) ? Number(years) : null,
    brands: [...ALL_TV_BRANDS],
    equipment: [...ALL_EQUIPMENT],
    inspectionCharges: "",
    homeVisit: true,
    workshopRepair: true,
    pickupDelivery: true,
    warrantyText: env(process.env.NEXT_PUBLIC_WARRANTY_TEXT),
    claims: { ...DEFAULT_CLAIMS },
  };
}

/** Row shape of public.business_settings (all optional = "not set"). */
export type BusinessSettingsRow = {
  business_name?: string | null;
  logo_url?: string | null;
  phone?: string | null;
  phone_display?: string | null;
  phone_secondary?: string | null;
  phone_secondary_display?: string | null;
  whatsapp?: string | null;
  whatsapp_secondary?: string | null;
  email?: string | null;
  address_door?: string | null;
  address_street?: string | null;
  address_locality?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  maps_url?: string | null;
  reviews_url?: string | null;
  working_hours?: string | null;
  years_experience?: number | null;
  supported_brands?: string[] | null;
  supported_equipment?: string[] | null;
  inspection_charges?: string | null;
  home_visit_available?: boolean | null;
  workshop_repair_available?: boolean | null;
  pickup_delivery_available?: boolean | null;
  warranty_terms?: string | null;
  confirmed_claims?: Partial<Record<string, boolean>> | null;
};

/** Merges a settings row over the env fallback. Pure function - unit tested. */
export function mergeBusiness(base: Business, row: BusinessSettingsRow | null | undefined): Business {
  if (!row) return base;
  const s = (v: string | null | undefined, fb: string) => (v && v.trim() ? v.trim() : fb);
  const n = (v: number | string | null | undefined, fb: number | null) =>
    v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? fb : Number(v);
  const b = (v: boolean | null | undefined, fb: boolean) => (typeof v === "boolean" ? v : fb);
  const phone = s(row.phone, base.phone);
  const phoneSecondary = s(row.phone_secondary, base.phoneSecondary);
  const claims = { ...base.claims };
  for (const k of CLAIM_KEYS) {
    const v = row.confirmed_claims?.[k];
    if (typeof v === "boolean") claims[k] = v;
  }
  const brands =
    Array.isArray(row.supported_brands) && row.supported_brands.length
      ? ALL_TV_BRANDS.filter((x) => row.supported_brands!.includes(x))
      : base.brands;
  const equipment =
    Array.isArray(row.supported_equipment) && row.supported_equipment.length
      ? ALL_EQUIPMENT.filter((x) => row.supported_equipment!.includes(x))
      : base.equipment;
  return {
    name: s(row.business_name, base.name),
    logoUrl: s(row.logo_url, base.logoUrl),
    phone,
    phoneDisplay: s(row.phone_display, row.phone ? phone : base.phoneDisplay),
    phoneSecondary,
    phoneSecondaryDisplay: s(row.phone_secondary_display, row.phone_secondary ? phoneSecondary : base.phoneSecondaryDisplay),
    whatsapp: s(row.whatsapp, base.whatsapp).replace(/\D/g, ""),
    whatsappSecondary: s(row.whatsapp_secondary, base.whatsappSecondary).replace(/\D/g, ""),
    email: s(row.email, base.email),
    address: {
      doorNumber: s(row.address_door, base.address.doorNumber),
      street: s(row.address_street, base.address.street),
      locality: s(row.address_locality, base.address.locality),
      city: s(row.city, base.address.city),
      state: s(row.state, base.address.state),
      postcode: s(row.postcode, base.address.postcode),
      country: "IN",
    },
    geo: { lat: n(row.latitude, base.geo.lat), lng: n(row.longitude, base.geo.lng) },
    mapsUrl: s(row.maps_url, base.mapsUrl),
    reviewsUrl: s(row.reviews_url, base.reviewsUrl),
    workingHours: s(row.working_hours, base.workingHours),
    yearsExperience: n(row.years_experience, base.yearsExperience),
    brands,
    equipment,
    inspectionCharges: s(row.inspection_charges, base.inspectionCharges),
    homeVisit: b(row.home_visit_available, base.homeVisit),
    workshopRepair: b(row.workshop_repair_available, base.workshopRepair),
    pickupDelivery: b(row.pickup_delivery_available, base.pickupDelivery),
    warrantyText: s(row.warranty_terms, base.warrantyText),
    claims,
  };
}

/* ---------------- Helpers ---------------- */
export const hasPhone = (b: Business) => b.phone.length > 0;
export const hasSecondaryPhone = (b: Business) => Boolean(b.phoneSecondary && b.phoneSecondary.length > 0);
export const hasWhatsApp = (b: Business) => b.whatsapp.length >= 10;
export const hasSecondaryWhatsApp = (b: Business) => Boolean(b.whatsappSecondary && b.whatsappSecondary.length >= 10);
export const hasAddress = (b: Business) => Boolean(b.address.street || b.address.locality || b.address.doorNumber);
export const hasGeo = (b: Business) => b.geo.lat !== null && b.geo.lng !== null;

export function telHref(b: Business) {
  return hasPhone(b) ? `tel:${b.phone.replace(/[^\d+]/g, "")}` : "/contact-us";
}

export function secondaryTelHref(b: Business) {
  return hasSecondaryPhone(b) ? `tel:${b.phoneSecondary.replace(/[^\d+]/g, "")}` : "/contact-us";
}

export function allPhones(b: Business): { number: string; display: string; href: string }[] {
  const items: { number: string; display: string; href: string }[] = [];
  if (hasPhone(b)) {
    items.push({ number: b.phone, display: b.phoneDisplay || b.phone, href: telHref(b) });
  }
  if (hasSecondaryPhone(b)) {
    items.push({
      number: b.phoneSecondary,
      display: b.phoneSecondaryDisplay || b.phoneSecondary,
      href: secondaryTelHref(b),
    });
  }
  return items;
}

export const WHATSAPP_GENERAL = () => "Hello Veenus Electronics, I need help with a TV repair.";
export const WHATSAPP_BOOKING = (b: Business) =>
  `Hello ${b.name}. I would like to request a repair. My enquiry details are: Customer Name, Mobile Number, TV Brand, TV Model, TV Problem and Location.`;

export function whatsappHref(b: Business, message?: string) {
  if (!hasWhatsApp(b)) return "/contact-us";
  return `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(message ?? WHATSAPP_GENERAL())}`;
}

export function secondaryWhatsappHref(b: Business, message?: string) {
  if (!hasSecondaryWhatsApp(b)) return "/contact-us";
  return `https://wa.me/${b.whatsappSecondary}?text=${encodeURIComponent(message ?? WHATSAPP_GENERAL())}`;
}

export function allWhatsApps(b: Business, message?: string): { number: string; display: string; href: string }[] {
  const items: { number: string; display: string; href: string }[] = [];
  const msg = message ?? WHATSAPP_GENERAL();
  if (hasWhatsApp(b)) {
    items.push({
      number: b.whatsapp,
      display: b.phoneDisplay || `+${b.whatsapp}`,
      href: whatsappHref(b, msg),
    });
  }
  if (hasSecondaryWhatsApp(b)) {
    items.push({
      number: b.whatsappSecondary,
      display: b.phoneSecondaryDisplay || `+${b.whatsappSecondary}`,
      href: secondaryWhatsappHref(b, msg),
    });
  }
  return items;
}

export const SMS_BOOKING = (b: Business) =>
  `Hello ${b.name}, I want to book a TV repair. My TV brand and issue are:`;

export function smsHref(b: Business, message?: string) {
  if (!hasPhone(b)) return "/contact-us";
  const num = b.phone.replace(/[^\d+]/g, "");
  const body = encodeURIComponent(message ?? SMS_BOOKING(b));
  return `sms:${num}?body=${body}`;
}

export function secondarySmsHref(b: Business, message?: string) {
  if (!hasSecondaryPhone(b)) return "/contact-us";
  const num = b.phoneSecondary.replace(/[^\d+]/g, "");
  const body = encodeURIComponent(message ?? SMS_BOOKING(b));
  return `sms:${num}?body=${body}`;
}

export function allSms(b: Business, message?: string): { number: string; display: string; href: string }[] {
  const items: { number: string; display: string; href: string }[] = [];
  const msg = message ?? SMS_BOOKING(b);
  if (hasPhone(b)) {
    items.push({
      number: b.phone,
      display: b.phoneDisplay || b.phone,
      href: smsHref(b, msg),
    });
  }
  if (hasSecondaryPhone(b)) {
    items.push({
      number: b.phoneSecondary,
      display: b.phoneSecondaryDisplay || b.phoneSecondary,
      href: secondarySmsHref(b, msg),
    });
  }
  return items;
}

export function fullAddress(b: Business) {
  const a = b.address;
  if (!a.street && !a.locality && !a.doorNumber) return "";
  const parts = [
    a.doorNumber,
    a.street,
    a.locality,
    a.postcode ? `PIN ${a.postcode.replace(/^PIN\s*/i, "")}` : "",
    "India",
  ].filter(Boolean);
  return parts.join(", ");
}

export function mapsSearchUrl(b: Business): string {
  if (b.mapsUrl) return b.mapsUrl;
  const addr = fullAddress(b);
  if (!addr) return "https://www.google.com/maps";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

/** " in Hyderabad" when a city is configured, otherwise "". */
export const inCity = (b: Business) => (b.address.city ? ` in ${b.address.city}` : "");

/** Service options the business has enabled, in the booking form's order. */
export function serviceTypes(b: Business): string[] {
  return [b.homeVisit && "Home Visit", b.workshopRepair && "Workshop Repair", b.pickupDelivery && "Pickup and Delivery"].filter(
    Boolean,
  ) as string[];
}

export function serviceOptionsSentence(b: Business) {
  const parts = [b.homeVisit && "home visit", b.workshopRepair && "workshop", b.pickupDelivery && "pickup"].filter(Boolean) as string[];
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase() + parts[0].slice(1) + " service";
  const last = parts.pop()!;
  const s = `${parts.join(", ")} or ${last}`;
  return s[0].toUpperCase() + s.slice(1);
}

/* ---------------- Equipment-dependent pages ---------------- */
/** Which equipment type each page advertises. Pages for unsupported equipment are hidden (404, not in sitemap/menus). */
export const PAGE_EQUIPMENT: Record<string, string> = {
  "/tv-repair/led-tv-repair": "LED TV",
  "/tv-repair/lcd-tv-repair": "LCD TV",
  "/tv-repair/smart-tv-repair": "Smart TV",
  "/tv-repair/oled-tv-repair": "OLED TV",
  "/tv-repair/qled-tv-repair": "QLED TV",
  "/tv-repair/android-tv-repair": "Android TV",
  "/electronics-repair/home-theatre-repair": "Home Theatre",
  "/electronics-repair/speaker-repair": "Speaker",
  "/electronics-repair/amplifier-repair": "Amplifier",
  "/electronics-repair/projector-repair": "Projector",
  "/electronics-repair/dvd-player-repair": "DVD Player",
  "/electronics-repair/set-top-box-repair": "Set Top Box",
};

const BRAND_PAGES: Record<string, string> = {
  "/tv-brand-repair/samsung-tv-repair": "Samsung",
  "/tv-brand-repair/lg-tv-repair": "LG",
  "/tv-brand-repair/sony-tv-repair": "Sony",
  "/tv-brand-repair/mi-tv-repair": "Xiaomi",
  "/tv-brand-repair/oneplus-tv-repair": "OnePlus",
  "/tv-brand-repair/tcl-tv-repair": "TCL",
  "/tv-brand-repair/hisense-tv-repair": "Hisense",
  "/tv-brand-repair/panasonic-tv-repair": "Panasonic",
  "/tv-brand-repair/haier-tv-repair": "Haier",
};

/** True if the page at `path` should be shown, given the supported equipment and brands. */
export function isPathOffered(b: Business, path: string): boolean {
  const eq = PAGE_EQUIPMENT[path];
  if (eq && !b.equipment.includes(eq)) return false;
  const brand = BRAND_PAGES[path];
  if (brand && !b.brands.includes(brand)) return false;
  return true;
}

/** Equipment options for the booking form ("Other" always available). */
export const equipmentOptions = (b: Business) => [...b.equipment, "Other"];
