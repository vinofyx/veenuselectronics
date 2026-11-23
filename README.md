# Veenus Electronics – TV Repair Website

The full-stack website for **Veenus Electronics**. TV repair is the main business, and other electronics repairs come second. Its job is to bring in TV repair enquiries, phone calls and WhatsApp bookings.

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3, Inter + Poppins (next/font) |
| Forms | React Hook Form + Zod, with the same Zod schema checked again on the server |
| Database / Auth / Storage | Supabase (PostgreSQL + Row Level Security, Supabase Auth, private Storage bucket) |
| Email alerts | Resend (optional) |
| Analytics | Google Analytics 4 and Google Search Console verification (optional) |
| Hosting | Vercel |

## Quick start (local)

```bash
npm install
cp .env.example .env.local     # then fill in the values (see docs/ENVIRONMENT.md)
npm run dev                    # http://localhost:3000
```

Before enquiries and the admin panel will work, set up Supabase first. Full steps are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Checks to run before deploying:

```bash
npm run verify     # typecheck + lint + unit tests + production build
npm run test:db    # database migrations + RLS security tests (needs local PostgreSQL / WSL)
npm run test:e2e   # Playwright browser tests on 5 viewports (after npm run build)
npm run verify:supabase   # live checks against your real Supabase project (see docs/SUPABASE_SETUP.md)
```
`.github/workflows/ci.yml` runs all of these on GitHub for every push and pull request (a copy is in `setup/github-ci.yml`, because `.github` can't be written to your PC remotely).

> **Current status:** see [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md). The production build and browser tests have **not been run yet**.

## What's included

**Public website (all pages are server-rendered and have SEO metadata)**
- Homepage with these sections: hero, trust bar, TV services, common problems, brands, other electronics, why choose us, how it works, reviews, service locations, FAQ and a final call to action.
- 11 TV problem pages including the new TV Screen Repair page: `/tv-problems/*`. Each includes a safety warning.
- 7 TV repair pages: `/tv-repair/*`. Each has unique content, an FAQ, related links and an enquiry form.
- 9 brand pages: `/tv-brand-repair/*`. Each carries an "independent repairer – not authorised" disclaimer.
- 6 electronics pages: `/electronics-repair/*`
- Business pages: about, contact, service areas, how it works, reviews, FAQ, blog (3 guides), book repair, privacy policy and terms.
- Mobile: a sticky Call / WhatsApp / Book bar and a hamburger menu. Desktop: a floating WhatsApp button and dropdown navigation.
- GA4 events for call clicks, WhatsApp clicks, Book Repair clicks, and enquiry submission attempts, successes and errors.

**Enquiry system** (`POST /api/enquiries`)
- The server validates every field with Zod and normalises Indian mobile numbers to `+91XXXXXXXXXX`.
- Spam protection: a hidden honeypot field, a check on how long the form took to fill, a same-origin check, and a rate limit per hashed IP (5 per hour, 15 per day).
- Up to 4 photos. The browser compresses them first (Vercel limits request bodies to 4.5 MB). The server checks each file's real type from its first bytes, then stores it in a private bucket.
- Each enquiry gets a unique ID in the format `VE-YYMMDD-####`, and its submission time is recorded.
- Success screen showing the enquiry ID, a "Share on WhatsApp" button with the details pre-filled, and a clear note that the enquiry is not a confirmed appointment.
- An optional email alert to the business via Resend.

**Admin dashboard** (`/admin`)
- Sign in through Supabase Auth. There is **no public registration**. Roles are `admin` and `staff`.
- 8 dashboard widgets and a list of the latest enquiries.
- Enquiry list: search by name, phone or ID; filter by status, category, brand and date range; change status quickly; call or WhatsApp the customer directly; pagination.
- Enquiry detail: customer photos (via signed URLs that expire after 1 hour), status history, assigned technician, diagnosis, estimate, final cost, parts used, warranty notes and internal notes.
- Reports (admin only): daily, weekly and 12-month enquiry counts, a category breakdown, brand-wise counts, completed repairs and revenue.
- CSV export (admin only). Cells that could run as spreadsheet formulas are neutralised.
- Settings (admin only): manage verified service areas and view staff accounts.

**Business details editable in the admin** (`/admin/business`, admin only)
- Name, logo, phone, WhatsApp, email, address, map, hours, years of experience, supported brands, home visit / workshop / pickup options, warranty terms, and which marketing claims are confirmed. Changes reach the website within about a minute, with no code changes or redeploy.

**Security**
- Row Level Security is on for every table. Anonymous users have **no** direct access to tables. Enquiries go through the server API.
- Staff access is checked in three places: middleware, `requireStaff()` in every page and action, and RLS in the database.
- The service-role key is used only in server-only modules (`import "server-only"`).
- Security headers are set, and `/admin` is marked noindex.

## No invented information

Every business detail (phone, WhatsApp, address, hours, years of experience, warranty, map, reviews link) comes from **Admin → Business details**, with environment variables as a fallback. **If a value is blank, the element that uses it is hidden.** Other rules:
- **Reviews:** the reviews list in `src/content/reviews.ts` is empty. Add only genuine reviews.
- **Claims:** marketing claims appear only when ticked in Admin → Business details.
- **Structured data:** there is no `aggregateRating`, and no fake ratings anywhere.
- **Service areas:** these are managed in the admin panel. None are pre-filled.
- **Photos:** a neutral illustration is shown until real workshop photos are added (see `src/config/images.ts`).

See **docs/LAUNCH_CHECKLIST.md** for everything the business must confirm before going live.

## Project structure

```
src/
  app/
    (site)/            public pages (layout with header/footer)
    admin/             login, actions and the (panel) dashboard pages
    api/enquiries      public enquiry endpoint
    api/admin/export   CSV export
    sitemap.ts, robots.ts
  components/          UI blocks, header/footer, enquiry form, landing template
  config/              site (env-driven), navigation, claims, images, legal
  content/             page content: TV services, problems, brands, electronics, FAQ, blog, reviews
  lib/                 validation, constants, Supabase clients, auth, SEO, schema, security
  middleware.ts        protects /admin
supabase/migrations/   database schema, RLS, storage buckets, business settings
supabase/tests/        database security tests (run with scripts/test-db.sh)
tests/unit/            unit + API logic tests (npm test)
tests/e2e/             Playwright browser tests (npm run test:e2e)
docs/                  deployment, environment, admin guide, launch checklist, testing report
```

## Documentation
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Supabase and Vercel deployment, step by step
- [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md): every environment variable
- [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md): creating staff accounts and day-to-day use
- [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md): business facts to confirm before launch
- [docs/FINAL_PRODUCTION_READINESS.md](docs/FINAL_PRODUCTION_READINESS.md): **current status, score and blockers**
- [docs/FINAL_PROJECT_AUDIT.md](docs/FINAL_PROJECT_AUDIT.md), [docs/GITHUB_CI_REPORT.md](docs/GITHUB_CI_REPORT.md), [docs/SUPABASE_PRODUCTION_VERIFICATION.md](docs/SUPABASE_PRODUCTION_VERIFICATION.md), [docs/END_TO_END_TEST_REPORT.md](docs/END_TO_END_TEST_REPORT.md)
- [docs/SEO_LAUNCH_REPORT.md](docs/SEO_LAUNCH_REPORT.md), [docs/SECURITY_PERFORMANCE_REPORT.md](docs/SECURITY_PERFORMANCE_REPORT.md), [docs/VERCEL_DEPLOYMENT_REPORT.md](docs/VERCEL_DEPLOYMENT_REPORT.md), [docs/PRODUCTION_LAUNCH_TEST_REPORT.md](docs/PRODUCTION_LAUNCH_TEST_REPORT.md), [docs/POST_LAUNCH_GROWTH_PLAN.md](docs/POST_LAUNCH_GROWTH_PLAN.md)
- [docs/PRODUCTION_VERIFICATION_REPORT.md](docs/PRODUCTION_VERIFICATION_REPORT.md): latest verification results and readiness score (58/100)
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md): exact Supabase production setup and live verification
- [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md): original readiness assessment
- [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md): full project audit
- [docs/TESTING_REPORT.md](docs/TESTING_REPORT.md): executed vs written vs manual tests, with raw output in `docs/test-results/`
- [docs/SEO_REPORT.md](docs/SEO_REPORT.md), [docs/SECURITY_REPORT.md](docs/SECURITY_REPORT.md), [docs/BROWSER_TESTING_REPORT.md](docs/BROWSER_TESTING_REPORT.md)
