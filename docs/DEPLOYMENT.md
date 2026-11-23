# Deployment guide

> **Approval note:** nothing has been deployed and no DNS has been changed. Every step below is for you (or someone you approve) to carry out.

## 0. Verify the build first
On any machine with Node 20+ and internet access:
```bash
npm install
npm run verify        # typecheck + lint + unit tests + production build
npm run test:db       # database security tests (needs PostgreSQL; on Windows use WSL)
```
**No local machine available?** Move `setup/github-ci.yml` to `.github/workflows/ci.yml`, then push the project to a private GitHub repository. That workflow runs all of the above, plus Playwright browser tests on 5 viewports, on every push. The results appear in the repository's **Actions** tab.

## 1. Create the Supabase project
1. Go to https://supabase.com and create a new project. Pick the **Mumbai (ap-south-1)** region so it is close to customers in India.
2. In **SQL Editor**, run **both** migration files, in order:
   1. `supabase/migrations/20261123000000_initial_schema.sql`
   2. `supabase/migrations/20261124000000_business_settings_and_hardening.sql` (business details table, staff column restrictions, logo bucket)
   3. `supabase/migrations/20261125000000_inspection_and_equipment.sql` (inspection charges, supported equipment)
   - This creates the tables, triggers, Row Level Security policies, the private `repair-photos` storage bucket and the seed service categories.
   - If you use the Supabase CLI instead: `supabase link --project-ref <ref>` and then `supabase db push`.
3. Confirm it worked:
   - **Table Editor**: you should see `repair_enquiries`, `repair_photos`, `repair_status_history`, `admin_users`, `service_categories` and `service_areas`, each showing **RLS enabled**.
   - **Storage**: `repair-photos` exists and is **not public**; `site-assets` exists and **is public** (it holds only the logo).
   - **Table Editor → business_settings**: one row with id 1, all values empty.
4. **Authentication → Providers → Email**: keep Email enabled. **Authentication → Settings**: turn **off** "Allow new users to sign up", because staff accounts are created manually.
5. Create the first admin account (see [ADMIN_GUIDE.md](ADMIN_GUIDE.md#creating-staff-accounts)).
6. Sign in at `/admin` and fill in **Business details** (phone, WhatsApp, address, brands, services). Until you do, the Call and WhatsApp buttons stay hidden.

### Test project (recommended)
Create a **second, free Supabase project** for testing, apply the same migrations, and create one test admin and one test staff account. Use its keys for `npm run test:e2e`, or as GitHub secrets (`TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`, `TEST_SUPABASE_SERVICE_ROLE_KEY`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, `E2E_STAFF_EMAIL`, `E2E_STAFF_PASSWORD`). Never run the e2e tests against production: they create test enquiries.

## 2. Deploy to Vercel
1. Push this folder to a GitHub repository (private is recommended).
2. In Vercel, choose **Add New → Project**, import the repository, and leave the framework as **Next.js**.
3. Add every variable from [ENVIRONMENT.md](ENVIRONMENT.md) under **Settings → Environment Variables**.
4. Deploy. The build runs `next build`, so a TypeScript or lint error stops the deploy.

## 3. Connect your domain and turn on HTTPS
1. In Vercel, go to **Settings → Domains** and add `veenuselectronics.in` and `www.veenuselectronics.in` (or your own domain).
2. At your domain registrar, add the DNS records Vercel shows you (an A record for the root domain, a CNAME for `www`).
3. Vercel issues the HTTPS certificate automatically. Set your preferred version (for example `www`) as primary.
4. Update `NEXT_PUBLIC_SITE_URL` to the final domain and **redeploy**.

## 4. Email alerts (optional)
1. Create a Resend account, add your domain and set up the DNS records it asks for (SPF and DKIM).
2. Set `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL` and `ENQUIRY_FROM_EMAIL`, then redeploy.

## 5. Google Search Console and Analytics
1. In **GA4**, create a property and a Web data stream, then set `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
   - In GA4 **Admin → Events**, mark `enquiry_submit_success`, `click_call` and `click_whatsapp` as **Key events** (conversions).
2. In **Search Console**, add a URL-prefix property, choose "HTML tag" verification, set `NEXT_PUBLIC_GSC_VERIFICATION`, redeploy, then click Verify.
3. In Search Console, submit `https://<your-domain>/sitemap.xml`.
4. Create or claim your **Google Business Profile** with the same name, address and phone as the website (consistent details help local SEO), then set `NEXT_PUBLIC_GOOGLE_MAPS_URL` and `NEXT_PUBLIC_GOOGLE_REVIEWS_URL`.

## 6. Post-deployment checks
Work through the test plan in [TESTING_REPORT.md](TESTING_REPORT.md). The essentials:
- [ ] `/sitemap.xml` and `/robots.txt` load
- [ ] Submit a test enquiry with photos → it appears in `/admin` → the email alert arrives
- [ ] Call and WhatsApp buttons open correctly on a real phone
- [ ] A logged-out visitor to `/admin` is sent to the login page
- [ ] The anon key cannot read enquiries (see the RLS test in TESTING_REPORT.md)

## Updating content
- Page text lives in `src/content/*.ts`. Edit it, commit, and Vercel redeploys automatically.
- Service areas are managed in the admin panel (**Settings**). No redeploy is needed; changes appear within an hour.
- Genuine reviews go in `src/content/reviews.ts`.
- Workshop photos: put them in `public/images/` and set the paths in `src/config/images.ts`.

## Data retention
The privacy policy promises to delete photos and records after a period (`src/config/legal.ts`). Supabase does not delete them automatically. Pick one of these:
- Review and delete old enquiries from the Supabase dashboard regularly, or
- Schedule a Supabase **Cron** job (Integrations → Cron), for example:
  ```sql
  delete from public.repair_enquiries
  where status in ('Delivered','Cancelled') and updated_at < now() - interval '24 months';
  ```
  Photo files in Storage have to be removed separately. Use the Storage UI, or an Edge Function that deletes objects under `<enquiry_id>/`.
