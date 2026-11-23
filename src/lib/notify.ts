import "server-only";
import { absoluteUrl } from "@/config/site";
import { getBusiness } from "./business";

type EnquirySummary = {
  id: string;
  enquiry_number: string;
  customer_name: string;
  mobile_number: string;
  location: string;
  equipment_type?: string | null;
  brand?: string | null;
  model_number?: string | null;
  problem?: string | null;
  problem_description?: string | null;
  service_type?: string | null;
  preferred_date?: string | null;
  photoCount: number;
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Sends a new-enquiry email to the business via Resend. Silently skipped if not configured. */
export async function notifyNewEnquiry(e: EnquirySummary): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!key || !to || !from) return;

  const rows: [string, string | null | undefined][] = [
    ["Enquiry ID", e.enquiry_number],
    ["Name", e.customer_name],
    ["Mobile", e.mobile_number],
    ["Location", e.location],
    ["Equipment", e.equipment_type],
    ["Brand", e.brand],
    ["Model", e.model_number],
    ["Problem", e.problem],
    ["Description", e.problem_description],
    ["Service type", e.service_type],
    ["Preferred date", e.preferred_date],
    ["Photos", e.photoCount ? String(e.photoCount) : null],
  ];
  const adminUrl = absoluteUrl(`/admin/enquiries/${e.id}`);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="color:#12345A;margin:0 0 12px">New repair enquiry ${esc(e.enquiry_number)}</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="color:#555;width:140px;vertical-align:top">${esc(k)}</td><td><strong>${esc(String(v))}</strong></td></tr>`)
          .join("")}
      </table>
      <p><a href="${adminUrl}" style="display:inline-block;background:#F58220;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open in admin</a></p>
      <p style="color:#888;font-size:12px">Reminder: an enquiry is not a confirmed appointment. Contact the customer to confirm.</p>
    </div>`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: `New ${e.equipment_type ?? "repair"} enquiry ${e.enquiry_number} - ${e.customer_name}`,
        html,
        reply_to: (await getBusiness()).email || undefined,
      }),
      signal: controller.signal,
    });
    if (!res.ok) console.error("Resend error", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("notifyNewEnquiry failed", err);
  } finally {
    clearTimeout(timer);
  }
}
