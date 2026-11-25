# Veenus Electronics – Vercel Environment Variable Specification

This document provides the complete specification of all environment variables used by the Veenus Electronics Next.js web application.

> [!IMPORTANT]
> **Production Canonical URL:** `https://veenuselectronics.com`  
> Do not activate or configure this domain in Vercel or DNS until the owner has reviewed and authorized production cutover.

---

## 1. Security Architecture & Scoping Principles

1. **Strict Client vs. Server Isolation:**
   - Variables prefixed with `NEXT_PUBLIC_` are inlined into the client-side JavaScript bundles by Next.js at build time and are visible to anyone inspecting network requests or page source.
   - Variables **without** `NEXT_PUBLIC_` (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_SALT`) are strictly server-only. They are never shipped to the browser and are protected by `import "server-only";` compile-time guards.
2. **Never Prefix Secrets with `NEXT_PUBLIC_`:**
   - Under no circumstances should `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, or `RATE_LIMIT_SALT` be prefixed with `NEXT_PUBLIC_`.
3. **Repository Cleanliness:**
   - `.env.local` and any secret-bearing configuration files are strictly excluded from Git via `.gitignore`.
   - `.env.example` must contain placeholder values only.
   - Never paste actual API keys, database passwords, or service-role keys into chat interfaces, AI assistants, or commit messages.

---

## 2. Complete Environment Variable Inventory

| Variable Name | Classification | Requirement Status | Feature Depending On It | Timing | Vercel Environment Scope |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | **Required** | Canonical URLs, Open Graph images, Twitter meta, [sitemap.ts](file:///D:/veenuelectronics/src/app/sitemap.ts), [robots.ts](file:///D:/veenuelectronics/src/app/robots.ts). Value: `https://veenuselectronics.com` | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Required if Admin enabled | Supabase API endpoint for admin login, session management, and image remote patterns. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Required if Admin enabled | Supabase public anonymous API key for client-side and middleware session validation under Row Level Security. | Build & Runtime | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only Secret** | Required if Admin enabled | Service-role administrative access to Supabase ([admin.ts](file:///D:/veenuelectronics/src/lib/supabase/admin.ts)). Bypasses RLS for admin user management and private photo bucket access. | Runtime | Production, Preview, Development |
| `RESEND_API_KEY` | **Server-Only Secret** | Optional | API key for transactional email alerts via Resend ([notify.ts](file:///D:/veenuelectronics/src/lib/notify.ts)). Silently bypassed if unset. | Runtime | Production, Preview, Development |
| `ENQUIRY_NOTIFY_EMAIL` | **Server-Only Secret** | Optional | Recipient email address(es) for new enquiry alerts (comma-separated allowed). | Runtime | Production, Preview, Development |
| `ENQUIRY_FROM_EMAIL` | **Server-Only Secret** | Optional | Verified sender address in Resend (e.g., `Veenus Alerts <alerts@veenuselectronics.com>`). | Runtime | Production, Preview, Development |
| `RATE_LIMIT_SALT` | **Server-Only Secret** | Recommended | Secret salt for SHA-256 IP hashing used in rate limiting ([security.ts](file:///D:/veenuelectronics/src/lib/security.ts)). Falls back to built-in default salt if unset. | Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Public | Optional | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) for anonymous click and pageview tracking ([Analytics.tsx](file:///D:/veenuelectronics/src/components/Analytics.tsx)). | Build & Runtime | Production |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Public | Optional | Google Search Console site verification HTML tag content value ([layout.tsx](file:///D:/veenuelectronics/src/app/layout.tsx)). | Build & Runtime | Production |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Public | Recommended | Primary telephone number in E.164 format (`+916300473113`). Click-to-call across header, hero, contact card, sticky bar. Fallback hardcoded in code if omitted. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY` | Public | Recommended | Human-readable primary telephone display (`+91 63004 73113`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY` | Public | Recommended | Secondary telephone number (`+916300985787`). Dual call actions across all contact touchpoints. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY_DISPLAY` | Public | Recommended | Human-readable secondary telephone display (`+91 63009 85787`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | Recommended | Primary WhatsApp number in international digits-only format (`916300473113`). Direct chat links across all 33 repair landing pages. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_SECONDARY` | Public | Recommended | Secondary WhatsApp number (`916300985787`). Dual WhatsApp options on `/book-repair` and `/contact-us`. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Public | Recommended | Primary customer support email (`n.vikram1086@gmail.com`). `mailto:` links across the website and privacy policy. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_ADDRESS_DOOR` | Public | Recommended | Door number (`Door No. 8-08-007`). Used in Schema.org `LocalBusiness` JSON-LD and footer. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET` | Public | Recommended | Street address (`Doventon Road`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_ADDRESS_LOCALITY` | Public | Recommended | Locality (`Bollaram`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_CITY` | Public | Recommended | City (`Hyderabad`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_STATE` | Public | Recommended | State (`Telangana`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_POSTCODE` | Public | Recommended | Pincode (`500010`). | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_LAT` | Public | Optional | Workshop latitude coordinate (`17.5255`). Local SEO geo-tagging. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_BUSINESS_LNG` | Public | Optional | Workshop longitude coordinate (`78.4988`). Local SEO geo-tagging. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Public | Recommended | Share URL to Google Maps business location in Bollaram. Feeds "Get Directions" buttons. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | Public | Optional | Direct URL for customer Google Business review submission. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_WORKING_HOURS` | Public | Optional | Operating hours string (e.g. `Mon-Sat 10:00 AM - 8:00 PM`). Displayed on Contact Us page and Schema metadata. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_YEARS_EXPERIENCE` | Public | Optional | Years in business (integer). Left blank by default to avoid unverified claims. | Build & Runtime | Production, Preview, Development |
| `NEXT_PUBLIC_WARRANTY_TEXT` | Public | Optional | Specific warranty terms. Left blank by default; receipt-based policy is enforced. | Build & Runtime | Production, Preview, Development |

---

## 3. System and Framework Variables

| Variable | Description |
|---|---|
| `VERCEL_PROJECT_PRODUCTION_URL` | Automatically populated by Vercel in preview and branch deployments. Used as a fallback canonical domain if `NEXT_PUBLIC_SITE_URL` is omitted. |
| `NODE_ENV` | Automatically set by Vercel (`production` during build and live execution). |
| `NEXT_DIST_DIR` | Optional build variable used in local Windows scripts (`.next-prod`). On Vercel, leave unset so Next.js uses the standard `.next` directory. |

---

## 4. Vercel Dashboard Configuration Steps

When creating the Vercel project:

1. Navigate to **Project Settings → Environment Variables**.
2. Add all variables listed in Section 2 with their designated values.
3. For server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_SALT`):
   - Check the **Sensitive** toggle in Vercel to hide the values from team members without elevated permissions.
   - Restrict scope to **Production** and **Preview** environments as appropriate.
4. For `NEXT_PUBLIC_SITE_URL`:
   - In Production: Set to `https://veenuselectronics.com`.
   - In Preview: Leave blank or omit so the application dynamically resolves Vercel's preview URL (`https://<project>-<branch>.vercel.app`).
