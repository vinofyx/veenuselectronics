import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { detectImage } from "../../src/lib/image-detect";
import { csvCell, toCsv } from "../../src/lib/csv";
import { cleanFilters, filtersToSearch } from "../../src/lib/enquiry-filters";

describe("image detection by content", () => {
  const enc = (s: string) => new TextEncoder().encode(s);
  it("detects JPEG, PNG, WEBP, HEIC", () => {
    assert.equal(detectImage(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])), "jpg");
    assert.equal(detectImage(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0])), "png");
    assert.equal(detectImage(enc("RIFF\0\0\0\0WEBPVP8 ")), "webp");
    assert.equal(detectImage(enc("\0\0\0\x18ftypheic\0\0")), "heic");
  });
  it("rejects scripts, SVG, GIF, PDF and tiny files", () => {
    for (const s of ["<?php echo 1; ?>", "<svg onload=alert(1)>", "GIF89a......", "%PDF-1.7 ....", "abc"]) assert.equal(detectImage(enc(s)), null, s);
  });
});

describe("CSV export safety", () => {
  it("neutralises spreadsheet formulas", () => {
    assert.equal(csvCell("=HYPERLINK(\"http://x\")"), `"'=HYPERLINK(""http://x"")"`);
    assert.equal(csvCell("+91 98765"), "'+91 98765");
    assert.equal(csvCell("@SUM(A1)"), "'@SUM(A1)");
  });
  it("quotes commas, quotes and newlines; blanks nulls", () => {
    assert.equal(csvCell('He said "hi", then\nleft'), '"He said ""hi"", then\nleft"');
    assert.equal(csvCell(null), "");
    assert.equal(csvCell(1500), "1500");
  });
  it("builds a CSV with BOM and CRLF rows", () => {
    const csv = toCsv(["a", "b"], [{ a: 1, b: "x,y" }]);
    assert.equal(csv, '﻿a,b\r\n1,"x,y"');
  });
});

describe("admin filter sanitising (PostgREST injection)", () => {
  it("strips filter syntax from search and drops unknown values", () => {
    const f = cleanFilters({ q: "ravi),status.eq.New", status: "Bogus", brand: "LG", equipment: "Fridge", from: "2026-11-01", to: "bad", page: "-3" });
    assert.ok(!/[(),]/.test(f.q));
    assert.equal(f.status, "");
    assert.equal(f.brand, "LG");
    assert.equal(f.equipment, "");
    assert.equal(f.from, "2026-11-01");
    assert.equal(f.to, "");
    assert.equal(f.page, 1);
  });
  it("round-trips to a query string", () => {
    const f = cleanFilters({ status: "New", brand: "Sony" });
    assert.equal(filtersToSearch(f, { page: 2 }), "?status=New&brand=Sony&page=2");
  });
});
