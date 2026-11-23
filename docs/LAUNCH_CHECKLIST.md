# Remaining manual configuration and launch blockers

Nothing on this list can be done in code: each item needs an account, a credential, or a fact only the business owner can confirm.

## A. Blockers: the site cannot go live without these
| # | Item | Who | How |
|---|---|---|---|
| A1 | **Run the real install and production build** and fix anything it reports | Claude, once GitHub is linked | GitHub Actions (`.github/workflows/ci.yml`), or a PC with internet. Commit the generated `package-lock.json`. |
| A2 | **Run the browser tests** (`npm run test:e2e`) and the manual visual check | You / a developer | BROWSER_TESTING_REPORT.md |
| A3 | **Create the test and production Supabase projects** and run both migrations; `verify.sql` all OK; `npm run verify:supabase` passes | You | SUPABASE_SETUP.md |
| A4 | Turn **off** "Allow new users to sign up" in Supabase Auth | You | DEPLOYMENT.md §1.4 |
| A5 | Create the first **admin account** | You | ADMIN_GUIDE.md |
| A6 | **Phone and WhatsApp number.** Without these there are no Call or WhatsApp buttons, which are your main way of getting enquiries. | Owner | Admin → Business details |
| A7 | **Shop address and city.** Confirm whether it really is Hyderabad. | Owner | Admin → Business details |
| A8 | **Vercel project** with environment variables (`NEXT_PUBLIC_SITE_URL`, Supabase keys, `RATE_LIMIT_SALT`) | You | ENVIRONMENT.md |
| A9 | **Domain and DNS.** Not done; needs your approval. | You | DEPLOYMENT.md §3 |
| A10 | Run one live test enquiry with a photo on the production site and confirm it appears in the admin | You | – |

## B. Strongly recommended before launch
| # | Item | Where |
|---|---|---|
| B1 | Real workshop or technician photos for the hero and About page (the brief requires authentic imagery; an illustration is shown now) | `public/images/` + `src/config/images.ts` |
| B2 | Email alerts: Resend account, verified domain, 3 environment variables | DEPLOYMENT.md §4 |
| B3 | Google Business Profile with the same name, address and phone | SEO_REPORT.md |
| B4 | GA4 property and Search Console verification; submit the sitemap | DEPLOYMENT.md §5 |
| B5 | Review the brands and services you actually offer; untick the rest | Admin → Business details |
| B6 | Tick only the website claims that are true; add years of experience and warranty terms if verified | Admin → Business details |
| B7 | Add verified service areas | Admin → Settings |
| B8 | Confirm data-retention periods and jurisdiction; have the Privacy Policy and Terms reviewed | `src/config/legal.ts` |
| B9 | Decide on the button contrast fix (orange is 2.59:1, below accessibility guidelines) | BROWSER_TESTING_REPORT.md §2 |
| B10 | Hero headline "…at Affordable Prices … experienced technicians" was copied from the brief; confirm it | `src/app/(site)/page.tsx` |
| B11 | `NEXT_PUBLIC_SITE_URL` set to the final domain, then redeploy | Vercel |

## C. After launch
- Add genuine Google reviews to `src/content/reviews.ts` (with permission), and keep the reviews link up to date.
- Add a Content-Security-Policy in report-only mode (SECURITY_REPORT.md).
- Schedule deletion of old records and photos once retention periods are confirmed (DEPLOYMENT.md, "Data retention").
- Watch PageSpeed Insights and Search Console coverage.
