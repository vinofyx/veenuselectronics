# Final production readiness (Phase 15)

**Date:** 23 November 2026 · **Score: 34 / 100** on the brief's scoring rubric · **Not ready to launch**

This rubric gives 75 of its 100 points to things that must happen *outside* the code: GitHub CI, the real build, browser tests, live Supabase, deployment and a live enquiry. None of those could be executed yet, so the score is low even though the code itself is in good shape.

| Area | Max | Score | Basis |
|---|---|---|---|
| Local project and code | 10 | **9** | Feature-complete; backed up; secret scan clean; audit done. –1: no lockfile yet. |
| GitHub and CI | 10 | **2** | Workflow and verified commit ready; **no repo, no push, no CI run** |
| Production build | 15 | **2** | Real `tsc` over the tests and the logic they import passes; 4 build/runtime risks fixed earlier. **`next build` never run.** |
| Supabase and security | 15 | **9** | 37/37 RLS tests + `verify.sql` 16/16 on real PostgreSQL; patched Next/React minimums; full security review. **No live project.** |
| Browser and responsive testing | 15 | **1** | Playwright suite on 5 viewports written and type-checked; **never run, no screenshots** |
| SEO | 10 | **8** | All 51 routes validated by executed tests; thin pages fixed; GSC, GA4 and GBP plans ready. –2: not measured live (CWV, indexing). |
| Business configuration | 5 | **3** | Every brief setting editable in the admin and tested; **real business details not entered** |
| Deployment | 10 | **0** | Not started (approval required) |
| Live enquiry testing | 10 | **0** | Not possible without deployment |
| **Total** | **100** | **34** | |

(On the earlier, code-weighted rubric the same project scores about 60, up from 58.)

## Acceptance criteria
| Criterion | Status |
|---|---|
| Existing website preserved | ✅ (backup taken; no features removed) |
| GitHub repository created and verified | ❌ |
| All project files pushed | ❌ (verified commit ready) |
| No secrets committed | ✅ verified in the prepared commit |
| GitHub Actions successful | ❌ not run |
| Actual Next.js production build successful | ❌ not run |
| TypeScript checks successful | 🟡 partial (real compiler on a subset) |
| ESLint checks successful | ❌ not run |
| Unit and API tests successful | ✅ 80/80 (executed here; CI will repeat them) |
| Database security tests successful | ✅ 37/37 |
| Playwright tests successful | ❌ not run |
| All critical routes verified | 🟡 statically (routes, links, metadata); not rendered |
| Supabase production integration verified | ❌ |
| Business information configured | ❌ (needs your details) |
| SEO technical checks completed | 🟡 source-level done; live checks pending |
| Security audit completed | ✅ code-level; live checks pending |
| Vercel preview verified | ❌ |
| Live repair enquiry verified | ❌ |
| Production deployment approved | ❌ (not requested yet) |

## Remaining blockers, in order, and exactly what is needed
1. **GitHub access.** Either reconnect GitHub for this Claude account and organisation, **or** create the private repo yourself and double-click `push-to-github.cmd` (GITHUB_CI_REPORT.md).
2. **Sign in to GitHub in the Claude browser pane** (Ctrl+Shift+B), so Claude can read the CI results if the connector stays unlinked.
3. **First CI run:** fix every real failure, commit the generated `package-lock.json`, and rerun until green. This brings in build, TypeScript, ESLint, Playwright and screenshots.
4. **Supabase test and production projects** (SUPABASE_SETUP.md). Put the test keys in GitHub secrets so the backend e2e tests run.
5. **Business details** in Admin → Business: phone, WhatsApp, confirmed address/city, hours, brands, equipment, services, inspection charges, warranty (only if real).
6. **Vercel preview** with the test Supabase → `test:e2e` + `verify:supabase` against the preview.
7. **Your approval for production + domain** → DNS, HTTPS, Search Console, then the live enquiry test (PRODUCTION_LAUNCH_TEST_REPORT.md).
8. Soon after launch: plan the Next.js 16 upgrade (15.x end of support, per a third-party source).
