# Production readiness

## Score: 58 / 100 (revised 23 Nov 2026, was 54) · not ready to launch yet

The latest breakdown and what changed are in [PRODUCTION_VERIFICATION_REPORT.md](PRODUCTION_VERIFICATION_REPORT.md). The table below is the original 54-point assessment.

The code is feature-complete, and its security model has been tested on a real database. But the site has **never been built or opened in a browser**, it has never been connected to a real Supabase project, and the business's own details (phone, WhatsApp, address) don't exist yet. Those gaps, not the code, are what hold the score down.

| Area | Weight | Score | Why |
|---|---|---|---|
| Feature completeness | 20 | **18** | Every feature in both briefs is implemented: public site (51 pages), enquiry system, WhatsApp/call, admin dashboard, reports, CSV, admin-editable business settings. The 2 missing points are for real photography. |
| Build verified (real `tsc`, ESLint, `next build`) | 15 | **3** | Not run: dependencies couldn't be installed. Only the syntax check and the stubbed type check passed. **The biggest single risk.** |
| Database and security | 15 | **13** | 35/35 RLS and privilege tests on real PostgreSQL; secret-exposure analysis clean; 5 security fixes this pass. Not yet confirmed against live Supabase Auth and Storage. |
| Automated tests executed | 10 | **7** | 63 unit/API tests and 35 database tests executed and passing. The Playwright suite (5 viewports) is written and type-checked but not run. |
| Browser and responsive verification | 10 | **1** | Not executed. Code-level review only. |
| Live integrations (Supabase, auth, storage, email) | 10 | **1** | No Supabase project or credentials exist yet. |
| SEO | 10 | **8** | All on-page items implemented and checked by tests; the screen-repair gap was filled and over-long descriptions fixed. Not measured on a live site; Google Business Profile not set up. |
| Business configuration and content | 10 | **3** | The system is complete (editable in the admin), but the actual phone, WhatsApp, address, hours, photos and reviews still have to be supplied. |
| **Total** | 100 | **54** | |

**Expected after the blockers are cleared:** once `npm run verify` and `npm run test:e2e` pass (fixing anything they find), Supabase is connected, and the business details are entered, the score should rise to about **85–90**. The remainder is real photography, reviews and post-launch tuning.

## Blockers before launch (in order)
1. **Run the real build:** `npm install && npm run verify`. Free up disk space on your PC, or push to GitHub and let the CI workflow run it.
2. **Run the browser tests:** `npm run test:e2e` on 5 viewports, plus the 10-minute manual visual check.
3. **Create the Supabase project**, run both migrations, turn off public sign-ups, and create the admin account.
4. **Enter the business details** in Admin → Business details. Phone and WhatsApp are essential; nothing converts without them.
5. **Set up Vercel and the environment variables.** Domain and DNS changes are only made with your approval.
6. **Do one live test enquiry** with a photo and confirm it reaches the admin and the email alert.

Everything else is in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

## What changed in this pass
- **Phase 8:** an admin-editable Business details page, covering name, logo, phone, WhatsApp, email, address, map, hours, experience, brands, service options, warranty and claims, backed by a new table, RLS and a logo bucket.
- **Security:** staff limited to repair-workflow columns; the API's fake success for fast human submits replaced with a real error; duplicate-submission protection; the salt no longer derives from the service-role key; canonical URLs no longer fall back to localhost on Vercel.
- **SEO:** new TV Screen Repair page; 5 over-long meta descriptions fixed; schema type corrected to LocalBusiness.
- **Resilience:** error boundaries for the public site and the admin.
- **Testing:** 63 unit/API tests, 35 database tests (both executed), a Playwright suite on 5 viewports (written), and a GitHub Actions workflow that runs everything.
- **Reports:** audit, testing, SEO, browser, security, and this readiness assessment.
