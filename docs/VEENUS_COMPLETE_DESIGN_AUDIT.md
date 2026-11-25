# Veenus Electronics — Complete Design Audit & Redesign Log

Date: 24 Nov 2026 · Scope: every public route in `src/app/(site)` (51 routes) + shared layout.
Backup of all files touched: `backups/veenus-backup-pre-redesign-20261124-204155.zip`.

> Status legend used in this document: **Implemented** = code written to the project.
> Browser/test verification is recorded separately in `VEENUS_ALL_PAGES_TEST_REPORT.md`.

## 1. Route inventory (audited)

| Group | Routes | Rendered by |
|---|---|---|
| Home | `/` | `app/(site)/page.tsx` |
| TV repair | `/tv-repair` + 7 (LED, LCD, Smart, OLED, QLED, Android, 4K) | `tv-repair/page.tsx`, `tv-repair/[slug]` → `LandingTemplate variant="service"` |
| TV problems | `/tv-problems` + 11 (incl. HDMI, Screen Repair) | `tv-problems/page.tsx`, `[slug]` → `variant="problem"` |
| Brands | `/tv-brand-repair` + 9 | `tv-brand-repair/page.tsx`, `[slug]` → `variant="brand"` |
| Electronics | `/electronics-repair` + 6 | `electronics-repair/page.tsx`, `[slug]` → `variant="electronics"` |
| Info | About, Contact, Book Repair, FAQ, How It Works, Service Areas, Customer Reviews | own page files |
| Guides | `/blog` + 3 posts | `blog/page.tsx`, `blog/[slug]` |
| Legal | Privacy Policy, Terms and Conditions | own page files + `LegalNav` |
| System | 404 (`app/not-found.tsx`), error boundary (`(site)/error.tsx`) | |

Admin routes (`/admin/*`) were **not** changed.

## 2. Problems found in the audit

1. Desktop nav wrapped to two lines at 1366px (confirmed in browser before changes) — nav shown from 1280px with roomy padding and no `white-space: nowrap`.
2. Hero visual was a hand-drawn SVG placeholder.
3. All inner pages shared one flat navy hero with a decorative circle and no imagery.
4. Service cards were all identical; no distinction between primary and secondary categories.
5. **Fabricated / unverified content** shown to customers:
   - Hard-coded `9:00 AM - 9:00 PM (Monday - Sunday)` fallback hours on every landing page sidebar and the Book Repair page (no hours are configured in Admin).
   - Hard-coded workshop address string in `LandingTemplate` (now read from business settings).
   - "Bollaram, Secunderabad, and Hyderabad" and "home visit… across Bollaram and Hyderabad" coverage claims; "Instant estimate", "Fast response".
   - Hard-coded "Service Modes: Home Visit, Workshop Repair & Pickup/Delivery" (now from settings).
6. Book Repair used an undefined class `bg-brand-secondary`.
7. Footer listed TV HDMI under problems but nav lacked Restarting / Wi-Fi; electronics menu lacked DVD Player.
8. Body text used `slate-*` greys inconsistent with the brand muted colour.

## 3. Design system (Implemented)

- **Colours** (`tailwind.config.ts`): navy `#102D4F` (`brand-800`), deep navy `#091D33` (`brand-900`), blue `#1C4775` (`brand-600`), orange `#FF841F` (`accent`), light bg `#F4F7FB` (`page`), text `#142E4C` (`ink`), muted `#64758B` (`ink-muted`).
- **Type**: Plus Jakarta Sans (display, 500–800) + Inter (body) via `next/font`. Fluid display sizes `text-display-xl/lg/md` (clamp) for confident headings without clipping on phones.
- **Radii**: 12 / 16 / 24 / 28px. **Shadows**: `card`, `card-hover`, `float`, `header` — all navy-tinted, subtle.
- **Buttons**: 44px min height everywhere, `whitespace-nowrap`; accent, primary, outline, WhatsApp, ghost-on-dark.
- **Texture**: one restrained "tech-grid" line pattern on dark panels instead of glows/circles.
- `scroll-padding-top: 6rem` so anchors never land under the sticky header.

## 4. Header & navigation (Implemented)

