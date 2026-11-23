import { STATUS_STYLES, type EnquiryStatus } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status as EnquiryStatus] ?? "bg-gray-100 text-gray-700";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>;
}

export const fmtDate = (d: string | null | undefined, withTime = true) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "-";

export const fmtINR = (n: number | null | undefined) =>
  n === null || n === undefined ? "-" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
