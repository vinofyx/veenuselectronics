import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ALL_EQUIPMENT,
  ALL_TV_BRANDS,
  PAGE_EQUIPMENT,
  equipmentOptions,
  isPathOffered,
  envBusiness,
  fullAddress,
  hasPhone,
  hasWhatsApp,
  inCity,
  mergeBusiness,
  serviceOptionsSentence,
  serviceTypes,
  telHref,
  whatsappHref,
} from "../../src/config/business";
import { businessFormToObject, businessSettingsSchema, toE164, toWhatsAppDigits } from "../../src/lib/business-validation";
import { trustItems, whyChooseItems } from "../../src/config/claims";
import { getGeneralFaqs } from "../../src/content/faqs";
import { tvServices } from "../../src/content/tv-services";
import { electronics } from "../../src/content/electronics";

describe("business configuration - no invented information", () => {
  const empty = envBusiness();

  it("has no phone, WhatsApp, address or experience by default", () => {
    assert.equal(hasPhone(empty), false);
    assert.equal(hasWhatsApp(empty), false);
    assert.equal(fullAddress(empty), "");
    assert.equal(empty.yearsExperience, null);
    assert.equal(inCity(empty), "");
  });
  it("Call / WhatsApp links fall back to the contact page when unset", () => {
    assert.equal(telHref(empty), "/contact-us");
    assert.equal(whatsappHref(empty), "/contact-us");
  });
  it("does not show experience, quality-parts or warranty claims until set", () => {
    const titles = whyChooseItems(empty).map((c) => c.title);
    assert.ok(!titles.some((t) => /years|Experienced|Quality|warranty/i.test(t)), titles.join(" | "));
  });
});

describe("mergeBusiness (admin settings over env)", () => {
  const base = envBusiness();
  it("uses admin values when set and env values when NULL", () => {
    const b = mergeBusiness(base, { phone: "+919876543210", whatsapp: "919876543210", city: "Test City", email: null });
    assert.equal(b.phone, "+919876543210");
    assert.equal(b.phoneDisplay, "+919876543210");
    assert.equal(b.address.city, "Test City");
    assert.equal(b.email, base.email);
    assert.equal(telHref(b), "tel:+919876543210");
  });
  it("filters brands to known TV brands and keeps all when unset", () => {
    assert.deepEqual(mergeBusiness(base, { supported_brands: ["LG", "Samsung", "Nokia"] }).brands, ["Samsung", "LG"]);
    assert.deepEqual(mergeBusiness(base, { supported_brands: null }).brands, ALL_TV_BRANDS);
  });
  it("applies service availability and confirmed claims", () => {
    const b = mergeBusiness(base, { home_visit_available: false, pickup_delivery_available: false, confirmed_claims: { quality_tested_parts: true } });
    assert.deepEqual(serviceTypes(b), ["Workshop Repair"]);
    assert.equal(serviceOptionsSentence(b), "Workshop service");
    assert.ok(whyChooseItems(b).some((c) => c.title.startsWith("Quality")));
  });
  it("shows years of experience only when configured", () => {
    const b = mergeBusiness(base, { years_experience: 12 });
    assert.ok(whyChooseItems(b).some((c) => c.title === "12+ years of experience"));
  });
  it("hides the multiple-brands claim when only one brand is supported", () => {
    const b = mergeBusiness(base, { supported_brands: ["Sony"] });
    assert.ok(!trustItems(b).some((c) => c.title.startsWith("Multiple")));
  });
});

describe("WhatsApp links", () => {
  it("URL-encodes multi-line enquiry details", () => {
    const b = mergeBusiness(envBusiness(), { whatsapp: "919876543210" });
    const href = whatsappHref(b, "Enquiry ID: VE-261123-1001\nBrand: LG & Sony?");
    assert.ok(href.startsWith("https://wa.me/919876543210?text="));
    assert.equal(decodeURIComponent(href.split("text=")[1]), "Enquiry ID: VE-261123-1001\nBrand: LG & Sony?");
    assert.ok(!href.includes("\n") && !href.includes(" "));
  });
});

