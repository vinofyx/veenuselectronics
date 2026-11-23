# Supabase production verification (Phase 6)

## Status: ⏳ Not verified live. No Supabase project or credentials exist yet.

## What has been verified (executed on PostgreSQL 16 with a mocked Supabase `auth`/`storage` schema)
| Item | Result |
|---|---|
| All 3 migrations apply in order, and re-apply cleanly | ✅ |
| Tables, triggers, enquiry number, status history | ✅ |
| Private photo bucket; public logo bucket | ✅ (policies) |
| RLS: anonymous visitors, non-staff, staff, admin | ✅ 37/37 |
| Staff limited to repair columns; cannot delete or change settings | ✅ |
| Business settings persistence, constraints, single row, inspection charges and equipment (migration 3) | ✅ |
| Rate-limit function only callable by the server | ✅ |
| `verify.sql` configuration checks | ✅ 16/16 on the local copy |
| Duplicate protection and rate limiting logic (API layer) | ✅ unit tests |

## What still needs the real project
| Item | How it will be verified |
|---|---|
| Live tables, RLS and buckets | `supabase/verify.sql` in the SQL Editor (all OK) |
| Sign-ups disabled | `npm run verify:supabase` |
| Admin and staff login and permissions | `verify:supabase` with `TEST_ADMIN_*` / `TEST_STAFF_*` |
| Enquiry insert and retrieval, status history | `verify:supabase` |
| Photo upload, privacy (no public URL, no anonymous signed URL or upload) | `verify:supabase` |
| Duplicate protection, validation, cross-site posts | `verify:supabase` with `SITE_URL` (a Vercel preview) |
| Rate limiting | `verify:supabase --rate-limit` (**test project only**) |
| Business settings persistence through the admin UI | `tests/e2e/admin.spec.ts` with test credentials |

## What you need to do
1. Create **two** Supabase projects, `veenus-test` and `veenus-production` (Mumbai region). Steps: [SUPABASE_SETUP.md](SUPABASE_SETUP.md).
2. In each: run the 3 migrations in order; turn off sign-ups; create your admin account (and a test admin and staff account in the test project).
3. Run `supabase/verify.sql`: every row should say OK.
4. **Do not paste keys into this chat.** Put test keys in GitHub repository secrets and production keys in Vercel (marked Sensitive). Then either run `npm run verify:supabase` yourself, or let Claude run it through the CI and preview once the secrets are in place.
