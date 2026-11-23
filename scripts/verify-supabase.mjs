#!/usr/bin/env node
/**
 * Live verification of a real Supabase project (no npm dependencies - Node 18+).
 *
 * Checks RLS, admin/staff auth, column privileges, business settings, private photo storage,
 * public sign-ups, and (optionally, via the deployed site) enquiry insert, photo upload,
 * duplicate protection and rate limiting. Creates clearly-labelled test rows and deletes them.
 *
 * USE A TEST PROJECT WHEREVER POSSIBLE. If run against production it only adds and removes
 * rows named "ZZ Verification Test".
 *
 * Required env:  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 * Optional env:  TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, TEST_STAFF_EMAIL, TEST_STAFF_PASSWORD
 *                SITE_URL (e.g. https://your-preview.vercel.app) for the API checks
 * Flags:         --rate-limit  also submit 6 enquiries to confirm the per-IP limit
 *                              (blocks your IP's enquiries for 1 hour - test projects only)
 *
 * Usage:  node scripts/verify-supabase.mjs
 */

const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, "");
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE = process.env.SITE_URL?.replace(/\/$/, "");
const RATE = process.argv.includes("--rate-limit");
const TAG = "ZZ Verification Test";

if (!URL_ || !ANON || !SERVICE) {
  console.error("Missing SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY - nothing was tested.");
  process.exit(2);
}

const results = [];
const created = { enquiries: [], files: [] };
const pass = (name, detail = "") => (results.push({ ok: true, name }), console.log(`  PASS  ${name}${detail ? `  (${detail})` : ""}`));
const fail = (name, detail = "") => (results.push({ ok: false, name }), console.log(`  FAIL  ${name}${detail ? `  (${detail})` : ""}`));
const skip = (name, why) => (results.push({ ok: null, name }), console.log(`  SKIP  ${name}  (${why})`));
const check = (cond, name, detail) => (cond ? pass(name, detail) : fail(name, detail));

