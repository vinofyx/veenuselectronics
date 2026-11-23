import { z } from "zod";
import { ALL_EQUIPMENT, ALL_TV_BRANDS, CLAIM_KEYS } from "@/config/business";

const blank = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v);
const optText = (max: number) =>
  z.preprocess(blank, z.string().trim().max(max).nullable().optional()).transform((v) => v ?? null);
const optUrl = z
  .preprocess(blank, z.string().trim().url("Enter a full https:// link").startsWith("https://", "Link must start with https://").max(500).nullable().optional())
  .transform((v) => v ?? null);

/** Indian or international phone → E.164 (+919876543210). 10-digit Indian numbers get +91. */
export function toE164(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  if (raw.startsWith("+") && /^[1-9]\d{7,14}$/.test(digits)) return `+${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

/** WhatsApp number → digits with country code (919876543210). */
export function toWhatsAppDigits(input: string): string | null {
  const e = toE164(input);
  return e ? e.slice(1) : null;
}

const phoneField = z.preprocess(blank, z.string().nullable().optional()).transform((v, ctx) => {
  if (!v) return null;
  const e = toE164(v);
  if (!e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid phone number, e.g. 98765 43210 or +91 98765 43210" });
    return z.NEVER;
  }
  return e;
});

const whatsappField = z.preprocess(blank, z.string().nullable().optional()).transform((v, ctx) => {
  if (!v) return null;
  const d = toWhatsAppDigits(v);
  if (!d) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid WhatsApp number, e.g. 98765 43210" });
    return z.NEVER;
  }
  return d;
});

const coord = (min: number, max: number) =>
  z.preprocess(blank, z.coerce.number().min(min).max(max).nullable().optional()).transform((v) => (v === undefined ? null : v));

/** Validates the admin "Business details" form. Output maps 1:1 to business_settings columns. */
export const businessSettingsSchema = z.object({
  business_name: optText(80),
  phone: phoneField,
  phone_display: optText(30),
  whatsapp: whatsappField,
  email: z.preprocess(blank, z.string().trim().email("Enter a valid email").max(120).nullable().optional()).transform((v) => v ?? null),
  address_street: optText(160),
  address_locality: optText(80),
  city: optText(60),
  state: optText(60),
  postcode: z.preprocess(blank, z.string().trim().regex(/^[1-9]\d{5}$/, "PIN code must be 6 digits").nullable().optional()).transform((v) => v ?? null),
  latitude: coord(-90, 90),
  longitude: coord(-180, 180),
  maps_url: optUrl,
  reviews_url: optUrl,
  working_hours: optText(120),
  years_experience: z
    .preprocess(blank, z.coerce.number().int("Whole years only").min(0).max(99).nullable().optional())
    .transform((v) => (v === undefined ? null : v)),
  supported_brands: z.array(z.enum(ALL_TV_BRANDS as [string, ...string[]])).min(1, "Select at least one brand"),
  supported_equipment: z.array(z.enum(ALL_EQUIPMENT as [string, ...string[]])).min(1, "Select at least one type of equipment"),
  inspection_charges: optText(300),
  home_visit_available: z.boolean(),
  workshop_repair_available: z.boolean(),
  pickup_delivery_available: z.boolean(),
  warranty_terms: optText(300),
  confirmed_claims: z.record(z.enum(CLAIM_KEYS), z.boolean()),
});

export type BusinessSettingsInput = z.output<typeof businessSettingsSchema>;

/** Converts submitted FormData into the object the schema expects. */
export function businessFormToObject(fd: FormData) {
  const str = (k: string) => {
    const v = fd.get(k);
    return typeof v === "string" ? v : "";
  };
  const claims: Record<string, boolean> = {};
  for (const k of CLAIM_KEYS) claims[k] = fd.get(`claim_${k}`) === "on";
  return {
    business_name: str("business_name"),
    phone: str("phone"),
    phone_display: str("phone_display"),
    whatsapp: str("whatsapp"),
    email: str("email"),
    address_street: str("address_street"),
    address_locality: str("address_locality"),
    city: str("city"),
    state: str("state"),
    postcode: str("postcode"),
    latitude: str("latitude"),
    longitude: str("longitude"),
    maps_url: str("maps_url"),
    reviews_url: str("reviews_url"),
    working_hours: str("working_hours"),
    years_experience: str("years_experience"),
    supported_brands: fd.getAll("supported_brands").filter((v): v is string => typeof v === "string"),
    supported_equipment: fd.getAll("supported_equipment").filter((v): v is string => typeof v === "string"),
    inspection_charges: str("inspection_charges"),
    home_visit_available: fd.get("home_visit_available") === "on",
    workshop_repair_available: fd.get("workshop_repair_available") === "on",
    pickup_delivery_available: fd.get("pickup_delivery_available") === "on",
    warranty_terms: str("warranty_terms"),
    confirmed_claims: claims,
  };
}
