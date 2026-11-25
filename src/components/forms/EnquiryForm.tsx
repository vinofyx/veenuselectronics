"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef, useState, type ReactNode, type SelectHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Lock, MessageCircle, Phone, X } from "lucide-react";
import {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  MAX_RAW_PHOTO_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  PROBLEMS,
  SCREEN_SIZES,
} from "@/lib/constants";
import { enquirySchema, type EnquiryData, type EnquiryInput } from "@/lib/validation";
import { equipmentOptions, hasPhone, hasWhatsApp, serviceTypes, telHref, whatsappHref } from "@/config/business";
import { useBusiness } from "../BusinessProvider";
import { track } from "@/lib/analytics";

type Prefill = Partial<Pick<EnquiryInput, "equipment_type" | "brand" | "problem">>;

type Props = {
  prefill?: Prefill;
  /** Compact mode shows essential fields first, the rest behind "Add more details". */
  compact?: boolean;
  title?: string;
};

type Result = { enquiryNumber: string; data: EnquiryData; duplicate: boolean };

export function EnquiryForm({ prefill, compact = false, title }: Props) {
  const b = useBusiness();
  const brandOptions = [...b.brands, "Other"];
  const serviceOptions = serviceTypes(b);
  const honeypot = useRef<HTMLInputElement>(null);
  const [showMore, setShowMore] = useState(!compact);
  // Set after mount: a build-time date would differ from the visitor's date and cause a hydration mismatch.
  const [today, setToday] = useState<string | undefined>(undefined);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef<number>(Date.now());
  const formTop = useRef<HTMLDivElement>(null);

  const inFlight = useRef(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      customer_name: "",
      mobile_number: "",
      email: "",
      location: "",
      service_type: "",
      equipment_type: prefill?.equipment_type ?? "",
      brand: prefill?.brand ?? "",
      model_number: "",
      screen_size: "",
      problem: prefill?.problem ?? "",
      problem_description: "",
      preferred_date: "",
      consent: false,
    },
  });

  useEffect(() => {
    const urls = photos.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [photos]);

  function onFiles(list: FileList | null) {
    setPhotoError(null);
    if (!list) return;
    const incoming = Array.from(list);
    const next = [...photos];
    for (const f of incoming) {
      if (next.length >= MAX_PHOTOS) {
        setPhotoError(`You can upload up to ${MAX_PHOTOS} photos.`);
        break;
      }
      if (!ALLOWED_PHOTO_TYPES.includes(f.type)) {
        setPhotoError("Only JPG, PNG, WEBP or HEIC images are allowed.");
        continue;
      }
      if (f.size > MAX_RAW_PHOTO_BYTES) {
        setPhotoError("Each photo must be under 15 MB.");
        continue;
      }
      next.push(f);
    }
    setPhotos(next);
  }

  async function onSubmit(data: EnquiryData) {
    // Guard against double submission (double click / Enter twice) while a request is in flight.
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      await send(data);
    } finally {
      inFlight.current = false;
    }
  }

  async function send(data: EnquiryData) {
    setServerError(null);
    track("enquiry_submit_attempt", { equipment: data.equipment_type, brand: data.brand });

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    fd.set("source_page", typeof window !== "undefined" ? window.location.pathname : "");
    fd.set("elapsed_ms", String(Date.now() - startedAt.current));
    fd.set("company", honeypot.current?.value ?? "");
    let total = 0;
    for (const p of photos) {
      const small = await compressImage(p);
      if (small.size > MAX_PHOTO_BYTES || total + small.size > MAX_TOTAL_UPLOAD_BYTES) {
        setServerError("Your photos are too large to upload together. Please remove one or share them on WhatsApp.");
        return;
      }
      total += small.size;
      fd.append("photos", small, small.name);
    }

    try {
      const res = await fetch("/api/enquiries", { method: "POST", body: fd });
      const json = (await res.json().catch(() => ({}))) as { enquiryNumber?: string; error?: string; duplicate?: boolean };
      if (!res.ok || !json.enquiryNumber) {
        throw new Error(json.error || "Something went wrong. Please try again or contact us directly.");
      }
      track("enquiry_submit_success", { equipment: data.equipment_type, brand: data.brand });
      setResult({ enquiryNumber: json.enquiryNumber, data, duplicate: Boolean(json.duplicate) });
      formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      track("enquiry_submit_error");
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (result) {
    const d = result.data;
    const msg = [
      `Hello ${b.name}. I would like to request a repair.`,
      `Enquiry ID: ${result.enquiryNumber}`,
      `Name: ${d.customer_name}`,
      `Mobile: ${d.mobile_number}`,
      d.equipment_type ? `Equipment: ${d.equipment_type}` : "",
      d.brand ? `Brand: ${d.brand}` : "",
      d.model_number ? `Model: ${d.model_number}` : "",
      d.problem ? `Problem: ${d.problem}` : "",
      `Location: ${d.location}`,
    ]
      .filter(Boolean)
      .join("\n");
    return (
      <div ref={formTop} className="card scroll-mt-28 overflow-hidden" role="status" aria-live="polite">
        <div className="h-1.5 bg-emerald-500" aria-hidden />
        <div className="p-6 sm:p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" aria-hidden />
        </span>
        <h2 className="mt-5 text-[24px]">{result.duplicate ? "We already have your enquiry" : "Enquiry received - thank you!"}</h2>
        {result.duplicate && (
          <p className="mt-2 text-slate-700">You sent the same request a few minutes ago, so we have not created a duplicate.</p>
        )}
        <p className="mt-2 text-slate-700">
          Your enquiry ID is <strong className="font-mono text-brand">{result.enquiryNumber}</strong>. Please keep it for
          reference.
        </p>
        <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <strong>Please note:</strong> this is a repair enquiry, not a confirmed appointment. Our team will contact you
          on <strong>{d.mobile_number}</strong> to discuss the problem and confirm availability.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {hasWhatsApp(b) && (
            <a
              href={whatsappHref(b, msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              onClick={() => track("click_whatsapp", { location: "enquiry_success" })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> Share details on WhatsApp
            </a>
          )}
          {hasPhone(b) && (
            <a href={telHref(b)} className="btn-outline" onClick={() => track("click_call", { location: "enquiry_success" })}>
              <Phone className="h-4 w-4" aria-hidden /> Call us
            </a>
          )}
        </div>
        </div>
      </div>
    );
  }

  const err = (k: keyof EnquiryInput) => errors[k]?.message as string | undefined;
  const inv = (k: keyof EnquiryInput) => (err(k) ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {});

  // Progress across the four required items.
  const values = watch(["customer_name", "mobile_number", "location", "consent"]);
  const done = [
    String(values[0] ?? "").trim().length >= 2,
    /^(?:\+?91|0)?[6-9]\d{9}$/.test(String(values[1] ?? "").replace(/[\s-]/g, "")),
    String(values[2] ?? "").trim().length >= 2,
    Boolean(values[3]),
  ].filter(Boolean).length;
  const errorCount = Object.keys(errors).length;

  return (
    <div ref={formTop} className="card scroll-mt-28 overflow-hidden">
      <div className="border-b border-brand-100 bg-brand-50/60 px-5 py-5 sm:px-7">
        {title && <h2 className="text-[22px]">{title}</h2>}
        <p className="mt-1 text-[14px] text-ink-muted">
          Fields marked <span className="text-red-600">*</span> are required. We&apos;ll call you to confirm.
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12.5px] font-semibold">
            <span className="text-brand-800">Required details</span>
            <span className={done === 4 ? "text-emerald-600" : "text-ink-muted"}>{done} of 4 complete</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100" role="progressbar" aria-label="Required details completed" aria-valuemin={0} aria-valuemax={4} aria-valuenow={done}>
            <div className={`h-full rounded-full transition-all duration-500 ${done === 4 ? "bg-emerald-500" : "bg-accent"}`} style={{ width: `${(done / 4) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-7">
      {errorCount > 0 && (
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-[14px] text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Please check the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} below.
        </p>
      )}
      {/* zodResolver returns the parsed (transformed) values at runtime; the cast reflects that across react-hook-form versions. */}
      <form onSubmit={handleSubmit((values) => onSubmit(values as unknown as EnquiryData))} noValidate className="space-y-4">
        {/* Honeypot - hidden from humans */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="ve-company">Company</label>
          <input ref={honeypot} id="ve-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" required error={err("customer_name")} id="customer_name">
            <input id="customer_name" className="input" autoComplete="name" {...inv("customer_name")} {...register("customer_name")} />
          </Field>
          <Field label="Mobile number" required error={err("mobile_number")} id="mobile_number">
            <input
              id="mobile_number"
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="10-digit mobile"
              {...inv("mobile_number")} {...register("mobile_number")}
            />
          </Field>
        </div>

        <Field label="Your area / locality" required error={err("location")} id="location">
          <input id="location" className="input" autoComplete="address-level3" placeholder="e.g. area, landmark" {...inv("location")} {...register("location")} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Equipment" error={err("equipment_type")} id="equipment_type">
            <Select id="equipment_type" {...inv("equipment_type")} options={equipmentOptions(b)} {...register("equipment_type")} />
          </Field>
          <Field label="Problem" error={err("problem")} id="problem">
            <Select id="problem" {...inv("problem")} options={PROBLEMS} {...register("problem")} />
          </Field>
        </div>

        {!showMore && (
          <button type="button" className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-dashed border-brand-200 text-[14px] font-semibold text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50" onClick={() => setShowMore(true)}>
            + Add more details (brand, model, photos) - optional
          </button>
        )}

        {showMore && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand" error={err("brand")} id="brand">
                <Select id="brand" {...inv("brand")} options={brandOptions} {...register("brand")} />
              </Field>
              <Field label="Screen size" error={err("screen_size")} id="screen_size">
                <Select id="screen_size" {...inv("screen_size")} options={SCREEN_SIZES} {...register("screen_size")} />
              </Field>
              <Field label="Model number" error={err("model_number")} id="model_number">
                <input id="model_number" className="input" placeholder="From the sticker on the back" {...inv("model_number")} {...register("model_number")} />
              </Field>
              {serviceOptions.length > 0 && (
                <Field label="Preferred service" error={err("service_type")} id="service_type">
                  <Select id="service_type" {...inv("service_type")} options={serviceOptions} {...register("service_type")} />
                </Field>
              )}
              <Field label="Email" error={err("email")} id="email">
                <input id="email" className="input" type="email" autoComplete="email" {...inv("email")} {...register("email")} />
              </Field>
              <Field label="Preferred date" error={err("preferred_date")} id="preferred_date">
                <input
                  id="preferred_date"
                  className="input"
                  type="date"
                  min={today}
                  {...inv("preferred_date")} {...register("preferred_date")}
                />
              </Field>
            </div>
            <Field label="Describe the problem" error={err("problem_description")} id="problem_description">
              <textarea
                id="problem_description"
                rows={3}
                className="input"
                placeholder="What happens when you switch it on? Any blinking lights, sounds or error messages?"
                {...inv("problem_description")} {...register("problem_description")}
              />
            </Field>

            <div>
              <span className="label">Photos of the problem (optional, up to {MAX_PHOTOS})</span>
              <div className="flex flex-wrap gap-3">
                {previews.map((src, i) => (
                  <div key={src} className="relative h-20 w-20 overflow-hidden rounded-lg border border-brand-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Selected photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white"
                      aria-label={`Remove photo ${i + 1}`}
                      onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-brand-200 text-brand-600 transition-colors hover:border-accent hover:bg-accent-50">
                    <ImagePlus className="h-6 w-6" aria-hidden />
                    <span className="sr-only">Add photos</span>
                    <input
                      type="file"
                      accept={ALLOWED_PHOTO_TYPES.join(",")}
                      multiple
                      className="sr-only"
                      onChange={(e) => {
                        onFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
              {photoError && <p className="field-error">{photoError}</p>}
            </div>
          </>
        )}

        <div>
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-brand-200 text-accent focus:ring-accent" {...register("consent")} />
            <span>
              I agree that {b.name} may contact me by phone, SMS or WhatsApp about this repair enquiry, and I have read the{" "}
              <Link href="/privacy-policy" className="font-medium text-brand underline" target="_blank">
                Privacy Policy
              </Link>
              . <span className="text-red-600">*</span>
            </span>
          </label>
          {err("consent") && <p className="field-error">{err("consent")}</p>}
        </div>

        {serverError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-700" role="alert">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Your enquiry was not sent.</p>
              <p className="mt-0.5">{serverError} Your details are still filled in - you can try again.</p>
            </div>
          </div>
        )}

        <button type="submit" className="btn-accent min-h-[52px] w-full text-[16px]" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Sending...
            </>
          ) : (
            "Submit Repair Enquiry"
          )}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[12.5px] text-ink-muted">
          <Lock className="h-3.5 w-3.5" aria-hidden /> An enquiry is not a confirmed appointment. We will call to confirm availability.
        </p>
      </form>
      </div>
    </div>
  );
}

/** Resizes an image to max 1600px and re-encodes as JPEG so uploads stay small. Falls back to the original file. */
async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // e.g. HEIC on browsers that cannot decode it
  }
}

function Field({ label, required, error, id, children }: { label: string; required?: boolean; error?: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] }>(
  function Select({ options, ...rest }, ref) {
    return (
      <select ref={ref} className="input" {...rest}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  },
);
