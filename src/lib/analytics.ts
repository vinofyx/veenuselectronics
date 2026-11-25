"use client";

type GtagFn = (command: "event" | "config" | "js", target: string | Date, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export type TrackEvent =
  | "click_call"
  | "click_whatsapp"
  | "click_sms"
  | "click_book_repair"
  | "enquiry_submit_attempt"
  | "enquiry_submit_success"
  | "enquiry_submit_error";

/** Sends a GA4 event when GA is configured; otherwise a no-op. */
export function track(event: TrackEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, { page_path: window.location.pathname, ...params });
}
