# Veenus Electronics – Vercel Preview Verification Test Plan

This document outlines the structured test plan to verify the Vercel Preview deployment (`https://<project>-<branch>.vercel.app`).

---

## 1. Test Suite Summary & Backend Dependency Matrix

| Test Suite / Category | Scope | Requires Test Supabase? | Execution Device |
|---|---|---|---|
| **1. Public Routes & Navigation** | All 51 public routes, header dropdowns, footer links | No (Static pages) | Desktop & Mobile |
| **2. Responsive UI & Layout** | Viewports: 1920x1080, 1366x768, 768x1024, 390x844 | No | Chrome, Safari, Mobile Browser |
| **3. Direct Contact Actions** | Phone `tel:`, WhatsApp `wa.me`, SMS `sms:` | No | Physical Smartphone |
| **4. Contact Details & Maps** | Address, opening hours, Google Maps directions | No | Desktop & Mobile |
| **5. SEO, Sitemap & Robots** | Metadata, canonical tags, `/sitemap.xml`, `/robots.txt` | No | Browser & Curl |
| **6. Admin Authentication** | Sign-in at `/admin/login`, invalid password, role checks | **YES** | Desktop Browser |
| **7. Admin Enquiry Management** | Listing, status update, diagnostic notes, CSV export | **YES** | Desktop Browser |
| **8. Admin Business Settings** | Editing business phone, hours, supported equipment | **YES** | Desktop Browser |
| **9. Photo Upload & Storage** | Admin photo view, private bucket permission checks | **YES** | Desktop Browser |
| **10. Session Security & Expiry** | Cookie expiry, unauthorized redirect, route protection | **YES** | Desktop Browser |
| **11. Database Offline Fallback** | Unconfigured database behavior on public routes & login | No / Sim test | Desktop & Mobile |

---

## 2. Detailed Test Cases

### Suite 1: Public Routes & Content Integrity (51 Routes)
- **Objective:** Verify that every public route returns HTTP 200 without runtime errors.
- **Test Procedure:**
  1. Visit Homepage (`/`).
  2. Visit `/book-repair` (confirm zero forms; direct call, WhatsApp, SMS actions rendered).
  3. Visit all TV Service landing pages:
     - `/tv-repair`
     - `/tv-repair/led-tv-repair`
     - `/tv-repair/lcd-tv-repair`
     - `/tv-repair/smart-tv-repair`
     - `/tv-repair/oled-tv-repair`
     - `/tv-repair/qled-tv-repair`
     - `/tv-repair/android-tv-repair`
     - `/tv-repair/4k-tv-repair`
  4. Visit all 7 TV Problem pages:
     - `/tv-problems`
     - `/tv-problems/tv-not-turning-on`
     - `/tv-problems/tv-black-screen`
     - `/tv-problems/tv-sound-but-no-picture`
     - `/tv-problems/tv-screen-lines`
     - `/tv-problems/tv-backlight-repair`
     - `/tv-problems/tv-motherboard-repair`
     - `/tv-problems/tv-hanging-restarting`
  5. Visit all 9 Brand Repair pages:
     - `/tv-brand-repair`
     - `/tv-brand-repair/samsung-tv-repair`
     - `/tv-brand-repair/lg-tv-repair`
     - `/tv-brand-repair/sony-tv-repair`
     - `/tv-brand-repair/mi-tv-repair`
     - `/tv-brand-repair/oneplus-tv-repair`
     - `/tv-brand-repair/tcl-tv-repair`
     - `/tv-brand-repair/vu-tv-repair`
     - `/tv-brand-repair/hisense-tv-repair`
     - `/tv-brand-repair/haier-tv-repair`
  6. Visit Electronics repair pages:
     - `/electronics-repair`
     - `/electronics-repair/home-theatre-repair`
     - `/electronics-repair/speaker-repair`
     - `/electronics-repair/amplifier-repair`
     - `/electronics-repair/projector-repair`
     - `/electronics-repair/dvd-player-repair`
     - `/electronics-repair/set-top-box-repair`
  7. Visit Company & Legal pages:
     - `/about-us`, `/how-it-works`, `/customer-reviews`, `/service-areas`, `/faq`, `/blog`, `/privacy-policy`, `/terms-and-conditions`, `/contact-us`.
