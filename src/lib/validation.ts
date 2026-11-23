import { z } from "zod";
import { BRANDS, EQUIPMENT_TYPES, PROBLEMS, SCREEN_SIZES, SERVICE_TYPES } from "./constants";

/** Indian mobile number: optional +91 / 0 prefix, then 10 digits starting 6-9. */
const INDIAN_MOBILE = /^(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}$/;

export function normaliseMobile(input: string) {
  const digits = input.replace(/\D/g, "");
  const ten = digits.slice(-10);
  return `+91${ten}`;
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .union([z.enum(values), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined));

export const enquirySchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  mobile_number: z
    .string()
    .trim()
    .regex(INDIAN_MOBILE, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .union([z.string().trim().email("Enter a valid email address").max(120), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  location: z.string().trim().min(2, "Please enter your area or locality").max(160),
  service_type: optionalEnum(SERVICE_TYPES),
  equipment_type: optionalEnum(EQUIPMENT_TYPES),
  brand: optionalEnum(BRANDS),
  model_number: optionalText(60),
  screen_size: optionalEnum(SCREEN_SIZES),
  problem: optionalEnum(PROBLEMS),
  problem_description: optionalText(1500),
  preferred_date: z
    .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"), z.literal("")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree so we can contact you about this repair",
  }),
  source_page: optionalText(200),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;
