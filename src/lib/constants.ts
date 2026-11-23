export const SERVICE_TYPES = ["Home Visit", "Workshop Repair", "Pickup and Delivery"] as const;

export const EQUIPMENT_TYPES = [
  "LED TV",
  "LCD TV",
  "Smart TV",
  "OLED TV",
  "QLED TV",
  "Android TV",
  "Home Theatre",
  "Speaker",
  "Amplifier",
  "Projector",
  "Set Top Box",
  "DVD Player",
  "Other",
] as const;

export const BRANDS = [
  "Samsung",
  "LG",
  "Sony",
  "Xiaomi",
  "OnePlus",
  "TCL",
  "Hisense",
  "Panasonic",
  "Haier",
  "Other",
] as const;

export const SCREEN_SIZES = [
  "Below 32 inches",
  "32 inches",
  "40 inches",
  "43 inches",
  "50 inches",
  "55 inches",
  "65 inches",
  "75 inches",
  "Above 75 inches",
  "Not Sure",
] as const;

export const PROBLEMS = [
  "Not Turning ON",
  "Black Screen",
  "Sound But No Picture",
  "Display Lines",
  "Broken Screen",
  "Backlight Problem",
  "Motherboard Problem",
  "Power Supply Problem",
  "WiFi Problem",
  "Software Problem",
  "Other",
] as const;

export const STATUSES = [
  "New",
  "Contacted",
  "Inspection Scheduled",
  "Diagnosing",
  "Estimate Sent",
  "Approved",
  "Repairing",
  "Completed",
  "Delivered",
  "Cancelled",
] as const;

export type EnquiryStatus = (typeof STATUSES)[number];

export const TV_EQUIPMENT = new Set<string>(["LED TV", "LCD TV", "Smart TV", "OLED TV", "QLED TV", "Android TV"]);

export const ADMIN_ROLES = ["admin", "staff"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB each, as received by the server
/** Largest original photo a customer may pick; it is compressed in the browser before upload. */
export const MAX_RAW_PHOTO_BYTES = 15 * 1024 * 1024;
/** Vercel limits request bodies to ~4.5 MB, so the total upload is kept under this. */
export const MAX_TOTAL_UPLOAD_BYTES = 4 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export const STATUS_STYLES: Record<EnquiryStatus, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-indigo-100 text-indigo-800",
  "Inspection Scheduled": "bg-purple-100 text-purple-800",
  Diagnosing: "bg-amber-100 text-amber-800",
  "Estimate Sent": "bg-orange-100 text-orange-800",
  Approved: "bg-teal-100 text-teal-800",
  Repairing: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-gray-200 text-gray-700",
};