- **Pass Criteria:** All pages return HTTP 200, render with high visual contrast, and show zero broken images or console errors.

---

### Suite 2: Responsive Layout & Mobile Usability
- **Test Procedure:**
  1. Test at desktop viewport (1920x1080 and 1366x768): Header navigation with dropdowns displays properly with correct z-index over page content.
  2. Test at tablet viewport (768x1024): Navigation collapses gracefully, grid columns shift cleanly.
  3. Test at mobile viewport (390x844):
     - Hamburger menu toggles navigation drawer smoothly.
     - Sticky bottom action bar displays: "Call" and "Book on WhatsApp".
     - Sticky bar hides cleanly when reaching the footer contact card.
     - Horizontal scrolling is completely absent (`document.documentElement.scrollWidth === window.innerWidth`).

---

### Suite 3: Contact Actions (Physical Mobile Testing)
- **Test Procedure:**
  1. Tap **Primary Call Button**: Native phone dialer opens with `+916300473113`.
  2. Tap **Secondary Call Button**: Native phone dialer opens with `+916300985787`.
  3. Tap **Primary WhatsApp Button**: WhatsApp opens with pre-filled message:  
     `"Hi Veenus Electronics, I would like to book a repair for my TV."`
  4. Tap **Secondary WhatsApp Button**: WhatsApp opens on secondary account.
  5. Tap **SMS Button**: Native messaging app opens with pre-filled SMS text.
  6. Tap **Get Directions**: Google Maps opens with destination pinned to `Doventon Road, Bollaram`.

---

### Suite 4: SEO Metadata, Sitemap & Robots
- **Test Procedure:**
  1. Inspect `<head>` on `/`: verify `<title>`, `<meta name="description">`, `<meta property="og:image">`, and `<link rel="canonical" href="...">`.
  2. Open `/sitemap.xml`: verify XML format, `<loc>` URLs, priority values, and all 51 routes included.
  3. Open `/robots.txt`: verify `Disallow: /admin` and `Disallow: /api/`, with sitemap link present.
  4. Verify `/admin/login` has `<meta name="robots" content="noindex, nofollow">` or `X-Robots-Tag`.

---

### Suite 5: Admin Authentication (Requires Test Supabase)
- **Test Procedure:**
  1. Navigate to `/admin/login`.
  2. Attempt login with empty credentials → client validation error shown.
  3. Attempt login with wrong password → displays "Invalid email or password."
  4. Attempt login with a Supabase auth user who is **not** in `admin_users` table → displays "This account does not have admin access."
  5. Log in with verified test admin (`test-admin@veenuselectronics.com`) → redirects to `/admin` dashboard.
  6. Click **Sign Out** → clears session cookies and redirects to `/admin/login`.

---

### Suite 6: Admin Enquiry Management (Requires Test Supabase)
- **Test Procedure:**
  1. Open `/admin/enquiries`.
  2. Filter by status (e.g. "New", "Inspection Scheduled").
  3. Open an individual enquiry detail page (`/admin/enquiries/[id]`).
  4. Update status to "Inspection Scheduled", assign technician, enter diagnosis notes and estimated cost.
  5. Click **Save Changes** → verifies database mutation and status history timeline insertion.
  6. Click **Export CSV** (as admin) → downloads valid `.csv` file with correct columns.

---

### Suite 7: Business Settings Management (Requires Test Supabase)
- **Test Procedure:**
  1. Open `/admin/business`.
  2. Modify working hours (e.g. `Mon-Sat 9:30 AM - 8:30 PM`).
  3. Save changes.
  4. Visit public `/contact-us` page in an incognito window → verify updated working hours reflect immediately on the website without rebuild.

---

### Suite 8: Photo Storage & Permissions (Requires Test Supabase)
- **Test Procedure:**
  1. Verify private bucket `repair-photos` cannot be browsed publicly via browser URL.
  2. Verify admin panel generates signed URLs to render photos securely for authenticated staff.

---

### Suite 9: Error Handling When Supabase is Unavailable
- **Test Procedure:**
  1. In a test preview branch with dummy/invalid Supabase URL:
     - Public website pages still load instantly and cleanly (zero database dependency).
     - `/admin/login` displays a clean configuration notice (`error=config`) without server 500 error.
     - Direct contact actions (phone, WhatsApp, SMS) remain 100% operational.
