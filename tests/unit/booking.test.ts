import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  envBusiness,
  mergeBusiness,
  telHref,
  whatsappHref,
  smsHref,
  allPhones,
  allWhatsApps,
  allSms,
  WHATSAPP_BOOKING,
  WHATSAPP_GENERAL,
  SMS_BOOKING,
} from "../../src/config/business";
import { normaliseMobile } from "../../src/lib/validation";

describe("Direct Booking: Phone Channels", () => {
  it("generates correct click-to-call link with standard Indian mobile", () => {
    const b = mergeBusiness(envBusiness(), { phone: "+916300473113", phone_display: "+91 63004 73113" });
    assert.equal(telHref(b), "tel:+916300473113");
    const phones = allPhones(b);
    assert.equal(phones.length, 1);
    assert.equal(phones[0].number, "+916300473113");
    assert.equal(phones[0].display, "+91 63004 73113");
  });

  it("supports primary and secondary phone numbers simultaneously", () => {
    const b = mergeBusiness(envBusiness(), {
      phone: "+916300473113",
      phone_secondary: "+919000000002",
      phone_secondary_display: "+91 90000 00002",
    });
    const phones = allPhones(b);
    assert.equal(phones.length, 2);
    assert.equal(phones[0].href, "tel:+916300473113");
    assert.equal(phones[1].href, "tel:+919000000002");
    assert.equal(phones[1].display, "+91 90000 00002");
  });

  it("gracefully falls back to /contact-us when phone is unconfigured", () => {
    const b = envBusiness();
    assert.equal(telHref(b), "/contact-us");
    assert.equal(allPhones(b).length, 0);
  });
});

describe("Direct Booking: WhatsApp Channels", () => {
  it("formats standard WhatsApp click-to-chat URL with country code", () => {
    const b = mergeBusiness(envBusiness(), { whatsapp: "916300473113" });
    const href = whatsappHref(b);
    assert.ok(href.startsWith("https://wa.me/916300473113?text="));
    assert.ok(href.includes(encodeURIComponent(WHATSAPP_GENERAL())));
  });

  it("formats structured repair request template in WhatsApp", () => {
    const b = mergeBusiness(envBusiness(), { whatsapp: "916300473113", business_name: "Veenus Electronics" });
    const template = WHATSAPP_BOOKING(b);
    assert.ok(template.includes("Veenus Electronics"));
    assert.ok(template.includes("TV Brand"));
    assert.ok(template.includes("TV Problem"));
    assert.ok(template.includes("Location"));
    const href = whatsappHref(b, template);
    assert.ok(href.startsWith("https://wa.me/916300473113?text="));
  });

  it("supports primary and secondary WhatsApp channels", () => {
    const b = mergeBusiness(envBusiness(), {
      whatsapp: "916300473113",
      whatsapp_secondary: "919000000002",
    });
    const whatsapps = allWhatsApps(b);
    assert.equal(whatsapps.length, 2);
    assert.ok(whatsapps[0].href.includes("916300473113"));
    assert.ok(whatsapps[1].href.includes("919000000002"));
  });

  it("gracefully falls back to /contact-us when WhatsApp is unconfigured", () => {
    const b = envBusiness();
    assert.equal(whatsappHref(b), "/contact-us");
    assert.equal(allWhatsApps(b).length, 0);
  });
});

describe("Direct Booking: SMS Channels", () => {
  it("formats standard SMS booking URL with pre-filled repair details body", () => {
    const b = mergeBusiness(envBusiness(), { phone: "+916300473113" });
    const template = SMS_BOOKING(b);
    const href = smsHref(b, template);
    assert.ok(href.startsWith("sms:+916300473113?body="));
    assert.ok(href.includes(encodeURIComponent(template)));
    const smsList = allSms(b, template);
    assert.equal(smsList.length, 1);
  });

  it("gracefully falls back to /contact-us when phone for SMS is unconfigured", () => {
    const b = envBusiness();
    assert.equal(smsHref(b), "/contact-us");
    assert.equal(allSms(b).length, 0);
  });
});

describe("Mobile Number Normalisation for Customer Contact", () => {
  it("standardises 10-digit Indian numbers to E.164", () => {
    assert.equal(normaliseMobile("6300473113"), "+916300473113");
    assert.equal(normaliseMobile("06300473113"), "+916300473113");
    assert.equal(normaliseMobile("916300473113"), "+916300473113");
    assert.equal(normaliseMobile("+91 63004 73113"), "+916300473113");
    assert.equal(normaliseMobile("+91-63004-73113"), "+916300473113");
  });
});
