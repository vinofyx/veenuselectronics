# Veenus Electronics – Vercel Preview Configuration & GitHub Guide

This document details the exact project settings, environment variable partitioning, and GitHub connection procedure for deploying Veenus Electronics to a secure **Vercel Preview** environment.

---

## 1. Vercel Project Build & Runtime Settings

Configure these exact settings in the Vercel Dashboard under **Project Settings → General**:

| Setting Name | Value | Rationale |
|---|---|---|
| **Framework Preset** | Next.js | Automatically configures edge routing, server actions, and asset optimization. |
| **Root Directory** | `./` | The project is located at the repository root. |
| **Build Command** | `npm run build` (or default `next build`) | Uses the verified Next.js 15.5 production compile script. |
| **Install Command** | `npm ci` | Strictly adheres to the committed `package-lock.json` (243 KB), ensuring identical dependency versions. |
| **Output Directory** | Standard (`.next`) | Default Next.js build artifact location. |
| **Node.js Version** | **20.x** (or **22.x**) | Compatible with `"engines": { "node": ">=18.18.0" }` in `package.json` and React 19. |

---

## 2. Environment Variable Partitioning (Preview vs. Production)

Vercel allows assigning variables per environment (**Production**, **Preview**, **Development**).

> [!IMPORTANT]
> **Strict Preview Isolation Rule:**  
> The **Preview** environment must use **Test Supabase credentials only**.  
> The **Production** environment must use **Production Supabase credentials only**.  
> Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RATE_LIMIT_SALT`) must never be prefixed with `NEXT_PUBLIC_`.

### Environment Matrix

| Environment Variable | Preview Environment Value | Production Environment Value | Vercel Scopes | Secret Type |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | *(Leave blank or set to Preview domain)* | `https://veenuselectronics.com` | Production only (blank for Preview) | Public |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<test-project-id>.supabase.co` | `https://<prod-project-id>.supabase.co` | Separate per environment | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<test-anon-key>` | `<prod-anon-key>` | Separate per environment | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | `<test-service-role-key>` | `<prod-service-role-key>` | Separate per environment | **Server-Only Secret** |
| `RESEND_API_KEY` | *(Optional / Test API Key)* | `<prod-resend-api-key>` | Separate per environment | **Server-Only Secret** |
| `ENQUIRY_NOTIFY_EMAIL` | `test-alerts@veenuselectronics.com` | `n.vikram1086@gmail.com` | Separate per environment | **Server-Only Secret** |
| `ENQUIRY_FROM_EMAIL` | `alerts@veenuselectronics.com` | `alerts@veenuselectronics.com` | All environments | **Server-Only Secret** |
| `RATE_LIMIT_SALT` | `<test-salt-random-string>` | `<production-salt-random-string>` | Separate per environment | **Server-Only Secret** |
| `NEXT_PUBLIC_BUSINESS_PHONE` | `+916300473113` | `+916300473113` | All environments | Public |
| `NEXT_PUBLIC_BUSINESS_PHONE_DISPLAY` | `+91 63004 73113` | `+91 63004 73113` | All environments | Public |
| `NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY` | `+916300985787` | `+916300985787` | All environments | Public |
| `NEXT_PUBLIC_BUSINESS_PHONE_SECONDARY_DISPLAY` | `+91 63009 85787` | `+91 63009 85787` | All environments | Public |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `916300473113` | `916300473113` | All environments | Public |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_SECONDARY` | `916300985787` | `916300985787` | All environments | Public |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | `n.vikram1086@gmail.com` | `n.vikram1086@gmail.com` | All environments | Public |
| `NEXT_PUBLIC_BUSINESS_ADDRESS_*` | Bollaram, Hyderabad, PIN 500010 | Bollaram, Hyderabad, PIN 500010 | All environments | Public |
| `NEXT_PUBLIC_GOOGLE_MAPS_URL` | Shop location share link | Shop location share link | All environments | Public |

---

## 3. GitHub Repository Preparation

The local codebase is clean and preflighted. No Git repository has been initialized, committed, or pushed by the assistant, adhering strictly to authorization boundaries.

### Repository Readiness Audit
- **`.gitignore` Coverage:** Explicitly excludes `.env*` (except `.env.example`), `node_modules/`, `.next/`, `.next-prod/`, `test-results/`, `playwright-report/`, `backups/`, `scratch/`, and `setup/*.bundle`.
- **Lockfile Integrity:** `package-lock.json` is committed and up to date with `package.json`.
- **Zero Secrets on Disk:** `.env.local` contains zero server credentials.
- **Helper Script Available:** The root script `push-to-github.cmd` is pre-configured to handle repository initialization, importing the verified commit history, and pushing to the owner's private GitHub repository safely.

### Safe Step-by-Step Instructions for the Owner

Follow these exact steps in your Windows terminal when you are ready to publish the code to a private GitHub repository:

#### Step 1: Create a Private GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Set Repository name: `veenus-electronics`.
3. Select **Private**.
4. **DO NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (the repository must start completely empty).
5. Click **Create repository**.

#### Step 2: Push Using the Pre-Configured Batch Script
In File Explorer, double-click `push-to-github.cmd` (or open Command Prompt in `D:\veenuelectronics` and run):
```cmd
push-to-github.cmd
```
The script will:
- Check that Git is installed.
- Initialize the Git repository with the `main` branch.
- Prompt for your GitHub username.
- Add the remote: `https://github.com/<your-username>/veenus-electronics.git`.
- Safely commit the files (automatically excluding all `.env*` secrets).
- Push to GitHub.

---

## 4. Connecting the GitHub Repository to Vercel

1. Log in to your [vercel.com](https://vercel.com) account.
2. Click **Add New... → Project**.
3. Under **Import Git Repository**, select your GitHub account and find `veenus-electronics`.
4. Click **Import**.
5. In the configuration screen:
   - Ensure Framework is set to **Next.js**.
   - Expand **Environment Variables**.
   - Input the **Preview** environment variables listed in Section 2 (using your test Supabase credentials).
6. Click **Deploy**.
7. Vercel will build the project and output a unique preview URL:  
   `https://veenus-electronics-<hash>.vercel.app`
