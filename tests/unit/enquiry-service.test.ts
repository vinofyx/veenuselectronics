import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { submitEnquiry, LIMITS, type EnquiryDeps, type NewEnquiryRow } from "../../src/lib/enquiry-service";

/** In-memory fake of the Supabase data layer. */
function fakeDeps(opts: { failInsert?: boolean; failNotify?: boolean; failUpload?: boolean } = {}) {
  const db = {
    enquiries: [] as (NewEnquiryRow & { id: string; enquiry_number: string; created_at: number })[],
    photos: [] as { enquiry_id: string; path: string }[],
    uploads: [] as { path: string; type: string; bytes: number }[],
    notified: 0,
  };
  let seq = 1000;
  const deps: EnquiryDeps = {
    async countSince(ip, since) {
      return db.enquiries.filter((e) => e.ip_hash === ip && e.created_at >= since.getTime()).length;
    },
    async findDuplicate({ mobile, equipment, problem, since }) {
      const hit = db.enquiries.find(
        (e) => e.mobile_number === mobile && e.equipment_type === equipment && e.problem === problem && e.created_at >= since.getTime(),
      );
      return hit?.enquiry_number ?? null;
    },
    async insertEnquiry(row) {
      if (opts.failInsert) throw new Error("db down");
      const rec = { ...row, id: `id-${++seq}`, enquiry_number: `VE-261123-${seq}`, created_at: Date.now() };
      db.enquiries.push(rec);
      return { id: rec.id, enquiry_number: rec.enquiry_number };
    },
    async uploadPhoto(path, data, type) {
      if (opts.failUpload) return false;
      db.uploads.push({ path, type, bytes: data.length });
      return true;
    },
    async insertPhoto(enquiry_id, path) {
      db.photos.push({ enquiry_id, path });
      return true;
    },
    async notify() {
      if (opts.failNotify) throw new Error("email down");
      db.notified++;
    },
  };
  return { db, deps };
}

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d]);

function form(fields: Record<string, string> = {}, photos: { bytes: Uint8Array<ArrayBuffer>; name: string; type: string }[] = []) {
  const f = new FormData();
  const base: Record<string, string> = {
    customer_name: "Test Customer",
    mobile_number: "98765 43210",
    location: "Area A",
    equipment_type: "LED TV",
    brand: "Samsung",
    problem: "Black Screen",
    consent: "true",
    elapsed_ms: "8000",
    company: "",
    source_page: "/tv-brand-repair/samsung-tv-repair",
  };
  for (const [k, v] of Object.entries({ ...base, ...fields })) f.append(k, v);
  for (const p of photos) f.append("photos", new File([p.bytes], p.name, { type: p.type }));
  return f;
}

