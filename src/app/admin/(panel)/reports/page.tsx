import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { fetchAll } from "@/lib/fetch-all";
import { fmtINR } from "../StatusBadge";

export const metadata = { title: "Reports" };

type Row = {
  created_at: string;
  completed_at: string | null;
  equipment_type: string | null;
  brand: string | null;
  status: string;
  final_cost: number | string | null;
};

const IST = "Asia/Kolkata";
const istDay = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: IST }); // YYYY-MM-DD
const istMonth = (iso: string) => istDay(iso).slice(0, 7);

function monthBounds(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  const start = new Date(`${ym}-01T00:00:00+05:30`);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const end = new Date(`${next}-01T00:00:00+05:30`);
  return { start, end, daysInMonth: new Date(y, m, 0).getDate(), prev: m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`, next };
}

function shiftMonth(ym: string, delta: number) {
  const [y, m] = ym.split("-").map(Number);
  const idx = y * 12 + (m - 1) + delta;
  return `${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, "0")}`;
}

function tally(rows: Row[], key: (r: Row) => string | null) {
  const map = new Map<string, number>();
  rows.forEach((r) => {
    const k = key(r) || "Not specified";
    map.set(k, (map.get(k) ?? 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({ data, max }: { data: [string, number][]; max?: number }) {
  const top = max ?? Math.max(1, ...data.map((d) => d[1]));
  if (!data.length) return <p className="text-sm text-slate-500">No data for this period.</p>;
  return (
    <ul className="space-y-2">
      {data.map(([label, n]) => (
        <li key={label} className="grid grid-cols-[140px_1fr_40px] items-center gap-3 text-sm">
          <span className="truncate text-slate-700">{label}</span>
          <span className="h-3 rounded-full bg-brand-50">
            <span className="block h-3 rounded-full bg-brand" style={{ width: `${(n / top) * 100}%` }} />
          </span>
          <span className="text-right font-semibold tabular-nums">{n}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { supabase } = await requireStaff("admin");
  const sp = await searchParams;
  const nowYm = istMonth(new Date().toISOString());
  const ym = /^\d{4}-(0[1-9]|1[0-2])$/.test(sp.month ?? "") ? sp.month! : nowYm;
  const b = monthBounds(ym);

  // 12-month window ending with the selected month for trends
  const trendStart = new Date(`${shiftMonth(ym, -11)}-01T00:00:00+05:30`);

  const [{ rows: monthRows }, { rows: trendRows }, { rows: completedRows }] = await Promise.all([
    fetchAll<Row>((from, to) =>
      supabase
        .from("repair_enquiries")
        .select("created_at, completed_at, equipment_type, brand, status, final_cost")
        .gte("created_at", b.start.toISOString())
        .lt("created_at", b.end.toISOString())
        .order("created_at")
        .range(from, to),
    ),
    fetchAll<{ created_at: string }>((from, to) =>
      supabase
        .from("repair_enquiries")
        .select("created_at")
        .gte("created_at", trendStart.toISOString())
        .lt("created_at", b.end.toISOString())
        .order("created_at")
        .range(from, to),
    ),
    fetchAll<Pick<Row, "completed_at" | "final_cost" | "status">>((from, to) =>
      supabase
        .from("repair_enquiries")
        .select("completed_at, final_cost, status")
        .in("status", ["Completed", "Delivered"])
        .gte("completed_at", b.start.toISOString())
        .lt("completed_at", b.end.toISOString())
        .order("completed_at")
        .range(from, to),
    ),
  ]);

  const rows = monthRows;
  const completed = completedRows;
  const revenue = completed.reduce((s, r) => s + (Number(r.final_cost) || 0), 0);

  // Daily
  const daily = new Map<string, number>();
  for (let d = 1; d <= b.daysInMonth; d++) daily.set(`${ym}-${String(d).padStart(2, "0")}`, 0);
  rows.forEach((r) => {
    const k = istDay(r.created_at);
    if (daily.has(k)) daily.set(k, (daily.get(k) ?? 0) + 1);
  });
  const dailyArr = [...daily.entries()];
  const dailyMax = Math.max(1, ...dailyArr.map((d) => d[1]));

  // Weekly (week 1 = days 1-7 ...)
  const weekly: [string, number][] = [];
  dailyArr.forEach(([day, n], i) => {
    const w = Math.floor(i / 7);
    if (!weekly[w]) weekly[w] = [`Week ${w + 1} (${day.slice(8)}-${String(Math.min(b.daysInMonth, (w + 1) * 7)).padStart(2, "0")})`, 0];
    weekly[w][1] += n;
  });

  // Monthly trend
  const monthly = new Map<string, number>();
  for (let i = 11; i >= 0; i--) monthly.set(shiftMonth(ym, -i), 0);
  trendRows.forEach((r) => {
    const k = istMonth(r.created_at);
    if (monthly.has(k)) monthly.set(k, (monthly.get(k) ?? 0) + 1);
  });

  const monthLabel = new Date(`${ym}-15`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-slate-600">{monthLabel} (IST)</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/reports?month=${b.prev}`} className="btn-outline py-2 text-sm">
            &larr; Previous
          </Link>
          <form method="get">
            <input type="month" name="month" defaultValue={ym} className="input py-2" aria-label="Month" />
          </form>
          {ym < nowYm && (
            <Link href={`/admin/reports?month=${b.next}`} className="btn-outline py-2 text-sm">
              Next &rarr;
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Enquiries this month" value={rows.length} />
        <Stat label="TV enquiries" value={rows.filter((r) => r.equipment_type?.includes("TV")).length} />
        <Stat label="Repairs completed" value={completed.length} />
        <Stat label="Revenue (final cost)" value={fmtINR(revenue)} />
      </div>

      <section className="card p-5">
        <h2 className="mb-4 text-lg font-semibold">Daily enquiries</h2>
        <div className="flex h-40 items-end gap-1" role="img" aria-label="Daily enquiries bar chart">
          {dailyArr.map(([day, n]) => (
            <div key={day} className="group relative flex-1">
              <div className="w-full rounded-t bg-brand" style={{ height: `${(n / dailyMax) * 144}px`, minHeight: n ? 4 : 1 }} title={`${day}: ${n}`} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-500">
          <span>1</span>
          <span>{Math.ceil(b.daysInMonth / 2)}</span>
          <span>{b.daysInMonth}</span>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Weekly enquiries</h2>
          <Bars data={weekly} />
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Monthly enquiries (last 12 months)</h2>
          <Bars data={[...monthly.entries()].map(([k, v]) => [new Date(`${k}-15`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }), v])} />
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Repair category breakdown</h2>
          <Bars data={tally(rows, (r) => r.equipment_type)} />
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-semibold">Brand-wise enquiries</h2>
          <Bars data={tally(rows, (r) => r.brand)} />
        </section>
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Status of this month&apos;s enquiries</h2>
          <Bars data={tally(rows, (r) => r.status)} />
        </section>
      </div>
      <p className="text-xs text-slate-500">
        Revenue is the sum of recorded final costs for repairs marked Completed or Delivered during the month.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-brand-800">{value}</p>
    </div>
  );
}