- Single row from 1280px: links 14px / `px-2.5`, 15px / `px-3.5` from 1536px, `whitespace-nowrap` on every label.
- Between 1280–1359px the Call button shows icon only (aria-label "Call Now – number"); full "Call Now" label from 1360px. Book Repair always labelled.
- Below 1280px: hamburger → right-side slide-in drawer (`#mobile-menu`) with accordions, 44–52px tap targets, call/WhatsApp/book actions and full contact details.
- Dropdowns: TV Repair is a two-column panel with descriptions; hover-intent close delay; Escape and outside-click close; active page marked.
- Slim deep-navy utility bar (desktop) with both phone numbers + email; scrolls away, header stays sticky.

## 5. Homepage (Implemented)

Hero (two-column, headline with orange emphasis, spec copy, Book / Call / WhatsApp, 4 factual benefits) → trust strip → TV services (3 photo cards + 4 compact cards) → dark "What is your TV doing?" problem section with numbered symptom tiles → brands → process timeline → other electronics with photo → dark "Why choose" panel with photo → booking + contact details split panel → two-column FAQ → premium footer.

## 6. Inner pages (Implemented)

| Page type | Distinct treatment |
|---|---|
| TV service pages | Page photo in hero, numbered content cards, brands grid |
| TV problem pages | "Diagnostic flow": numbered vertical steps (symptoms → checks → causes → diagnosis → repair), safety notice |
| Brand pages | Hero panel with large brand wordmark (text only, no logos) + independence chip; brand disclaimer |
| Electronics pages | Equipment photo, numbered cards |
| All landing pages | Lead paragraph, inline contact band, FAQ accordion, related-repair cards with icons, sticky booking sidebar (both numbers, WhatsApp, SMS, link to written enquiry) |
| TV Repair index | Photo cards for 3 primary types, standard cards for the rest, symptom chips, brands |
| TV Problems index | Problems grouped (Power / Picture / Boards) with group headings |
| Brands index | Large wordmark cards + independence notice |
| Electronics index | Photo card grid |
| About | Photo story, values grid, why-choose cards, dark process timeline |
| Contact | Contact tiles (both numbers, both WhatsApp, email, address + directions), service areas, sticky enquiry form |
| Book Repair | 3 booking channels (call / WhatsApp / SMS) for both numbers, link to written form, preparation list, next steps, workshop panel (hours only if configured) |
| FAQ / How it works / Service areas / Reviews / Guides / Legal / 404 | Each has its own layout (sticky help panel, timeline + info cards, service-option cards, honest empty state, photo guide cards + article sidebar, legal side-nav, "No signal" 404) |

## 7. Enquiry form (Implemented)

Same validation (zod) and same real API (`/api/enquiries`). Added: required-fields progress bar, error summary, `aria-invalid` + `aria-describedby` on fields, in-flight guard against double submission, clearer server-error state that confirms input is preserved, restyled success state (shows the real enquiry ID returned by the server — nothing is simulated).

## 8. Imagery

Free-licence Unsplash photos served from Unsplash's CDN (`src/config/images.ts`), sized with `srcset`, each with descriptive alt text, and a branded fallback panel if an image fails (`components/Photo.tsx`). **They are illustrative stock, not photos of the Veenus workshop**, and are not captioned as such. Recommended: replace with real workshop photos by changing `src` to `/images/…`.

Logo: no official logo file exists in the project or in Admin settings, so a brand mark (TV outline + orange signal "V") + wordmark is used, and the same mark is the icon-only favicon (`public/icon.svg`). Uploading a logo in Admin → Business details replaces it everywhere automatically.

## 9. Business-claim rules honoured

No ratings, testimonials, years of experience, opening hours, extra locations or manufacturer authorisation are stated. Experience, warranty and hours render only when set in Admin. Independent-service disclaimers on all brand surfaces and in the footer.

## 10. Known decisions / open items

- `/book-repair` stays form-free because `tests/e2e/conversion-and-screenshots.spec.ts` asserts no `<form>` there; it links to the form on `/contact-us#enquiry`.
- `tests/e2e/enquiry-journey.spec.ts` expects a form at `#enquiry` on problem pages, which the previous version had already removed. That test is backend-only (skipped without `E2E_WITH_BACKEND`) and will fail if enabled — needs a decision.
