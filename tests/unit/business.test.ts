import { describe, it } from "node:test";
import assert from "node:assert/strict";
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
  smsHref,
  allSms,
  allPhones,
  allWhatsApps,
  WHATSAPP_BOOKING,
  SMS_BOOKING,
} from "../../src/config/business";
import { trustItems, whyChooseItems } from "../../src/config/claims";
import { STATIC_SERVICE_AREAS } from "../../src/config/service-areas";

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

describe("business configuration with production values", () => {
  const base = envBusiness();
  it("formats verified phone numbers and WhatsApp correctly", () => {
    const b = mergeBusiness(base, { phone: "+916300473113", whatsapp: "916300473113", city: "Secunderabad" });
    assert.equal(b.phone, "+916300473113");
    assert.equal(b.phoneDisplay, "+916300473113");
    assert.equal(b.address.city, "Secunderabad");
    assert.equal(telHref(b), "tel:+916300473113");
    assert.ok(whatsappHref(b).startsWith("https://wa.me/916300473113"));
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

describe("WhatsApp direct booking links", () => {
  it("URL-encodes multi-line enquiry details", () => {
    const b = mergeBusiness(envBusiness(), { whatsapp: "916300473113" });
    const href = whatsappHref(b, "TV Brand: Samsung\nProblem: Black Screen\nLocality: Secunderabad");
    assert.ok(href.startsWith("https://wa.me/916300473113?text="));
    assert.equal(decodeURIComponent(href.split("text=")[1]), "TV Brand: Samsung\nProblem: Black Screen\nLocality: Secunderabad");
    assert.ok(!href.includes("\n") && !href.includes(" "));
  });

  it("generates booking WhatsApp message template correctly", () => {
    const b = mergeBusiness(envBusiness(), { whatsapp: "916300473113", business_name: "Veenus Electronics" });
    const template = WHATSAPP_BOOKING(b);
    assert.ok(template.includes("Veenus Electronics"));
    assert.ok(template.includes("TV Brand"));
    assert.ok(template.includes("Location"));
    const whatsapps = allWhatsApps(b, template);
    assert.equal(whatsapps.length, 1);
    assert.ok(whatsapps[0].href.startsWith("https://wa.me/916300473113?text="));
  });
});

describe("SMS direct booking links", () => {
  it("generates sms: protocol link with encoded body", () => {
    const b = mergeBusiness(envBusiness(), { phone: "+916300473113" });
    const href = smsHref(b, "Hello, I want to book a repair");
    assert.ok(href.startsWith("sms:+916300473113?body="));
    assert.equal(decodeURIComponent(href.split("body=")[1]), "Hello, I want to book a repair");
  });

  it("generates booking SMS message template correctly", () => {
    const b = mergeBusiness(envBusiness(), { phone: "+916300473113" });
    const template = SMS_BOOKING(b);
    assert.ok(template.includes("book a TV repair"));
    const list = allSms(b, template);
    assert.equal(list.length, 1);
    assert.ok(list[0].href.startsWith("sms:+916300473113?body="));
  });
});

describe("Phone direct call links", () => {
  it("generates clean tel: link with digits only", () => {
    const b = mergeBusiness(envBusiness(), { phone: "+91 63004-73113" });
    assert.equal(telHref(b), "tel:+916300473113");
    const phones = allPhones(b);
    assert.equal(phones.length, 1);
    assert.equal(phones[0].href, "tel:+916300473113");
  });
});

describe("Static service areas configuration", () => {
  it("returns verified static service areas list", () => {
    assert.deepEqual(STATIC_SERVICE_AREAS, []);
  });
});

describe("Supported equipment and inspection charges", () => {
  it("all equipment and no inspection policy by default", () => {
    const b = envBusiness();
    assert.ok(b.equipment.includes("OLED TV") && b.equipment.includes("DVD Player"));
    assert.ok(!b.equipment.includes("Other"));
    assert.equal(b.inspectionCharges, "");
  });

  it("filters out paths when equipment is toggled off", () => {
    const b = mergeBusiness(envBusiness(), { supported_equipment: ["LED TV", "Smart TV"] });
    assert.ok(isPathOffered(b, "/tv-repair/led-tv-repair"));
    assert.ok(isPathOffered(b, "/tv-repair/smart-tv-repair"));
    assert.ok(!isPathOffered(b, "/tv-repair/oled-tv-repair"));
    assert.ok(!isPathOffered(b, "/electronics-repair/dvd-player-repair"));
  });
});