describe("admin business form validation", () => {
  it("normalises phone formats to E.164", () => {
    assert.equal(toE164("98765 43210"), "+919876543210");
    assert.equal(toE164("098765 43210"), "+919876543210");
    assert.equal(toE164("+91 98765-43210"), "+919876543210");
    assert.equal(toE164("12345"), null);
    assert.equal(toWhatsAppDigits("98765 43210"), "919876543210");
  });
  const fd = (entries: [string, string][]) => {
    const f = new FormData();
    entries.forEach(([k, v]) => f.append(k, v));
    return f;
  };
  it("accepts a valid form and blanks become NULL", () => {
    const r = businessSettingsSchema.safeParse(
      businessFormToObject(fd([["phone", "98765 43210"], ["city", "Test City"], ["supported_brands", "LG"], ["supported_equipment", "LED TV"], ["home_visit_available", "on"], ["years_experience", ""]])),
    );
    assert.ok(r.success, JSON.stringify(!r.success && r.error.issues));
    if (r.success) {
      assert.equal(r.data.phone, "+919876543210");
      assert.equal(r.data.email, null);
      assert.equal(r.data.years_experience, null);
      assert.equal(r.data.home_visit_available, true);
      assert.equal(r.data.pickup_delivery_available, false);
    }
  });
  it("rejects bad phone, PIN, link and empty brand list", () => {
    const r = businessSettingsSchema.safeParse(
      businessFormToObject(fd([["phone", "12"], ["postcode", "12345"], ["maps_url", "javascript:alert(1)"]])),
    );
    assert.equal(r.success, false);
    const paths = !r.success ? r.error.issues.map((i) => i.path[0]) : [];
    for (const p of ["phone", "postcode", "maps_url", "supported_brands"]) assert.ok(paths.includes(p), `expected error on ${p}`);
  });
});

describe("admin Business details form <-> validation schema", () => {
  const src = fs.readFileSync(path.resolve(__dirname, "../../src/app/admin/(panel)/business/BusinessForm.tsx"), "utf8");
  const formNames = new Set([...src.matchAll(/name="([a-z_]+)"/g)].map((m) => m[1]));
  const schemaKeys = Object.keys(businessSettingsSchema.shape);

  it("every setting the brief requires has a form field", () => {
    for (const f of ["business_name", "phone", "whatsapp", "email", "address_street", "city", "maps_url", "working_hours", "years_experience", "supported_brands", "home_visit_available", "pickup_delivery_available", "warranty_terms"]) {
      assert.ok(formNames.has(f), `missing form field ${f}`);
    }
    assert.ok(src.includes('name="logo"'), "missing logo upload");
  });

  it("every schema field (except claims) is editable in the form", () => {
    for (const k of schemaKeys.filter((k) => k !== "confirmed_claims")) assert.ok(formNames.has(k), `schema key ${k} has no form field`);
  });

  it("every claim has a checkbox", () => {
    assert.ok(src.includes("name={`claim_${k}`}"));
  });
});

describe("supported equipment and inspection charges (Admin -> Business)", () => {
  it("all equipment and no inspection policy by default", () => {
    const b = envBusiness();
    assert.ok(b.equipment.includes("OLED TV") && b.equipment.includes("DVD Player"));
    assert.ok(!b.equipment.includes("Other"));
    assert.equal(b.inspectionCharges, "");
  });
  it("unsupported equipment pages are not offered; others are", () => {
    const b = mergeBusiness(envBusiness(), { supported_equipment: ["LED TV", "Smart TV", "Speaker"] });
    assert.equal(isPathOffered(b, "/tv-repair/oled-tv-repair"), false);
    assert.equal(isPathOffered(b, "/electronics-repair/projector-repair"), false);
    assert.equal(isPathOffered(b, "/tv-repair/led-tv-repair"), true);
    assert.equal(isPathOffered(b, "/tv-repair/4k-tv-repair"), true); // not tied to one equipment type
    assert.equal(isPathOffered(b, "/about-us"), true);
    assert.deepEqual(equipmentOptions(b), ["LED TV", "Smart TV", "Speaker", "Other"]);
  });
  it("unsupported brand pages are not offered", () => {
    const b = mergeBusiness(envBusiness(), { supported_brands: ["Samsung"] });
    assert.equal(isPathOffered(b, "/tv-brand-repair/samsung-tv-repair"), true);
    assert.equal(isPathOffered(b, "/tv-brand-repair/lg-tv-repair"), false);
  });
  it("every equipment-mapped page exists in the content", () => {
    const routes = new Set([...tvServices.map((s) => `/tv-repair/${s.slug}`), ...electronics.map((e) => `/electronics-repair/${e.slug}`)]);
    for (const p of Object.keys(PAGE_EQUIPMENT)) assert.ok(routes.has(p), p);
    for (const eq of Object.values(PAGE_EQUIPMENT)) assert.ok(ALL_EQUIPMENT.includes(eq), eq);
  });
  it("inspection charge policy appears in the FAQ only when set", () => {
    const faqOf = (b: ReturnType<typeof envBusiness>) => getGeneralFaqs(b).find((f) => /charge for inspection/.test(f.q))!.a;
    assert.match(faqOf(envBusiness()), /explained to you when we contact you/);
    const b = mergeBusiness(envBusiness(), { inspection_charges: "Rs 300 home visit, adjusted against the repair." });
    assert.match(faqOf(b), /^Rs 300 home visit, adjusted against the repair\. We confirm/);
  });
});
