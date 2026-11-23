# Environment variables

Copy `.env.example` to `.env.local` for local development, and add the same keys in **Vercel → Project → Settings → Environment Variables** (Production, and Preview if you use it).

> Variables starting with `NEXT_PUBLIC_` are included in the browser bundle, so put only public information in them. **Never** put the service-role key or the Resend key in a `NEXT_PUBLIC_` variable.
>
> `NEXT_PUBLIC_` values are fixed when the site is built. After you change one in Vercel, **redeploy** so it takes effect.

## Site

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.veenuselectronics.in` | No trailing slash. Used for canonical URLs, the sitemap and Open Graph. If missing on Vercel, the site falls back to the Vercel production URL and logs a warning. |

## Business details (leave blank until verified)

> **Easier: use Admin → Business details.** Values saved there take priority over these variables and need no redeploy. These variables are only fallbacks (for example before Supabase is set up). If neither is set, the website hides whatever depends on it.

| Variable | What it controls |
|---|---|
| `NEXT_PUBLIC_BUSINESS_PHONE` | `tel:` links and all **Call** buttons. Use E.164 format, e.g. `+919876543210`. |
| `NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY` | How the number appears on screen, e.g. `+91 98765 43210`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | All **WhatsApp** buttons, the floating button and the post-enquiry share. Digits only, with country code: `919876543210`. |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Footer, contact page, privacy contact and the Reply-To on alert emails. |
| `NEXT_PUBLIC_BUSINESS_ADDRESS_STREET`, `_LOCALITY`, `_CITY`, `_STATE`, `_POSTCODE` | Shop address, LocalBusiness schema, and the city used in page titles ("… in Hyderabad"). |
| `NEXT_PUBLIC_BUSINESS_LAT`, `NEXT_PUBLIC_BUSINESS_LNG` | Google Maps embed and geo schema. |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | "Get directions" button (use the Share link from Google Maps). |
| `NEXT_PUBLIC_GOOGLE_REVIEWS_URL` | "View reviews on Google" button. |
| `NEXT_PUBLIC_WORKING_HOURS` | Shown in the footer and contact page, e.g. `Mon–Sat 10:00 AM – 8:00 PM`. |
| `NEXT_PUBLIC_YEARS_EXPERIENCE` | A number only. Turns on the "X+ years of experience" claim. |
| `NEXT_PUBLIC_WARRANTY_TEXT` | Turns on the "Repair warranty" claim and adds a line to the Terms. |

## Supabase

| Variable | Where to find it | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page → `anon` `public` key | Public (protected by RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → `service_role` key | **Secret, server only** |

## Notifications (optional)

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | From resend.com. Leave blank to turn off email alerts. **Secret.** |
| `ENQUIRY_NOTIFY_EMAIL` | Address(es) that receive new-enquiry alerts. Separate several with commas. |
| `ENQUIRY_FROM_EMAIL` | Sender on a domain verified in Resend, e.g. `Veenus Website <alerts@veenuselectronics.in>` |

## Security

| Variable | Notes |
|---|---|
| `RATE_LIMIT_SALT` | A long random string used to hash IP addresses before storing them. Generate one with `openssl rand -hex 32`. **Secret.** Required in production (a warning is logged if missing). |

## End-to-end tests only (never set these in production)

| Variable | Notes |
|---|---|
| `E2E_BASE_URL` | Test an already-running site, for example a Vercel preview URL. Default: starts `npm run start` locally. |
| `E2E_WITH_BACKEND` | Set to `1` when the site is connected to a **test** Supabase project, to run the enquiry and login tests |
| `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` | Test admin account (admin dashboard tests) |
| `E2E_STAFF_EMAIL` / `E2E_STAFF_PASSWORD` | Test staff account (permission tests) |

## Analytics / verification (optional)

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 measurement ID (`G-XXXXXXX`). When set, the GA4 script loads and these events are sent: `click_call`, `click_whatsapp`, `click_book_repair`, `enquiry_submit_attempt`, `enquiry_submit_success`, `enquiry_submit_error`. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | The `content` value from Search Console's "HTML tag" verification method. |
