# Vercel deployment report (Phase 11)

## Status: ❌ Not started. Nothing has been deployed, and nothing will be published to production without your explicit approval.

Prerequisites not yet met: successful GitHub CI, the GitHub repository, and Supabase projects.

## Plan (preview first)
1. **Vercel account:** https://vercel.com/signup, using "Continue with GitHub" (the same account that owns the repo).
2. **Add New → Project →** import `veenus-electronics` (private). Grant the Vercel GitHub App access to that repository only.
3. **Build settings:** Framework **Next.js** (auto). Build command `npm run build`. Install command `npm ci` (after the lockfile is committed). Node **22.x**. Root directory `./`.
4. **Environment variables** (ENVIRONMENT.md):
   - **Preview** environment → the **test** Supabase project keys, `NEXT_PUBLIC_SITE_URL` = the preview URL, `RATE_LIMIT_SALT`.
   - **Production** environment → the **production** Supabase keys (service role marked **Sensitive**), `NEXT_PUBLIC_SITE_URL=https://<your domain>`, `RATE_LIMIT_SALT` (a different value), optional Resend and GA4.
   - Do **not** set the CI dummy phone number anywhere in Vercel.
5. **Deploy a preview:** push a branch (e.g. `preview`) or use "Deploy". Vercel builds a preview URL.
6. **Test the preview:**
   - `E2E_BASE_URL=<preview-url> E2E_WITH_BACKEND=1 … npm run test:e2e`
   - `SITE_URL=<preview-url> … npm run verify:supabase`
   - Manually: an enquiry with a photo, admin login, mobile check on a real phone, images and storage.
7. **Prepare production:** promote only after the preview passes **and you approve**. Domain steps are in DEPLOYMENT.md §3 (Phase 12, also approval-only).

## Domain (Phase 12): needs your input
- Tell Claude the domain name. Do you already own it, and where is DNS managed?
- Claude prepares the exact DNS records. **You** (or Claude with your explicit approval) apply them.
- Then: HTTPS (automatic on Vercel), a www/non-www redirect to a single canonical domain, and on production: sitemap, robots.txt, all routes, contact links, forms and admin login. Submit the sitemap in Search Console.
