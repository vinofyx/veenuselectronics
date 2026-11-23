# Testing report

**Updated:** 23 November 2026

This report uses three labels, and nothing is marked as passed unless it actually ran:

| Label | Meaning |
|---|---|
| ✅ **EXECUTED – PASS** | Run in this session; the raw output is in `docs/test-results/` |
| 📝 **WRITTEN – NOT RUN** | The test exists in the project but could not run here (it needs the built site, internet access or a Supabase project) |
| 🖐 **MANUAL** | A person must check it |

## Why some tests could not run
1. **Your PC:** the Claude workspace on your computer would not start. The Claude app reports the drive needs up to **17 GB free**.
2. **Cloud workspace:** your account's network policy blocks the npm registry (HTTP 403), so `next`, `@supabase/*`, `react-hook-form`, `lucide-react` and the other dependencies could not be installed. That means **no `next build`, no real `tsc` or ESLint, and no running site to point a browser at.**
3. **No Supabase project or credentials exist yet**, so no live auth, storage or API tests.

To run everything yourself: `npm install && npm run verify && npm run test:e2e`. Or move `setup/github-ci.yml` to `.github/workflows/ci.yml` and push to GitHub; the workflow runs all of it automatically.

---

## 1. Executed automated tests

### 1a. Unit and API logic tests: ✅ 75/75 pass
`npm test`, using Node's test runner with tsx and the real Zod library. Output: [test-results/unit-tests.txt](test-results/unit-tests.txt)

| Suite | Tests | Covers |
|---|---|---|
| Enquiry form validation | 23 | Required fields, 6 valid and 7 invalid mobile formats, +91 normalisation, consent, email, unknown option values, length limits, date format |
| Enquiry submission service (API logic) | 14 | Valid save (201), photo upload paths, disguised non-image rejected, >4 photos, invalid mobile, missing fields, honeypot decoy (nothing stored), too-fast submit shows an error rather than a fake success, **duplicate returns the same enquiry number**, different problem is not a duplicate, **rate limit after 5 per hour per IP** (another IP unaffected), database failure gives 500, email failure doesn't lose the enquiry, storage failure still saves the enquiry |
| Business configuration | 13 | Nothing shown when unset, Call/WhatsApp fall back to the contact page, admin values override env values, brand filtering, service availability, claims shown only when confirmed or set, WhatsApp message URL encoding, admin form validation (phone, PIN code, https links, brands) |
| Image detection, CSV, filters | 7 | JPEG/PNG/WEBP/HEIC detected; PHP, SVG, GIF, PDF rejected; CSV formula injection neutralised; PostgREST filter-injection stripped |
| SEO metadata for **all 51 routes** (new) | 9 | Unique titles and descriptions, lengths, canonical = route, priority keywords, no location-stuffed pages, ≥120 words per landing page (found 10 thin pages and 2 long descriptions, fixed) |
| Admin Business form ↔ schema (new) | 3 | Every required setting has a form field; every saved setting is editable |
| Navigation and SEO content | 6 | 51 routes; every header, footer, related and hard-coded link resolves; unique meta titles; description ≤160 and title ≤60 characters; brand pages carry the "independent" FAQ |

**Found by these tests and fixed:** 5 meta descriptions were over 160 characters, so Google would have cut them off.

### 1b. Database migrations and security tests: ✅ 35/35 pass, plus `supabase/verify.sql` 15/15 OK
`npm run test:db` on **real PostgreSQL 16.15**, with a small mock of Supabase's `auth` and `storage` schemas. Output: [test-results/database-tests.txt](test-results/database-tests.txt)

- Both migrations apply cleanly and can be re-run without errors.
- Enquiry number format; status history on insert; rate-limit function; constraints reject a bad mobile, bad status, bad phone and non-https links.
- **Anonymous visitor:** cannot read enquiries, photos or staff; cannot insert enquiries directly; cannot call the rate-limit function; cannot change business settings; sees only active service areas.
- **Logged-in non-staff user:** sees nothing and changes nothing.
- **Staff:** can read and update repair fields, and the change is logged with their ID. **Cannot** edit customer name, mobile or enquiry number (column privileges), cannot forge status history, cannot delete, cannot change service areas or business settings, cannot upload site assets.
- **Admin:** `completed_at` is stamped on completion; can update business settings (who saved it is recorded); can manage areas; can delete; cannot write into the private photo bucket directly.

**Found by testing earlier and fixed:** the server role couldn't call the rate-limit function, which would have broken every enquiry.

### 1c. Static checks: ✅
| Check | Result |
|---|---|
| Syntax of all 91 source + 12 test files | 0 errors |
| **Real** `tsc --strict` (real TypeScript, Zod and Node types) over the unit tests and all source they import | ✅ pass, after fixing 1 real error |
| Cross-file type check of project code (third-party modules stubbed) | 0 errors in project code |
| Playwright specs type-checked against the **real** Playwright 1.63 types | 0 errors |
| JSX text that would fail `react/no-unescaped-entities` | 0 |
| Client components importing secret or server-only modules | 0 |

## 2. Written, not run: 📝
| Suite | File | What it needs |
|---|---|---|
| Real full `tsc`, ESLint, `next build` | `npm run verify` / GitHub Actions | `npm install` (internet) |
| Live Supabase verification | `npm run verify:supabase` | Supabase credentials |
| Call/WhatsApp link tests, contact page, booking fit, **screenshots** on 5 viewports | `tests/e2e/conversion-and-screenshots.spec.ts` | Built site |
| Public pages on 5 viewports: 12 key pages return 200, one H1, **no horizontal overflow**, no console errors; alt text; 404 page | `tests/e2e/public-site.spec.ts` | Built site |
| Navigation (desktop menu and mobile hamburger), every homepage link resolves | same | Built site |
| Mobile sticky bar visible on phones and hidden on desktop, tap targets ≥44 px, CTA above the fold | same | Built site |
| **Full customer journey:** home → LED TV → Samsung → problem page → form (pre-filled problem) → photo → submit → `VE-` number → WhatsApp link content checked | `tests/e2e/enquiry-journey.spec.ts` | Built site + **test** Supabase |
| Invalid/missing fields, duplicate submission, cross-site post blocked, honeypot, fake image upload rejected | same | same |
| Admin: logged-out redirects, wrong password, 8 widgets, search/filter, update all repair fields, status history, CSV, reports, business details reach the public site | `tests/e2e/admin.spec.ts` | Built site + test Supabase + test admin/staff accounts |
| Staff blocked from reports, business, settings and export | same | same |
| SEO: unique titles, canonical (not localhost), OG, JSON-LD types, no ratings, sitemap, robots, admin noindex | `tests/e2e/seo.spec.ts` | Built site |

## 3. Manual checks: 🖐
See [BROWSER_TESTING_REPORT.md](BROWSER_TESTING_REPORT.md), section 3, for the visual checklist (design quality cannot be fully automated). Also:
- [ ] On a real Android phone and an iPhone: Call opens the dialer; WhatsApp opens the app with the message; photo picker works with the camera.
- [ ] The email alert arrives and its "Open in admin" link works.
- [ ] Google Rich Results Test on one TV problem page.
- [ ] PageSpeed Insights (mobile) on the home page.
