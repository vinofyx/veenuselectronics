import { NextResponse } from "next/server";
import { getStaff } from "@/lib/auth";
import { applyFilters, cleanFilters } from "@/lib/enquiry-filters";
import { fetchAll } from "@/lib/fetch-all";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLUMNS = [
  "enquiry_number",
  "created_at",
  "status",
  "customer_name",
  "mobile_number",
  "email",
  "location",
  "service_type",
  "equipment_type",
  "brand",
  "model_number",
  "screen_size",
  "problem",
  "problem_description",
  "preferred_date",
  "assigned_technician",
  "diagnosis",
  "estimated_cost",
  "final_cost",
  "parts_used",
  "warranty_details",
  "completed_at",
] as const;

export async function GET(req: Request) {
  const { supabase, staff } = await getStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  if (staff.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const f = cleanFilters(Object.fromEntries(url.searchParams));
  const { rows, error } = await fetchAll<Record<string, unknown>>((from, to) =>
    applyFilters(supabase.from("repair_enquiries").select(COLUMNS.join(",")), f)
      .order("created_at", { ascending: false })
      .range(from, to),
  );
  if (error) return NextResponse.json({ error }, { status: 500 });

  const csv = toCsv(COLUMNS, rows);
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="veenus-enquiries-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
