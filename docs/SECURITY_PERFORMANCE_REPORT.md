# Security and performance report

## 1. Dependency vulnerabilities
| Check | Status |
|---|---|
| `npm audit` | ❌ **Not executed.** Dependencies can't be installed here. The CI workflow can run it (add `npm audit --omit=dev` after install). |
| Next.js advisories reviewed manually | ✅ Next.js published many security releases in 2025–2026: a middleware authorisation bypass (CVE-2025-29927), React Server Components RCE and DoS issues (CVE-2025-66478 and follow-ups), and batches in May, July, August, September and October 2026. The October 2026 advisory lists **15.5.28** as the patched 15.x release. Some 2026 advisories **did not appear in the npm audit feed**, so `npm audit` alone is not enough. |
| Action taken | Minimums raised to `next ^15.5.28`, `eslint-config-next ^15.5.28`, `react`/`react-dom ^19.2.1`. Every fresh install resolves to a patched 15.x. |
| ⚠ Next.js 15 support window | A third-party write-up states the 15.x line reached end of support on **21 October 2026**. **Recommendation:** plan an upgrade to Next.js 16 soon after launch (middleware → proxy rename, `next lint` removal, other breaking changes). Do this as a separate, CI-verified change, not blind. |
| sharp (image optimisation) | Patched transitively by the newer Next.js; workaround if needed: `sharp ≥0.35.5` |

## 2. Application security
| Area | Status | Notes |
|---|---|---|
| Authentication | ✅ design / ⏳ live | Supabase Auth, no sign-up UI, sign-up must be **off** in Supabase (checked by `verify:supabase`), password ≥10 recommended |
| API authorisation | ✅ executed (DB) | RLS + column privileges: 37 database tests; admin export checks the role on the server |
| SQL injection | ✅ | No raw SQL in the app. Supabase query builder only. Admin search input stripped of PostgREST filter syntax (unit-tested). |
| XSS | ✅ | React escaping everywhere; no `dangerouslySetInnerHTML` except JSON-LD (escapes `<`); email HTML escaped; https-only links enforced in the database (blocks `javascript:` URLs) |
| CSRF | ✅ | Enquiry API requires same-origin `Origin`/`Referer`; admin mutations are Next.js Server Actions (built-in origin check) |
| File upload | ✅ executed | Real file-type check (not by extension); max 4 photos, 5 MB each, 4 MB total; private bucket; signed URLs expire after 1 hour |
| Rate limiting | ✅ executed | 5 per hour and 15 per day per hashed IP; function callable only by the server |
| Duplicate protection | ✅ executed | Same mobile, equipment and problem within 15 minutes returns the existing number |
| Personal data | ✅ | Customer data readable only by staff (RLS); IPs stored only as salted hashes; no customer data in logs or analytics |
| Environment variables | ✅ executed | Secret scan clean; service-role key only in `server-only` modules; `.env*` git-ignored |
| HTTP security headers | ✅ code / ⏳ live | HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy. **CSP not added** (needs browser testing; recommended in report-only mode after the preview). |

**No critical issues found by code review and the executed tests.** High-risk items left: Next.js 15 end of support (above), and live verification of Auth and Storage (needs Supabase).

## 3. Performance
| Check | Status | Notes |
|---|---|---|
| Rendering | ✅ code | Public pages are static (SSG/ISR, refreshed hourly or immediately when the admin saves) |
| Images | ✅ code | `next/image` with AVIF/WebP for configured photos; the hero is an inline SVG (no image download); logo ≤1 MB |
| JavaScript bundle size | ⏳ not measured | Measured from `next build` output in CI (`ci-logs/build.log` lists First Load JS per route). Client JS is limited to the header, CTA buttons, enquiry form (react-hook-form + Zod) and admin forms. |
| Fonts | ✅ | `next/font` (self-hosted, `display: swap`, no layout shift) |
| Third-party scripts | ✅ | Only GA4 (`afterInteractive`) when configured; Maps iframe is lazy-loaded |
| Core Web Vitals / mobile performance | ⏳ not measured | Run PageSpeed Insights (mobile) on the Vercel preview: targets LCP <2.5 s, INP <200 ms, CLS <0.1 |