describe("enquiry submission service", () => {
  let ctx: ReturnType<typeof fakeDeps>;
  beforeEach(() => {
    ctx = fakeDeps();
  });

  it("saves a valid enquiry and returns an enquiry number (201)", async () => {
    const r = await submitEnquiry(form(), "ip1", ctx.deps);
    assert.equal(r.status, 201);
    assert.match(r.body.enquiryNumber!, /^VE-/);
    assert.equal(ctx.db.enquiries.length, 1);
    const e = ctx.db.enquiries[0];
    assert.equal(e.mobile_number, "+919876543210");
    assert.equal(e.brand, "Samsung");
    assert.equal(e.consent, true);
    assert.equal(e.ip_hash, "ip1");
    assert.equal(ctx.db.notified, 1);
  });

  it("uploads valid photos to <enquiry id>/<uuid>.<ext> and records them", async () => {
    const r = await submitEnquiry(form({}, [{ bytes: JPEG, name: "a.jpg", type: "image/jpeg" }, { bytes: PNG, name: "b.png", type: "image/png" }]), "ip1", ctx.deps);
    assert.equal(r.status, 201);
    assert.equal(r.body.photos, 2);
    assert.equal(ctx.db.uploads.length, 2);
    assert.match(ctx.db.uploads[0].path, /^id-\d+\/[0-9a-f-]{36}\.jpg$/);
    assert.equal(ctx.db.uploads[1].type, "image/png");
  });

  it("rejects a non-image file disguised as .jpg (422) and saves nothing", async () => {
    const fake = new TextEncoder().encode("<?php system($_GET['c']); ?>");
    const r = await submitEnquiry(form({}, [{ bytes: fake, name: "x.jpg", type: "image/jpeg" }]), "ip1", ctx.deps);
    assert.equal(r.status, 422);
    assert.equal(ctx.db.enquiries.length, 0);
  });

  it("rejects more than 4 photos", async () => {
    const p = { bytes: JPEG, name: "a.jpg", type: "image/jpeg" };
    const r = await submitEnquiry(form({}, [p, p, p, p, p]), "ip1", ctx.deps);
    assert.equal(r.status, 422);
  });

  it("rejects an invalid mobile number (422)", async () => {
    const r = await submitEnquiry(form({ mobile_number: "12345" }), "ip1", ctx.deps);
    assert.equal(r.status, 422);
    assert.match(r.body.error!, /mobile/i);
    assert.equal(ctx.db.enquiries.length, 0);
  });

  it("rejects missing required fields (422)", async () => {
    for (const field of ["customer_name", "location"]) {
      const r = await submitEnquiry(form({ [field]: "" }), "ip1", ctx.deps);
      assert.equal(r.status, 422, field);
    }
    const r = await submitEnquiry(form({ consent: "false" }), "ip1", ctx.deps);
    assert.equal(r.status, 422);
    assert.equal(ctx.db.enquiries.length, 0);
  });

  it("honeypot: returns a decoy success and saves nothing", async () => {
    const r = await submitEnquiry(form({ company: "Spam Co" }), "ip1", ctx.deps);
    assert.equal(r.status, 200);
    assert.ok(r.body.enquiryNumber);
    assert.equal(ctx.db.enquiries.length, 0);
    assert.equal(ctx.db.notified, 0);
  });

  it("too-fast submissions get a visible, recoverable error (not a fake success)", async () => {
    const r = await submitEnquiry(form({ elapsed_ms: String(LIMITS.minFillMs - 1) }), "ip1", ctx.deps);
    assert.equal(r.status, 400);
    assert.match(r.body.error!, /wait a moment/);
    assert.equal(r.body.enquiryNumber, undefined);
  });

  it("duplicate submission returns the existing enquiry number", async () => {
    const first = await submitEnquiry(form(), "ip1", ctx.deps);
    const second = await submitEnquiry(form({ mobile_number: "+91 98765 43210" }), "ip1", ctx.deps);
    assert.equal(second.status, 200);
    assert.equal(second.body.duplicate, true);
    assert.equal(second.body.enquiryNumber, first.body.enquiryNumber);
    assert.equal(ctx.db.enquiries.length, 1);
  });

  it("a different problem from the same customer is not a duplicate", async () => {
    await submitEnquiry(form(), "ip1", ctx.deps);
    const r = await submitEnquiry(form({ problem: "Display Lines" }), "ip1", ctx.deps);
    assert.equal(r.status, 201);
    assert.equal(ctx.db.enquiries.length, 2);
  });

  it(`rate limits after ${LIMITS.perIpPerHour} enquiries per hour from one IP (429)`, async () => {
    for (let i = 0; i < LIMITS.perIpPerHour; i++) {
      const r = await submitEnquiry(form({ mobile_number: `98765${String(10000 + i)}` }), "ip-flood", ctx.deps);
      assert.equal(r.status, 201, `submission ${i + 1}`);
    }
    const blocked = await submitEnquiry(form({ mobile_number: "9123456789" }), "ip-flood", ctx.deps);
    assert.equal(blocked.status, 429);
    const otherIp = await submitEnquiry(form({ mobile_number: "9123456789" }), "ip-other", ctx.deps);
    assert.equal(otherIp.status, 201);
  });

  it("database failure returns 500 with a helpful message", async () => {
    const { deps } = fakeDeps({ failInsert: true });
    const r = await submitEnquiry(form(), "ip1", deps);
    assert.equal(r.status, 500);
    assert.match(r.body.error!, /contact us/);
  });

  it("email failure does not lose the enquiry", async () => {
    const f = fakeDeps({ failNotify: true });
    const r = await submitEnquiry(form(), "ip1", f.deps);
    assert.equal(r.status, 201);
    assert.equal(f.db.enquiries.length, 1);
  });

  it("photo storage failure still saves the enquiry (photos: 0)", async () => {
    const f = fakeDeps({ failUpload: true });
    const r = await submitEnquiry(form({}, [{ bytes: JPEG, name: "a.jpg", type: "image/jpeg" }]), "ip1", f.deps);
    assert.equal(r.status, 201);
    assert.equal(r.body.photos, 0);
  });
});
