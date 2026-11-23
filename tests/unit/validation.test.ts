import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { enquirySchema, normaliseMobile } from "../../src/lib/validation";

const base = { customer_name: "Test Customer", mobile_number: "9876543210", location: "Area A", consent: true };

describe("enquiry form validation", () => {
  it("accepts the minimum required fields", () => {
    const r = enquirySchema.safeParse(base);
    assert.ok(r.success);
    assert.equal(r.success && r.data.email, undefined);
  });

  for (const m of ["9876543210", "98765 43210", "+91 98765 43210", "+91-98765-43210", "09876543210", "919876543210"]) {
    it(`accepts Indian mobile format ${m}`, () => assert.ok(enquirySchema.safeParse({ ...base, mobile_number: m }).success));
  }
  for (const m of ["", "12345", "5876543210", "1234567890", "98765432101234", "abcdefghij", "+1 415 555 0100"]) {
    it(`rejects invalid mobile "${m}"`, () => {
      const r = enquirySchema.safeParse({ ...base, mobile_number: m });
      assert.equal(r.success, false);
    });
  }

  it("normalises mobiles to +91XXXXXXXXXX", () => {
    assert.equal(normaliseMobile("98765 43210"), "+919876543210");
    assert.equal(normaliseMobile("09876543210"), "+919876543210");
    assert.equal(normaliseMobile("+91-98765-43210"), "+919876543210");
  });

  it("requires a name of at least 2 characters", () => assert.equal(enquirySchema.safeParse({ ...base, customer_name: "A" }).success, false));
  it("requires a location", () => assert.equal(enquirySchema.safeParse({ ...base, location: "" }).success, false));
  it("requires consent", () => assert.equal(enquirySchema.safeParse({ ...base, consent: false }).success, false));
  it("rejects an invalid email but allows empty", () => {
    assert.equal(enquirySchema.safeParse({ ...base, email: "not-an-email" }).success, false);
    assert.ok(enquirySchema.safeParse({ ...base, email: "" }).success);
  });
  it("rejects unknown option values (brand, equipment, problem)", () => {
    assert.equal(enquirySchema.safeParse({ ...base, brand: "Apple" }).success, false);
    assert.equal(enquirySchema.safeParse({ ...base, equipment_type: "Fridge" }).success, false);
    assert.equal(enquirySchema.safeParse({ ...base, problem: "<script>" }).success, false);
  });
  it("treats empty selects as not provided", () => {
    const r = enquirySchema.safeParse({ ...base, brand: "", equipment_type: "", problem: "", service_type: "" });
    assert.ok(r.success);
    assert.equal(r.success && r.data.brand, undefined);
  });
  it("limits description length to 1500", () => {
    assert.equal(enquirySchema.safeParse({ ...base, problem_description: "x".repeat(1501) }).success, false);
  });
  it("validates preferred date format", () => {
    assert.ok(enquirySchema.safeParse({ ...base, preferred_date: "2026-12-01" }).success);
    assert.equal(enquirySchema.safeParse({ ...base, preferred_date: "01/12/2026" }).success, false);
  });
});
