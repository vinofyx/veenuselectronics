/**
 * Enquiry submission logic, independent of Next.js and Supabase so it can be unit tested.
 * The API route (src/app/api/enquiries/route.ts) supplies the real Supabase-backed `deps`.
 */
import { randomUUID } from "crypto";
import { enquirySchema, normaliseMobile, type EnquiryData } from "./validation";
import { MAX_PHOTOS, MAX_PHOTO_BYTES } from "./constants";
import { detectImage, MIME_BY_EXT } from "./image-detect";

export const LIMITS = {
  perIpPerHour: 5,
  perIpPerDay: 15,
  minFillMs: 1500,
  dedupeWindowMs: 15 * 60_000,
};

export type NewEnquiryRow = {
  customer_name: string;
  mobile_number: string;
  email: string | null;
  location: string;
  service_type: string | null;
  equipment_type: string | null;
  brand: string | null;
  model_number: string | null;
  screen_size: string | null;
  problem: string | null;
  problem_description: string | null;
  preferred_date: string | null;
  consent: true;
  source_page: string | null;
  ip_hash: string;
};

export type EnquiryDeps = {
  countSince(ipHash: string, since: Date): Promise<number>;
  findDuplicate(q: { mobile: string; equipment: string | null; problem: string | null; since: Date }): Promise<string | null>;
  insertEnquiry(row: NewEnquiryRow): Promise<{ id: string; enquiry_number: string }>;
  uploadPhoto(path: string, data: Uint8Array, contentType: string): Promise<boolean>;
  insertPhoto(enquiryId: string, path: string): Promise<boolean>;
  notify(summary: NewEnquiryRow & { id: string; enquiry_number: string; photoCount: number }): Promise<void>;
  now?: () => number;
};

export type EnquiryResult = { status: number; body: { enquiryNumber?: string; error?: string; duplicate?: boolean; photos?: number } };

const fail = (status: number, error: string): EnquiryResult => ({ status, body: { error } });

/** Validates and stores one enquiry. `form` is the submitted FormData. */
export async function submitEnquiry(form: FormData, ipHash: string, deps: EnquiryDeps): Promise<EnquiryResult> {
  const now = deps.now?.() ?? Date.now();

  // ---- Spam checks ----
  // Hidden honeypot: only bots fill it -> silent decoy so they learn nothing.
  if (String(form.get("company") ?? "").trim() !== "") {
    return { status: 200, body: { enquiryNumber: `VE-${String(now).slice(-6)}` } };
  }
  // Too fast: could be autofill + instant click by a person, so a visible, recoverable error.
  const elapsed = Number(form.get("elapsed_ms") ?? 0);
  if (!Number.isFinite(elapsed) || elapsed < LIMITS.minFillMs) return fail(400, "Please wait a moment and press Submit again.");

  // ---- Validate fields on the server ----
  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(enquirySchema.shape)) {
    const v = form.get(key);
    if (typeof v === "string") raw[key] = v;
  }
  raw.consent = form.get("consent") === "true";
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) return fail(422, parsed.error.issues[0]?.message ?? "Please check the form and try again.");
  const data: EnquiryData = parsed.data;

  // ---- Validate photos by content, not by name or declared type ----
  const files = form.getAll("photos").filter((f): f is File => typeof f === "object" && f !== null && "arrayBuffer" in f);
  if (files.length > MAX_PHOTOS) return fail(422, `Please upload at most ${MAX_PHOTOS} photos.`);
  const photos: { buf: Uint8Array; ext: keyof typeof MIME_BY_EXT }[] = [];
  for (const f of files) {
    if (f.size === 0) continue;
    if (f.size > MAX_PHOTO_BYTES) return fail(422, "Each photo must be under 5 MB.");
    const buf = new Uint8Array(await f.arrayBuffer());
    const ext = detectImage(buf);
    if (!ext) return fail(422, "Only JPG, PNG, WEBP or HEIC images can be uploaded.");
    photos.push({ buf, ext });
  }

  // ---- Rate limit per hashed IP ----
  const [hour, day] = await Promise.all([
    deps.countSince(ipHash, new Date(now - 3_600_000)),
    deps.countSince(ipHash, new Date(now - 86_400_000)),
  ]);
  if (hour >= LIMITS.perIpPerHour || day >= LIMITS.perIpPerDay) {
    return fail(429, "Too many enquiries from your connection. Please call or WhatsApp us instead.");
  }

  // ---- Duplicate protection ----
  const mobile = normaliseMobile(data.mobile_number);
  const existing = await deps.findDuplicate({
    mobile,
    equipment: data.equipment_type ?? null,
    problem: data.problem ?? null,
    since: new Date(now - LIMITS.dedupeWindowMs),
  });
  if (existing) return { status: 200, body: { enquiryNumber: existing, duplicate: true } };

  // ---- Save ----
  const row: NewEnquiryRow = {
    customer_name: data.customer_name,
    mobile_number: mobile,
    email: data.email ?? null,
    location: data.location,
    service_type: data.service_type ?? null,
    equipment_type: data.equipment_type ?? null,
    brand: data.brand ?? null,
    model_number: data.model_number ?? null,
    screen_size: data.screen_size ?? null,
    problem: data.problem ?? null,
    problem_description: data.problem_description ?? null,
    preferred_date: data.preferred_date ?? null,
    consent: true,
    source_page: data.source_page?.slice(0, 200) ?? null,
    ip_hash: ipHash,
  };
  let saved: { id: string; enquiry_number: string };
  try {
    saved = await deps.insertEnquiry(row);
  } catch (e) {
    console.error("Enquiry insert failed", e);
    return fail(500, "We couldn't save your enquiry. Please try again or contact us directly.");
  }

  // ---- Photos (a failed upload never loses the enquiry) ----
  let uploaded = 0;
  for (const p of photos) {
    const path = `${saved.id}/${randomUUID()}.${p.ext}`;
    if ((await deps.uploadPhoto(path, p.buf, MIME_BY_EXT[p.ext])) && (await deps.insertPhoto(saved.id, path))) uploaded++;
  }

  // ---- Notify (failure must not block the customer) ----
  try {
    await deps.notify({ ...row, ...saved, photoCount: uploaded });
  } catch (e) {
    console.error("notify failed", e);
  }

  return { status: 201, body: { enquiryNumber: saved.enquiry_number, photos: uploaded } };
}
