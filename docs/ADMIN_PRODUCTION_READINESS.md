# Veenus Electronics – Admin Dashboard Production Readiness Audit

This document provides a technical audit of the Admin Dashboard (`/admin`) for Veenus Electronics, detailing authentication, authorization boundaries, database migrations, security controls, and verification status.

> [!IMPORTANT]
> **Admin Dashboard Status:** Fully preserved and active in the codebase.
> Public customer booking forms have been removed (replaced by direct phone, WhatsApp, and SMS actions), but the internal staff dashboard for managing repair enquiries, staff notes, and business settings remains enabled.

---

## 1. Architecture & Security Boundaries

### 1.1 Middleware Protection (`src/middleware.ts`)
- **Scope:** Protects all routes matching `["/admin/:path*", "/api/admin/:path*"]`.
- **Unconfigured Handling:** If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing:
  - Accessing `/admin/login` renders normally (preventing redirect loops).
  - Accessing any protected admin page immediately redirects to `/admin/login?error=config`.
- **Session Validation:** When Supabase is configured, middleware executes `supabase.auth.getUser()`.
  - Unauthenticated requests are redirected to `/admin/login?next=<path>`.
  - Authenticated sessions attempting to visit `/admin/login` are redirected to `/admin`.
- **Public Isolation:** Public pages (`/`, `/tv-repair/*`, `/tv-problems/*`, `/contact-us`, etc.) do **not** run Supabase authentication checks in middleware. The customer-facing website remains 100% operational and high-performance regardless of database connectivity.

### 1.2 Multi-Layer Server Authorization (`src/lib/auth.ts`)
- In addition to middleware, every server component page and server action in `/admin` invokes `requireStaff()`.
- `requireStaff()` verifies:
  1. An active user session exists in Supabase Auth.
  2. The authenticated `user.id` exists in the `public.admin_users` table.
  3. The account has `active = true`.
  4. Role requirements (`admin` vs. `staff`) are enforced for privileged actions (such as CSV export or staff management).

### 1.3 Client vs. Server Supabase Separation
- **Public Client:** Only uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Subject to strict PostgreSQL Row Level Security (RLS).
- **Service-Role Client (`src/lib/supabase/admin.ts`):** 
  - Uses `SUPABASE_SERVICE_ROLE_KEY`.
  - Protected with `import "server-only";` (compiler error if bundled into client code).
  - Used strictly on the server for privileged operations (reading unassigned enquiries, inserting audit notes, accessing private storage).

---

## 2. Database Migrations & Supabase Configuration

The application requires three migrations located in `supabase/migrations/`:

| Migration File | Description | Core Tables / Objects Created |
|---|---|---|
| `20261123000000_initial_schema.sql` | Core schema, staff table, enquiries, and security | `admin_users`, `repair_enquiries`, `enquiry_number_seq`, `repair_photos`, RLS policies, trigger functions |
| `20261124000000_business_settings_and_hardening.sql` | Admin-editable business settings and security hardening | `business_settings` (singleton row `id=1`), audit triggers, public read / staff write RLS |
| `20261125000000_inspection_and_equipment.sql` | Inspection policy and equipment filtering | Adds `inspection_charges` and `supported_equipment` columns to `business_settings` |

### Required Supabase Storage Bucket
- **Bucket Name:** `enquiry-photos` (or `repair-photos`)
- **Public Access:** **Disabled (Private)**
- **RLS Policy:** Read and write restricted strictly to authenticated staff in `admin_users` or server-only service-role client.

---

## 3. Production Readiness & Verification Status Matrix

| Component / Feature | Verification Level | Status | Notes & Evidence |
|---|---|---|---|
| Middleware Route Matching | Local Test & Build | **VERIFIED** | Playwright test `tests/e2e/admin.spec.ts` confirms unauthenticated users are redirected to `/admin/login`. |
| Missing Configuration Fallback | Local Test & Build | **VERIFIED** | Code handles missing env vars cleanly with `/admin/login?error=config` without crashing server. |
| Server-Only Secret Protection | Local Test & Build | **VERIFIED** | Client bundle scan of 231 files confirmed zero leaks of `SUPABASE_SERVICE_ROLE_KEY`. |
| Form Validation & Zod Schemas | Local Unit Tests | **VERIFIED** | 81 unit tests in `tests/unit/` pass with exit 0 (`validation.test.ts`, `business.test.ts`). |
| User Authentication Flow | Test Database Required | **REQUIRING TEST SUPABASE** | Skipped locally by design (`E2E_WITH_BACKEND=1`). Requires a test Supabase instance to verify `signInWithPassword()`. |
| Row Level Security (RLS) Policies | Test Database Required | **REQUIRING TEST SUPABASE** | Validated via `supabase/tests/rls_test.sql` specification, but requires active PostgreSQL instance to execute live RLS checks. |
| Enquiry Status & Notes Update | Test Database Required | **REQUIRING TEST SUPABASE** | `UpdateForm.tsx` server action is typechecked, but end-to-end database mutation requires backend connection. |
| Admin CSV Export (`/api/admin/export`) | Test Database Required | **REQUIRING TEST SUPABASE** | Route is protected by `requireStaff('admin')`; live CSV download requires test database records. |
| Production Credentials Verification | Production Setup | **REQUIRING PROD CREDENTIALS** | The live Supabase production project must have migrations applied and admin user created. |

---

## 4. Required Supabase Setup Sequence for Owner

Before the admin dashboard can be used in production, the owner must complete the following steps in their Supabase project:

1. **Apply Database Migrations:**
   Run the SQL scripts in order in the Supabase SQL Editor:
   - `supabase/migrations/20261123000000_initial_schema.sql`
   - `supabase/migrations/20261124000000_business_settings_and_hardening.sql`
   - `supabase/migrations/20261125000000_inspection_and_equipment.sql`
2. **Create Initial Admin User:**
   - In Supabase Dashboard → **Authentication → Users**, create an email/password user (e.g. `n.vikram1086@gmail.com`).
   - Copy the generated `User UID`.
   - In SQL Editor, link the user to the admin staff table:
     ```sql
     insert into public.admin_users (id, name, email, role, active)
     values ('<USER-UID>', 'Vikram N', 'n.vikram1086@gmail.com', 'admin', true);
     ```
3. **Create Private Storage Bucket:**
   - In Supabase Dashboard → **Storage**, create bucket `repair-photos` (Public: Off).
4. **Copy API Credentials to Vercel:**
   - Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy Project Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy Project Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