const hdr = (key, token = key, extra = {}) => ({ apikey: key, Authorization: `Bearer ${token}`, ...extra });
async function rest(path, { key = ANON, token, method = "GET", body, prefer } = {}) {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: hdr(key, token ?? key, { "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) }),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  return { status: res.status, json };
}
async function signIn(email, password) {
  const res = await fetch(`${URL_}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const j = await res.json().catch(() => ({}));
  return res.ok ? j.access_token : null;
}
// 1x1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");

async function main() {
  console.log(`\nVerifying Supabase project ${new URL(URL_).host}\n`);

  // ---------- 1. Schema / migrations ----------
  console.log("1. Migrations");
  for (const t of ["repair_enquiries", "repair_photos", "repair_status_history", "admin_users", "service_categories", "service_areas", "business_settings"]) {
    const r = await rest(`${t}?select=*&limit=1`, { key: SERVICE });
    check(r.status === 200, `table ${t} exists`, r.status === 200 ? "" : `HTTP ${r.status}`);
  }
  const bs = await rest("business_settings?select=id", { key: SERVICE });
  check(bs.status === 200 && bs.json?.length === 1, "business_settings has exactly one row (migration 2 applied)");

  // ---------- 2. Anonymous access ----------
  console.log("\n2. Anonymous visitor (anon key)");
  const anonEnq = await rest("repair_enquiries?select=id&limit=5");
  check(anonEnq.status === 200 && anonEnq.json.length === 0, "anon cannot read enquiries");
  const anonStaff = await rest("admin_users?select=id&limit=5");
  check(anonStaff.status === 200 && anonStaff.json.length === 0, "anon cannot read staff list");
  const anonIns = await rest("repair_enquiries", { method: "POST", body: { customer_name: TAG, mobile_number: "+919000000001", location: "Test Area" } });
  check(anonIns.status === 401 || anonIns.status === 403, "anon cannot insert enquiries directly", `HTTP ${anonIns.status}`);
  const anonBs = await rest("business_settings?select=id");
  check(anonBs.status === 200 && anonBs.json.length === 1, "anon can read public business settings");
  const anonRpc = await rest("rpc/enquiry_count_since", { method: "POST", body: { p_ip_hash: "x", p_since: new Date().toISOString() } });
  check(anonRpc.status === 401 || anonRpc.status === 403 || anonRpc.status === 404, "anon cannot call the rate-limit function", `HTTP ${anonRpc.status}`);

  // ---------- 3. Server (service role) ----------
  console.log("\n3. Server insert (service role)");
  const ins = await rest("repair_enquiries?select=id,enquiry_number,status", {
    key: SERVICE,
    method: "POST",
    prefer: "return=representation",
    body: { customer_name: TAG, mobile_number: "+919000000001", location: "Test Area", consent: true, ip_hash: "zz-verify", equipment_type: "LED TV", problem: "Black Screen" },
  });
  const enq = Array.isArray(ins.json) ? ins.json[0] : null;
  check(ins.status === 201 && /^VE-\d{6}-\d{4,}$/.test(enq?.enquiry_number ?? ""), "enquiry inserted with VE-YYMMDD-#### number", enq?.enquiry_number);
  if (enq) created.enquiries.push(enq.id);
  const rpc = await rest("rpc/enquiry_count_since", { key: SERVICE, method: "POST", body: { p_ip_hash: "zz-verify", p_since: new Date(Date.now() - 3600e3).toISOString() } });
  check(rpc.status === 200 && Number(rpc.json) >= 1, "rate-limit counter works for the server", `count=${rpc.json}`);

  // ---------- 4. Private storage ----------
  console.log("\n4. Private photo storage");
  let photoPath = null;
  if (enq) {
    photoPath = `${enq.id}/zz-verify.png`;
    const up = await fetch(`${URL_}/storage/v1/object/repair-photos/${photoPath}`, {
      method: "POST",
      headers: hdr(SERVICE, SERVICE, { "Content-Type": "image/png" }),
      body: PNG,
    });
    check(up.ok, "server can upload to repair-photos", `HTTP ${up.status}`);
    if (up.ok) created.files.push(photoPath);
    const pub = await fetch(`${URL_}/storage/v1/object/public/repair-photos/${photoPath}`);
    check(!pub.ok, "photo is NOT publicly downloadable", `HTTP ${pub.status}`);
    const anonSign = await fetch(`${URL_}/storage/v1/object/sign/repair-photos/${photoPath}`, {
      method: "POST",
      headers: hdr(ANON, ANON, { "Content-Type": "application/json" }),
      body: JSON.stringify({ expiresIn: 60 }),
    });
    check(!anonSign.ok, "anon cannot create a signed photo URL", `HTTP ${anonSign.status}`);
    const anonUp = await fetch(`${URL_}/storage/v1/object/repair-photos/${enq.id}/anon.png`, {
      method: "POST",
      headers: hdr(ANON, ANON, { "Content-Type": "image/png" }),
      body: PNG,
    });
    check(!anonUp.ok, "anon cannot upload photos", `HTTP ${anonUp.status}`);
  }

  // ---------- 5. Public sign-up must be disabled ----------
  console.log("\n5. Authentication settings");
  const email = `zz-verify-${Date.now()}@example.com`;
  const su = await fetch(`${URL_}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: `Zz!${crypto.randomUUID()}` }),
  });
  const suJson = await su.json().catch(() => ({}));
  if (su.ok) {
    fail("public sign-ups are DISABLED", "sign-up succeeded - turn off 'Allow new users to sign up'");
    const id = suJson.user?.id ?? suJson.id;
    if (id) await fetch(`${URL_}/auth/v1/admin/users/${id}`, { method: "DELETE", headers: hdr(SERVICE) });
  } else pass("public sign-ups are disabled", `HTTP ${su.status}`);

  // ---------- 6. Staff ----------
  console.log("\n6. Staff permissions");
  if (process.env.TEST_STAFF_EMAIL && process.env.TEST_STAFF_PASSWORD) {
    const staff = await signIn(process.env.TEST_STAFF_EMAIL, process.env.TEST_STAFF_PASSWORD);
    check(Boolean(staff), "staff can sign in");
    if (staff && enq) {
      const read = await rest(`repair_enquiries?select=id&id=eq.${enq.id}`, { token: staff });
      check(read.status === 200 && read.json.length === 1, "staff can read enquiries");
      const upd = await rest(`repair_enquiries?id=eq.${enq.id}&select=status`, { token: staff, method: "PATCH", prefer: "return=representation", body: { status: "Contacted", diagnosis: "verification" } });
      check(upd.status === 200 && upd.json?.[0]?.status === "Contacted", "staff can update repair status/diagnosis");
      const hist = await rest(`repair_status_history?select=new_status,changed_by&enquiry_id=eq.${enq.id}&new_status=eq.Contacted`, { key: SERVICE });
      check(hist.json?.length === 1 && hist.json[0].changed_by, "status change recorded in history with staff id");
      const bad = await rest(`repair_enquiries?id=eq.${enq.id}`, { token: staff, method: "PATCH", body: { customer_name: "changed" } });
      check(bad.status === 401 || bad.status === 403, "staff cannot edit customer details", `HTTP ${bad.status}`);
      const del = await rest(`repair_enquiries?id=eq.${enq.id}`, { token: staff, method: "DELETE", prefer: "return=representation" });
      check(Array.isArray(del.json) && del.json.length === 0, "staff cannot delete enquiries");
      const bsUpd = await rest("business_settings?id=eq.1", { token: staff, method: "PATCH", prefer: "return=representation", body: { working_hours: "staff edit" } });
      check(Array.isArray(bsUpd.json) && bsUpd.json.length === 0, "staff cannot change business settings");
      if (photoPath) {
        const sign = await fetch(`${URL_}/storage/v1/object/sign/repair-photos/${photoPath}`, {
          method: "POST",
          headers: hdr(ANON, staff, { "Content-Type": "application/json" }),
          body: JSON.stringify({ expiresIn: 60 }),
        });
        check(sign.ok, "staff can view private photos via signed URL", `HTTP ${sign.status}`);
      }
    }
  } else skip("staff permission checks", "set TEST_STAFF_EMAIL and TEST_STAFF_PASSWORD");

  // ---------- 7. Admin ----------
  console.log("\n7. Admin permissions");
  if (process.env.TEST_ADMIN_EMAIL && process.env.TEST_ADMIN_PASSWORD) {
    const admin = await signIn(process.env.TEST_ADMIN_EMAIL, process.env.TEST_ADMIN_PASSWORD);
    check(Boolean(admin), "admin can sign in");
    if (admin) {
      const before = await rest("business_settings?select=working_hours&id=eq.1", { key: SERVICE });
      const orig = before.json?.[0]?.working_hours ?? null;
      const upd = await rest("business_settings?id=eq.1&select=working_hours,updated_by", { token: admin, method: "PATCH", prefer: "return=representation", body: { working_hours: "ZZ verify hours" } });
      check(upd.json?.[0]?.working_hours === "ZZ verify hours" && upd.json[0].updated_by, "admin can update business settings (who saved it is recorded)");
      await rest("business_settings?id=eq.1", { key: SERVICE, method: "PATCH", body: { working_hours: orig } });
      const bad = await rest("business_settings?id=eq.1", { token: admin, method: "PATCH", body: { maps_url: "javascript:alert(1)" } });
      check(bad.status === 400, "non-https links rejected by the database", `HTTP ${bad.status}`);
    }
  } else skip("admin permission checks", "set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD");

  // ---------- 8. Through the deployed site's API ----------
  console.log("\n8. Enquiry API on the deployed site");
  if (SITE) {
    const mobile = `9${String(Date.now()).slice(-9)}`;
    const submit = async (withPhoto) => {
      const fd = new FormData();
      const f = { customer_name: TAG, mobile_number: mobile, location: "Test Area", equipment_type: "LED TV", problem: "Display Lines", consent: "true", elapsed_ms: "9000", company: "" };
      for (const [k, v] of Object.entries(f)) fd.append(k, v);
      if (withPhoto) fd.append("photos", new Blob([PNG], { type: "image/png" }), "zz.png");
      const r = await fetch(`${SITE}/api/enquiries`, { method: "POST", body: fd, headers: { Origin: SITE, Referer: `${SITE}/book-repair` } });
      return { status: r.status, json: await r.json().catch(() => ({})) };
    };
    const first = await submit(true);
    check(first.status === 201 && first.json.enquiryNumber, "API saves an enquiry", `${first.status} ${first.json.enquiryNumber ?? first.json.error ?? ""}`);
    check(first.json.photos === 1, "API stored the uploaded photo", `photos=${first.json.photos}`);
    const second = await submit(false);
    check(second.json.duplicate === true && second.json.enquiryNumber === first.json.enquiryNumber, "duplicate submission returns the same enquiry number");
    const badMobile = await fetch(`${SITE}/api/enquiries`, { method: "POST", headers: { Origin: SITE }, body: (() => { const fd = new FormData(); fd.append("customer_name", TAG); fd.append("mobile_number", "12345"); fd.append("location", "Test Area"); fd.append("consent", "true"); fd.append("elapsed_ms", "9000"); return fd; })() });
    check(badMobile.status === 422, "server-side validation rejects invalid mobile", `HTTP ${badMobile.status}`);
    const xsite = await fetch(`${SITE}/api/enquiries`, { method: "POST", headers: { Origin: "https://evil.example" }, body: new FormData() });
    check(xsite.status === 403, "cross-site posts rejected", `HTTP ${xsite.status}`);
    if (RATE) {
      let last = 0;
      for (let i = 0; i < 6; i++) {
        const fd = new FormData();
        for (const [k, v] of Object.entries({ customer_name: TAG, mobile_number: `9${String(Date.now() + i).slice(-9)}`, location: "Test Area", consent: "true", elapsed_ms: "9000", problem: "Other" })) fd.append(k, v);
        last = (await fetch(`${SITE}/api/enquiries`, { method: "POST", body: fd, headers: { Origin: SITE } })).status;
      }
      check(last === 429, "rate limit blocks the 6th+ enquiry per hour from one IP", `last HTTP ${last}`);
    } else skip("rate limit (live)", "run with --rate-limit on a TEST project");
  } else skip("enquiry API checks", "set SITE_URL to a deployed (preview) site using this Supabase project");
}

