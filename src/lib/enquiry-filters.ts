import { BRANDS, EQUIPMENT_TYPES, STATUSES } from "./constants";

export type EnquiryFilters = {
  q?: string;
  status?: string;
  equipment?: string;
  brand?: string;
  from?: string;
  to?: string;
  page?: string;
};

const isDate = (s?: string) => !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** Sanitises user-supplied filter params into safe values. */
export function cleanFilters(sp: EnquiryFilters) {
  return {
    // strip characters that have meaning in PostgREST filter syntax
    q: (sp.q ?? "").replace(/[,()*%\\:"']/g, " ").trim().slice(0, 60),
    status: (STATUSES as readonly string[]).includes(sp.status ?? "") ? sp.status! : "",
    equipment: (EQUIPMENT_TYPES as readonly string[]).includes(sp.equipment ?? "") ? sp.equipment! : "",
    brand: (BRANDS as readonly string[]).includes(sp.brand ?? "") ? sp.brand! : "",
    from: isDate(sp.from) ? sp.from! : "",
    to: isDate(sp.to) ? sp.to! : "",
    page: Math.max(1, Math.min(10_000, Number.parseInt(sp.page ?? "1", 10) || 1)),
  };
}

export type CleanFilters = ReturnType<typeof cleanFilters>;

/** Methods of the Supabase filter builder used below. */
type Filterable = {
  or(filter: string): Filterable;
  eq(column: string, value: string): Filterable;
  gte(column: string, value: string): Filterable;
  lt(column: string, value: string): Filterable;
};

/** Applies filters to a Supabase query on repair_enquiries. Dates are interpreted in IST. */
export function applyFilters<T>(query: T, f: CleanFilters): T {
  let q = query as unknown as Filterable;
  if (f.q) {
    const digits = f.q.replace(/\D/g, "");
    const parts = [`customer_name.ilike.*${f.q}*`, `enquiry_number.ilike.*${f.q}*`];
    if (digits.length >= 3) parts.push(`mobile_number.ilike.*${digits}*`);
    q = q.or(parts.join(","));
  }
  if (f.status) q = q.eq("status", f.status);
  if (f.equipment) q = q.eq("equipment_type", f.equipment);
  if (f.brand) q = q.eq("brand", f.brand);
  if (f.from) q = q.gte("created_at", `${f.from}T00:00:00+05:30`);
  if (f.to) {
    const end = new Date(`${f.to}T00:00:00+05:30`);
    end.setUTCDate(end.getUTCDate() + 1);
    q = q.lt("created_at", end.toISOString());
  }
  return q as unknown as T;
}

export function filtersToSearch(f: CleanFilters, overrides: Partial<Record<keyof CleanFilters, string | number>> = {}) {
  const params = new URLSearchParams();
  const merged = { ...f, ...overrides } as Record<string, string | number>;
  for (const [k, v] of Object.entries(merged)) {
    if (v === "" || v === undefined || (k === "page" && Number(v) === 1)) continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
