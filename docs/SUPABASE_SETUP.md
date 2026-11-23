# Supabase production setup (exact steps)

Allow about 20 minutes. You need a Supabase account (the free plan is enough to start). Do these steps **twice**: once for a **test** project (used by automated tests) and once for **production**.

## 1. Create the project
1. Go to https://supabase.com/dashboard → **New project**.
2. Name: `veenus-production` (or `veenus-test`). Choose a strong database password and save it in your password manager.
3. Region: **South Asia (Mumbai) – ap-south-1**, the closest to customers in Hyderabad.
4. Wait until the project shows "Healthy".

## 2. Apply the database migrations
1. Open **SQL Editor → New query**.
2. Paste the whole of `supabase/migrations/20261123000000_initial_schema.sql` and click **Run**. Expected result: "Success. No rows returned".
3. New query: paste `supabase/migrations/20261124000000_business_settings_and_hardening.sql` and click **Run**.
4. New query: paste `supabase/migrations/20261125000000_inspection_and_equipment.sql` and click **Run**.
5. All three files can be re-run safely if anything is interrupted. Always run them in this order.

(With the Supabase CLI instead: `supabase link --project-ref <ref>` then `supabase db push`.)

## 3. Authentication settings
**Authentication → Sign In / Providers:**
- **Email:** enabled.
- **Allow new users to sign up:** **OFF**. This is required; staff accounts are created by you.
- **Confirm email:** ON.

**Authentication → Policies / Password security** (names vary by plan):
- Minimum password length: **10** or more.
- Leaked-password protection: ON (if your plan offers it).

**Authentication → URL Configuration:**
- Site URL: your production address, e.g. `https://www.veenuselectronics.in` (a Vercel preview URL for the test project).

## 4. Create the first admin
1. **Authentication → Users → Add user → Create new user.** Enter the email and a strong password, and tick "Auto Confirm User".
2. Copy the user's **UID**.
3. In SQL Editor:
   ```sql
   insert into public.admin_users (id, name, email, role)
   values ('PASTE-UID', 'Owner Name', 'owner@example.com', 'admin');
   ```
4. For each staff member, repeat with `'staff'` as the role.
5. **Test project only:** also create one test admin and one test staff account for the automated tests.

## 5. Check the configuration
In SQL Editor, run `supabase/verify.sql`. **Every row must say `OK`.**

## 6. Collect the keys
**Project Settings → API (API Keys):**
| Value | Where it goes | Secret? |
|---|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | no |
| `anon` / **publishable** key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | no (protected by RLS) |
| `service_role` / **secret** key | `SUPABASE_SERVICE_ROLE_KEY` | **YES. Server only, never in a `NEXT_PUBLIC_` variable, never shared** |

In Vercel, add the secret key with the **Sensitive** option ticked.

## 7. Live verification (real project, real requests)
Run from any computer with Node 18+ (no install needed):
```bash
SUPABASE_URL=https://xxxx.supabase.co \
SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=... \
TEST_ADMIN_EMAIL=... TEST_ADMIN_PASSWORD=... \
TEST_STAFF_EMAIL=... TEST_STAFF_PASSWORD=... \
SITE_URL=https://your-preview.vercel.app \
npm run verify:supabase            # add -- --rate-limit on the TEST project only
```
On Windows PowerShell, set each variable with `$env:NAME="value"` first.

It checks:
- the tables and migrations
- anonymous visitors are blocked from enquiries and photos
- the server can insert enquiries
- photos are private (no public URL; no anonymous signed URL or upload)
- **public sign-ups are off**
- staff can update repair fields but not customer details, and cannot delete or change business settings
- admin can update business settings, and unsafe links are rejected
- through the website: enquiry and photo saved, duplicate returns the same number, invalid mobile rejected, cross-site posts rejected
- optionally, the rate limit

It deletes its own test rows (all named "ZZ Verification Test") and exits non-zero if anything fails.

## 8. Before go-live
- [ ] `verify.sql` shows all OK on **production**
- [ ] `npm run verify:supabase` passes on **test** (with `SITE_URL` and `--rate-limit`) and on **production** (without `--rate-limit`)
- [ ] Sign in at `/admin` and fill in **Admin → Business**
- [ ] Add your real service areas in **Admin → Settings**
- [ ] Back-ups: the free plan has daily back-ups with short retention; consider the Pro plan for point-in-time recovery once the business relies on it