async function cleanup() {
  const rows = await rest(`repair_enquiries?select=id&customer_name=eq.${encodeURIComponent(TAG)}`, { key: SERVICE });
  const ids = [...new Set([...(created.enquiries ?? []), ...((rows.json ?? []).map((r) => r.id))])];
  for (const id of ids) {
    const photos = await rest(`repair_photos?select=file_url&enquiry_id=eq.${id}`, { key: SERVICE });
    const paths = (photos.json ?? []).map((p) => p.file_url);
    if (paths.length) {
      await fetch(`${URL_}/storage/v1/object/repair-photos`, { method: "DELETE", headers: hdr(SERVICE, SERVICE, { "Content-Type": "application/json" }), body: JSON.stringify({ prefixes: paths }) });
    }
    await rest(`repair_enquiries?id=eq.${id}`, { key: SERVICE, method: "DELETE" });
  }
  if (created.files.length) {
    await fetch(`${URL_}/storage/v1/object/repair-photos`, { method: "DELETE", headers: hdr(SERVICE, SERVICE, { "Content-Type": "application/json" }), body: JSON.stringify({ prefixes: created.files }) });
  }
  console.log(`\nCleaned up ${ids.length} test enquiries.`);
}

try {
  await main();
} catch (e) {
  fail("unexpected error", e instanceof Error ? e.message : String(e));
} finally {
  await cleanup().catch((e) => console.error("cleanup failed:", e));
  const failed = results.filter((r) => r.ok === false).length;
  const passed = results.filter((r) => r.ok === true).length;
  const skipped = results.filter((r) => r.ok === null).length;
  console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`);
  process.exit(failed ? 1 : 0);
}
