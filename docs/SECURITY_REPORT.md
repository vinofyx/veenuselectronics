# Security testing report

## Tested and passing (executed)
| Area | Test | Result |
|---|---|---|
| Row Level Security, all 7 tables | 35 SQL assertions on PostgreSQL 16, covering anonymous visitors, logged-in non-staff users, staff and admins | ✅ 35/35 |
| Column-level privileges (**new**) | Staff cannot change customer name, mobile or enquiry number, or forge status history | ✅ |
| Private photo storage | Anonymous visitors can't list photos; nobody except the server writes to the photo bucket; staff can't upload site assets | ✅ (storage policies tested on a mocked storage schema) |
| Server-side validation | 23 validation tests plus 14 API-logic tests | ✅ |
| Upload content check | A PHP, SVG, GIF or PDF renamed as `.jpg` is rejected by checking the file's real content | ✅ |
| Rate limiting | 6th enquiry from one IP within an hour → 429; another IP is unaffected; the database function is callable only by the server (**re-asserted in migration 2** after `verify.sql` showed a later blanket grant could re-expose it) | ✅ |
| Duplicate submissions | The same mobile, equipment and problem within 15 minutes returns the existing enquiry number | ✅ |
| Spam | Honeypot gives a silent decoy with nothing stored; too-fast submissions get a visible error (fixed: they previously got a fake success) | ✅ |
| CSV formula injection | `=`, `+`, `-` and `@` cells neutralised | ✅ |
| PostgREST filter injection (admin search) | Filter syntax stripped | ✅ |
| Secret exposure | No client component imports server-only code; the service-role key is read only in `lib/supabase/admin.ts`; the salt no longer derives from it | ✅ (static analysis) |

## Defences in the code (not tested live: needs Supabase and a built site)
| Control | Where |
|---|---|
| Admin authentication: Supabase Auth email + password, no public sign-up UI | `/admin/login`, `actions.ts` |
| Three authorisation layers: middleware → `requireStaff()` on every page and action → RLS | `middleware.ts`, `lib/auth.ts`, migrations |
| Admin-only features: reports, export, business details, settings | `requireStaff("admin")` plus the RLS `is_admin()` check |
| Same-origin check on the enquiry API (blocks posts from other websites) | `lib/security.ts` |
| IP addresses stored only as salted hashes | `lib/security.ts` |
| HTML escaping in email alerts | `lib/notify.ts` |
| JSON-LD escaping (`<` → `<`) | `components/JsonLd.tsx` |
| Security headers: HSTS, nosniff, frame-options, referrer policy, permissions policy; `/admin` noindex | `next.config.mjs` |
| Signed photo URLs that expire after 1 hour | admin enquiry page |
| Business-settings constraints: https-only links (blocks `javascript:`), phone format, single row | migration 2 |

## Live verification (ready, not executed: no credentials)
`supabase/verify.sql` (15 checks, run in the SQL Editor) and `npm run verify:supabase` (live HTTP tests of RLS, auth, staff/admin permissions, private storage, sign-ups off, API validation, duplicates, cross-site posts, optional rate limit). See SUPABASE_SETUP.md.

## Manual security steps (required before launch)
1. **Supabase → Authentication → Settings: turn OFF "Allow new users to sign up".** RLS already stops strangers seeing data, but this closes the door entirely.
2. Use strong, unique admin passwords. Turn on Supabase MFA (TOTP) for admin accounts if your plan allows it.
3. Set `RATE_LIMIT_SALT` to a long random value (`openssl rand -hex 32`).
4. Never put `SUPABASE_SERVICE_ROLE_KEY` in a `NEXT_PUBLIC_` variable. In Vercel, mark it "Sensitive".
5. Run the e2e tests against a **separate test Supabase project**, never production.

## Recommendations (not implemented; need a decision or a browser test)
| Item | Why it was left |
|---|---|
| Content-Security-Policy header | Without a browser test it could silently break Google Analytics, the Maps embed or Next's scripts. Add it after the first deploy, in report-only mode first. |
| Automatic deletion of old photos and records | The retention periods in the privacy policy need your confirmation first. A ready SQL example is in DEPLOYMENT.md. |
| CAPTCHA (e.g. Cloudflare Turnstile) | The honeypot, timing check, rate limit and duplicate check should be enough for a local business. Add a CAPTCHA only if spam appears. |
| App-level login lockout | Supabase Auth already rate-limits sign-in attempts. |
