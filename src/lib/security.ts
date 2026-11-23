import "server-only";
import { createHash } from "crypto";

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

let warned = false;
export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT;
  if (!salt && !warned) {
    warned = true;
    console.warn("[veenus] RATE_LIMIT_SALT is not set - IP hashes use a fixed default salt. Set it in production.");
  }
  return createHash("sha256").update(`${salt || "veenus-default-salt"}:${ip}`).digest("hex").slice(0, 32);
}

/** Rejects cross-site form posts. Allows requests with no Origin (some mobile browsers) only if Referer matches. */
export function isSameOrigin(headers: Headers): boolean {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  const origin = headers.get("origin") ?? headers.get("referer");
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
