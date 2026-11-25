import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getGeneralFaqs } from "../../src/content/faqs";
import { brands } from "../../src/content/brands";
import { tvProblems } from "../../src/content/tv-problems";
import { electronics } from "../../src/content/electronics";
import { tvServices } from "../../src/content/tv-services";
import { legal } from "../../src/config/legal";
import { trustItems, whyChooseItems } from "../../src/config/claims";
import { envBusiness } from "../../src/config/business";

describe("Public website content integrity", () => {
  it("general FAQs contain essential TV repair questions", () => {
    const b = envBusiness();
    const faqs = getGeneralFaqs(b);
    assert.ok(faqs.length >= 5);
    const questions = faqs.map((f) => f.q.toLowerCase());
    assert.ok(questions.some((q) => q.includes("inspection") || q.includes("charge")));
    assert.ok(questions.some((q) => q.includes("estimate") || q.includes("cost")));
    assert.ok(questions.some((q) => q.includes("brand")));
  });

  it("every TV service has diagnostic FAQs", () => {
    for (const service of tvServices) {
      assert.ok(service.faqs.length >= 1, `${service.slug} has fewer than 1 FAQ`);
      for (const faq of service.faqs) {
        assert.ok(faq.q.length > 10);
        assert.ok(faq.a.length > 20);
      }
    }
  });

  it("all 9 TV brands provide independent disclaimer in their FAQs", () => {
    assert.equal(brands.length, 9);
    for (const b of brands) {
      const hasDisclaimer = b.faqs.some((f) => /not (affiliated|an authorised)|independent/i.test(f.a));
      assert.ok(hasDisclaimer, `${b.title} is missing independent repair disclaimer in FAQs`);
    }
  });

  it("all 11 TV problems have sections and FAQs", () => {
    assert.equal(tvProblems.length, 11);
    for (const p of tvProblems) {
      assert.ok(p.title.length > 0, `${p.slug} missing title`);
      assert.ok(p.sections.length >= 1, `${p.slug} missing sections`);
      assert.ok(p.faqs.length >= 1, `${p.slug} missing faqs`);
    }
  });

  it("all 6 other electronics categories have proper descriptions", () => {
    assert.equal(electronics.length, 6);
    for (const e of electronics) {
      assert.ok(e.title.length > 0);
      assert.ok(e.summary.length > 10);
      assert.ok(e.sections.length >= 1);
    }
  });
});

describe("Legal and compliance configuration", () => {
  it("enforces confirmed business legal terms", () => {
    assert.ok(legal.enquiryRetention.includes("24 months"));
    assert.ok(legal.photoRetention.includes("6 months"));
    assert.ok(legal.warrantyPolicy.includes("repair receipt"));
    assert.ok(legal.inspectionPolicy.includes("verbally"));
    assert.ok(legal.jurisdiction.includes("Hyderabad"));
  });
});

describe("Claims and trust badges", () => {
  it("shows baseline trust items for public visitors", () => {
    const b = envBusiness();
    const trust = trustItems(b);
    assert.ok(trust.length >= 3);
    const titles = trust.map((t) => t.title);
    assert.ok(titles.some((t) => t.includes("TV Repair")));
    assert.ok(titles.some((t) => t.includes("Multiple")));
  });

  it("shows why choose items with transparent estimates", () => {
    const b = envBusiness();
    const items = whyChooseItems(b);
    assert.ok(items.length >= 3);
    const titles = items.map((i) => i.title);
    assert.ok(titles.some((t) => t.toLowerCase().includes("estimate")));
  });
});
