# Phase 1 – Project audit report

**Date:** 23 November 2026 · **Scope:** every file in `D:\veenuelectronics` (98 files) · **Method:** read every source file, plus automated static checks (listed at the end)

The disk copy was compared with the build workspace before auditing. The only differences were content-provenance metadata added to the two image files when they were delivered; nothing else differed.

## Environment constraints that shaped this audit
| Constraint | Effect |
|---|---|
| The Claude workspace on your PC would not start: the drive has too little free space (it needs up to 17 GB) | Nothing could be run against the project on your machine |
| Your account's network policy blocks the npm registry in the cloud workspace (HTTP 403) | `npm install`, `next build`, `next lint` and real `tsc` **could not run** |
| No Supabase project or credentials exist yet | No live database, auth or storage tests are possible |

So every finding below comes from **reading the code**, plus static checks, plus tests that genuinely ran on local PostgreSQL and Node. Nothing in this report claims a real Next.js build passed.

---

## 1. Source files
50 public routes, 6 admin routes, 2 API routes, the sitemap and robots. The code is organised into `config/` (business and site settings), `content/` (page text), `lib/` (logic) and `components/` (UI). No dead files were found.

## 2. package.json and dependencies
| Item | Finding | Severity |
|---|---|---|
| `next ^15.1.0`, `react ^19` | Compatible. The `^15` range will install the newest 15.x, which is fine. | OK |
| `eslint ^8.57.1` + `.eslintrc.json` | Works with `next lint`. Next 15.5+ prints a deprecation warning for `next lint`, but it is not an error. | Low |
| `@supabase/ssr ^0.5.2` | Fine (the cookie API used is `getAll`/`setAll`, which is correct for 0.5). | OK |
| No test tooling | No unit or e2e test dependencies or scripts. | **Fixed in Phase 9** |
| No lockfile | `package-lock.json` can only be produced by `npm install`, which couldn't run here. | Manual |

## 3. Next.js configuration
- The security headers, AVIF/WebP image formats, Supabase host for `next/image`, and `noindex` on `/admin` are all present.
- **Gap:** with `NEXT_PUBLIC_SITE_URL` unset, canonical URLs and the sitemap fall back to `http://localhost:3000`, which would damage SEO if deployed that way. **→ Fixed:** the site now falls back to Vercel's production URL, and a startup warning is logged.
- **Gap:** no Content-Security-Policy. Adding one without a browser test risks breaking Google Analytics, Maps or Next's inline scripts. **→ Recommendation**, documented in SECURITY_REPORT.md.

## 4. Routes (50 public)
| Group | Count | Finding |
|---|---|---|
| Static pages (home, indexes, business, legal) | 16 | OK |
| `/tv-repair/[slug]` | 7 | Static generation, `dynamicParams=false` |
| `/tv-problems/[slug]` | 10 | OK |
| `/tv-brand-repair/[slug]` | 9 | OK |
| `/electronics-repair/[slug]` | 6 | OK |
| `/blog/[slug]` | 3 | OK |
| **SEO gap** | – | The brief prioritises "TV Screen Repair", but no page targets it. **→ Fixed:** added `/tv-problems/tv-screen-repair` (now 51 routes). |
| Error handling | – | No `error.tsx` boundaries, so a Supabase outage on the home page would show Next's default error page. **→ Fixed:** added site and admin error boundaries. |

## 5. Supabase migrations
- Tables, indexes, the triggers (enquiry number, `updated_at`/`completed_at`, status history) and RLS on all tables were all already verified on PostgreSQL 16.
- **Security gap:** the "staff update" RLS policy lets staff update **every** column through the REST API using their own login token, including `customer_name`, `mobile_number`, `enquiry_number`, `ip_hash` and `consent`. The admin UI only sends repair fields, but a staff member with their token could change the rest. **→ Fixed** (migration 2): column-level update privileges for `authenticated`, limited to the repair-workflow columns.
- **Gap:** no table for business settings, so changing business details requires editing environment variables or code. **→ Fixed** (Phase 8, migration 2).
- **Gap:** photos and enquiries are never deleted automatically, although the privacy policy promises retention limits. Documented; this needs a business decision before automating.

