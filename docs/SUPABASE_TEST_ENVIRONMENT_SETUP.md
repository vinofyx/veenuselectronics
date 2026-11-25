# Veenus Electronics – Test Supabase Environment Setup Guide

This guide details the procedure for provisioning and verifying a **separate, isolated test Supabase project** dedicated to Vercel Preview testing and automated verification.

> [!CAUTION]
> **DO NOT APPLY THESE STEPS TO THE PRODUCTION DATABASE.**  
> Preview environments must never connect to or mutate live production customer data. Always use a dedicated test Supabase project.

---

## 1. Migration Architecture & Audit

The database schema is defined across three ordered SQL migration files in `supabase/migrations/`:

| Migration File | Sequence | Dependencies | Idempotency | Security Policies & Scope |
|---|---|---|---|---|
| `20261123000000_initial_schema.sql` | 1 | Base schema | Fully Idempotent (`if not exists`, `or replace`) | Enables RLS on all 6 tables (`admin_users`, `repair_enquiries`, `repair_photos`, `repair_status_history`, `service_categories`, `service_areas`). Anonymous direct table access denied. Provisions private `repair-photos` storage bucket. |
| `20261124000000_business_settings_and_hardening.sql` | 2 | Requires `admin_users`, `is_admin()` from Migration 1 | Fully Idempotent (`insert on conflict`, `alter table`) | Creates singleton `business_settings` (id=1). Enforces column-level privilege hardening: staff update restricted to workflow columns; anon write revoked. Provisions public `site-assets` bucket. |
| `20261125000000_inspection_and_equipment.sql` | 3 | Requires `business_settings` from Migration 2 | Fully Idempotent (`add column if not exists`) | Adds `inspection_charges` text column and `supported_equipment text[]` column with check constraints. |

### Migration Verification Summary
- **Execution Order:** Must be executed in numerical sequence: `20261123000000` → `20261124000000` → `20261125000000`.
- **Dependencies:** Migration 2 foreign-keys `updated_by` to `admin_users(id)`; Migration 3 alters `business_settings` created in Migration 2.
- **Idempotency:** Safe to run repeatedly without generating duplicate table or column errors.
- **Access Control:** All mutations by customers are channeled through server API endpoints using `SUPABASE_SERVICE_ROLE_KEY`. Staff access uses authenticated Supabase sessions checked against `admin_users`.

---

## 2. Step-by-Step Test Supabase Project Provisioning

### Step 1: Create a Dedicated Test Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New Project**.
3. Name the project: `veenus-electronics-preview` (or `veenus-test`).
4. Select the region closest to your users: **South Asia (Mumbai) - ap-south-1**.
5. Save the generated database password in a secure password manager.

### Step 2: Apply Migrations in Sequence
1. In the Supabase Dashboard, open **SQL Editor** (`/sql`).
2. Open a new query tab and execute the contents of:
   - `supabase/migrations/20261123000000_initial_schema.sql`
   - Click **Run** and verify `Success. No rows returned`.
3. Open another query tab and execute:
   - `supabase/migrations/20261124000000_business_settings_and_hardening.sql`
   - Click **Run** and verify success.
4. Open another query tab and execute:
   - `supabase/migrations/20261125000000_inspection_and_equipment.sql`
   - Click **Run** and verify success.

---

## 3. Creating and Linking the Test Admin User

The admin dashboard requires an active record in both `auth.users` and `public.admin_users`.

### Step 1: Create the User in Supabase Auth
1. Go to **Authentication → Users** (`/auth/users`).
2. Click **Add User → Create User**.
3. Enter:
   - **Email:** `test-admin@veenuselectronics.com` (or your test email)
   - **Password:** Choose a secure test password (min 8 characters)
   - **Auto Confirm User:** Checked (Yes)
4. Click **Create User**.
5. Copy the generated **User UID** (UUID string, e.g. `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Step 2: Link the User to `public.admin_users`
1. Go to **SQL Editor**.
2. Run the following query, replacing `<USER-UID>` with the copied UID:
   ```sql
   insert into public.admin_users (id, name, email, role, active)
   values (
     '<USER-UID>',
     'Test Administrator',
     'test-admin@veenuselectronics.com',
     'admin',
     true
   )
   on conflict (id) do update set
     role = 'admin',
     active = true;
   ```
3. Verify by querying:
   ```sql
   select id, name, email, role, active from public.admin_users;
   ```

---

## 4. Storage Buckets Verification

The migrations automatically create the required storage buckets:
- **`repair-photos`:** Private bucket (Public: Off). File size limit: 5 MB. Allowed MIME types: JPEG, PNG, WebP, HEIC.
- **`site-assets`:** Public bucket (Public: On). File size limit: 1 MB. Allowed MIME types: PNG, JPEG, WebP, SVG.

In Supabase Dashboard → **Storage**, verify that both buckets are visible with the appropriate public flags.

---

## 5. Automated Verification Using `scripts/verify-supabase.mjs`

The project includes an automated test script (`scripts/verify-supabase.mjs`) that validates schema tables, RLS enforcement, anonymous blocking, staff privileges, and storage buckets without mutating business data.

### To Run Verification on Test Project:
In your local command terminal (with Node.js installed), set the test environment variables and run:

```cmd
set SUPABASE_URL=https://<your-test-project-id>.supabase.co
set SUPABASE_ANON_KEY=<your-test-anon-key>
set SUPABASE_SERVICE_ROLE_KEY=<your-test-service-role-key>
set TEST_ADMIN_EMAIL=test-admin@veenuselectronics.com
set TEST_ADMIN_PASSWORD=<your-test-admin-password>

node scripts/verify-supabase.mjs
```

### Expected Output:
- Table existence: PASS for all 7 tables.
- Anonymous visitor: PASS (anon cannot read enquiries, anon cannot insert directly, anon can read public settings).
- Service role: PASS (service role can insert and read test row).
- Admin sign-in: PASS (admin can read enquiries, staff list, update workflow columns).
- Test rows tagged `ZZ Verification Test` are automatically cleaned up upon test completion.
