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

## 3. GitHub Repository Status

The codebase has been pushed to your GitHub repository:
- **Repository URL:** `https://github.com/vinofyx/veenuselectronics.git`
- **Branch:** `main`
- **Initial Commit:** `7ae54df` (Veenus Electronics TV repair website)
- **Current Head Commit:** `0f16e4e` (Update Veenus Electronics website - premium upgrade, form-free contact flow, mobile LCP improvements, docs, and Vercel preview readiness)
- **Security Audit:** All `.env*` files, local test logs, scratch scripts, and secret-bearing configs were strictly excluded by `.gitignore`. Zero credentials committed.

---

## 4. Connecting the GitHub Repository to Vercel

1. Log in to your [vercel.com](https://vercel.com) account.
2. Click **Add New... → Project**.
3. Under **Import Git Repository**, select your GitHub account and find `veenuselectronics`.
4. Click **Import**.
5. In the configuration screen:
   - Ensure Framework is set to **Next.js**.
   - Root Directory: `./`
   - Build Command: default (`npm run build` / `next build`)
   - Expand **Environment Variables**.
   - Input the **Preview** environment variables listed in Section 2 (using your test Supabase credentials).
6. Click **Deploy**.
7. Vercel will build the project and output a unique preview URL:  
   `https://veenuselectronics-<hash>.vercel.app`