## 6. Authentication and authorisation
- Three layers: middleware (session required), `requireStaff()` in every admin page and server action (active row in `admin_users`), and RLS in the database. **Sound.**
- Public sign-up: the UI has none, but Supabase Auth allows sign-up by default. A stranger could create an auth user through the API. They would still see nothing, because RLS requires an `admin_users` row, but **"Allow new users to sign up" must be turned off** in Supabase. This is already in DEPLOYMENT.md and is now repeated in the manual checklist.
- Login brute-force: handled by Supabase Auth's built-in rate limits. No app-level lockout.
- **Minor:** the `signIn` redirect target is checked to start with `/admin`, so there is no open redirect. OK.

## 7. API endpoints
| Endpoint | Finding |
|---|---|
| `POST /api/enquiries` | Same-origin check, honeypot, minimum fill time, Zod validation, file-content check, per-IP rate limit, private upload. Issues below. |
| `GET /api/admin/export` | Staff session + admin role, CSV formula-injection protection, paginated read. OK |

**Issues found in `POST /api/enquiries`:**
1. **A real customer could lose an enquiry.** Submitting within 2.5 s of the page loading (for example with browser autofill) silently returned a *fake* success and enquiry number, and nothing was saved. **→ Fixed:** fast submissions now get a visible "please try again" error. Only the hidden honeypot field still triggers the silent decoy.
2. **No duplicate protection.** A double submit, or a retry after a slow network, created duplicate enquiries. **→ Fixed:** the same mobile number with the same equipment and problem within 15 minutes returns the existing enquiry number instead of creating a new one.
3. **The rate-limit salt fell back to part of the service-role key.** It never left the server, but deriving anything from that key is poor practice. **→ Fixed:** it now uses `RATE_LIMIT_SALT` and logs a warning when that is missing.
4. If storage upload fails, the enquiry is still saved and the customer sees success with fewer photos. This is acceptable, and the photo count is returned. OK

## 8. Image upload
Browser compression to 1600 px JPEG, a 4-photo limit, a 15 MB raw limit, a 4 MB total cap (Vercel's request-body limit is 4.5 MB), server file-content check, private bucket, and signed URLs that expire after 1 hour. HEIC images that the browser cannot decode are sent as-is if under 5 MB. **OK.**

## 9. Enquiry submission (client)
The form works with only the required fields and offers optional extra details. It shows the enquiry ID and a WhatsApp share option.
- **Minor:** the honeypot field was read by its DOM id, which could collide if two forms were ever on one page. **→ Fixed:** it now uses a ref.
- Service-type options ignored whether the business actually offers home visits or pickup. **→ Fixed** with the Phase 8 settings.

## 10. Admin dashboard
Everything in the brief is present: the 8 widgets, search, filters, status (quick and full), technician, diagnosis, estimate, final cost, parts, warranty, notes, photos, status history, CSV export, and monthly, weekly and daily reports with revenue.
- **Gap:** business details could not be edited. **→ Fixed:** a "Business details" admin page.

## 11. Placeholders and incomplete items (business input still required)
| Item | Where |
|---|---|
| Phone, WhatsApp, email, address, map, hours, experience, warranty | Now editable in **Admin → Business details** (environment variables are the fallback) |
| Service areas | Admin → Settings (none are pre-filled, deliberately) |
| Real workshop photos | `src/config/images.ts` (an illustration is shown until then) |
| Genuine reviews | `src/content/reviews.ts` (empty) |
| Retention periods and jurisdiction | `src/config/legal.ts` (defaults; confirm them) |

## Static checks executed for this audit
| Check | Result |
|---|---|
| Every JSX text node scanned for characters that would fail `react/no-unescaped-entities` | 0 found |
| Import graph of all `"use client"` components (checking whether the service-role key could reach the browser) | None import server-only modules |
| `server-only` guard present on every module that reads secrets | Yes (6 modules) |
| References to `SUPABASE_SERVICE_ROLE_KEY` outside the admin client | 1, the salt fallback, **fixed** |
