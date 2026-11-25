# Veenus Electronics – Vercel Pre-Deployment & Rollback Checklist

This document details the step-by-step sequence for a controlled, owner-authorized production deployment on Vercel.

> [!CAUTION]
> **DO NOT EXECUTE THESE STEPS WITHOUT EXPLICIT OWNER AUTHORIZATION.**  
> DNS cutover and production domain activation must never be automated without prior owner sign-off.

---

## 1. Step-by-Step Pre-Deployment Sequence

### Step 1: Create the Vercel Project
- Log in to the business Vercel account.
- Click **Add New... → Project**.
- Assign the project name: `veenus-electronics`.

### Step 2: Connect the Approved Git Repository
- Import the approved repository containing the verified codebase.
- Ensure the production branch is designated (e.g., `main` or `release`).

### Step 3: Configure Framework & Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `next build` (standard Vercel default; do not override).
- **Output Directory:** Standard Next.js default (`.next`).
- **Node.js Version:** 20.x or 22.x (compatible with `"node": ">=18.18.0"` in `package.json`).

### Step 4: Configure Environment Variables
- In Vercel Project Settings → **Environment Variables**, add all keys specified in [docs/VERCEL_ENVIRONMENT_SETUP.md](file:///D:/veenuelectronics/docs/VERCEL_ENVIRONMENT_SETUP.md):
  - `NEXT_PUBLIC_SITE_URL` (Set to `https://veenuselectronics.com` in Production; leave blank in Preview).
  - Business details: `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_BUSINESS_EMAIL`, `NEXT_PUBLIC_BUSINESS_ADDRESS_*`, `NEXT_PUBLIC_GOOGLE_MAPS_URL`.
  - Supabase keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Sensitive toggle checked).
  - Resend keys: `RESEND_API_KEY`, `ENQUIRY_NOTIFY_EMAIL`, `ENQUIRY_FROM_EMAIL`.
  - Security: `RATE_LIMIT_SALT` (32+ random characters).

### Step 5: Verify Supabase Project & Backups
- Confirm migrations have been applied to the Supabase database.
- Confirm initial admin user exists in `auth.users` and `public.admin_users`.
- Take a pre-deployment database backup in the Supabase Dashboard (**Database → Backups → Backup Now**).

### Step 6: Deploy to a Vercel Preview Environment
- Trigger a build on a preview branch (e.g. `preview` or pull request).
- Inspect the build log to ensure 57 static pages generate cleanly with exit code 0.

### Step 7: Run Preview Smoke Tests (Desktop & Mobile)
- Open the assigned preview URL (`https://<project>-<branch>.vercel.app`) on both a desktop computer and a physical mobile smartphone.
- Verify typography, spacing, responsive navigation drawer, and visual contrast.
- Ensure zero horizontal scrolling and zero broken images.

### Step 8: Test Admin Authentication & Workflows
- Navigate to `/admin/login`.
- Sign in with the test admin credentials.
- Verify enquiry listing renders, status badges display properly, and business settings can be updated.
- Verify unauthenticated requests redirect to `/admin/login`.

### Step 9: Test Contact Actions on Mobile Device
- Tap **Book on WhatsApp**: Confirm WhatsApp launches with the pre-filled enquiry message.
- Tap **Call Now**: Confirm phone dialer opens with `+91 63004 73113` (and secondary `+91 63009 85787`).
- Tap **SMS**: Confirm native SMS app opens.
- Tap **Get Directions**: Confirm Google Maps opens to the Bollaram workshop location.

### Step 10: Verify Canonical URLs, Sitemap, Robots, and HTTPS
- Inspect page source: verify `<link rel="canonical" href="https://veenuselectronics.com/..." />`.
- Visit `/sitemap.xml`: verify all 51 active URLs are listed and return HTTP 200.
- Visit `/robots.txt`: verify `/admin` and `/api/` are disallowed and sitemap is linked.
- Verify HTTPS connection displays a valid TLS certificate.

### Step 11: Confirm Rollback Readiness
- Familiarize the team with the Vercel instant rollback mechanism (Section 2 below).

### Step 12: Obtain Owner Approval for Production Deployment
- Present the verified preview URL and test outcomes to the business owner.
- Obtain explicit written approval before proceeding to production build.

### Step 13: Obtain Separate Owner Approval Before DNS Cutover
- In Vercel Project Settings → **Domains**, add `veenuselectronics.com` and `www.veenuselectronics.com`.
- Obtain explicit authorization from the owner to update domain DNS records (A Record: `76.76.21.21`, CNAME: `cname.vercel-dns.com`).
- Verify SSL certificate provisions automatically upon DNS propagation.

### Step 14: Submit Production Sitemap to Google Search Console
- Open Google Search Console for `https://veenuselectronics.com`.
- Submit `https://veenuselectronics.com/sitemap.xml`.
- Monitor indexing status and Core Web Vitals report.

---

## 2. Instant Rollback Procedure

Vercel provides atomic, immutable deployments. If an unexpected issue occurs post-launch:

1. Go to **Vercel Dashboard → Project → Deployments**.
2. Locate the previous known-good deployment (e.g., the last verified stable build).
3. Click the three dots menu (`...`) next to that deployment.
4. Select **Instant Rollback (Promote to Production)**.
5. Within 5–10 seconds, Vercel shifts 100% of incoming edge traffic back to the previous deployment.
6. No rebuilding or DNS modification is required for a rollback.
