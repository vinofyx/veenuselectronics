# Veenus Electronics – Phases 4–6 (contact, images, speed)
Date: 25 Nov 2026 · Local dev server http://localhost:3001 · Nothing deployed; no Supabase, DNS or GitHub changes.
The brief arrived cut off inside phase 6 (after "Reduce unnecessary client components"); phases 6 (rest)–10 are pending.

## Phase 4 – Contact and booking (crawl of all 51 pages)
| Action | Destination found | Occurrences |
|---|---|---|
| Call Now (all variants) | tel:+916300473113 | 148 + header/footer numbers |
| Second number | tel:+916300985787 | footer, header bar, contact/booking pages |
| WhatsApp / WhatsApp Us / Book on WhatsApp | https://wa.me/916300473113 (prefilled message) | 200+ |
| WhatsApp second number | https://wa.me/916300985787 (only on Contact/Book Repair; comes from NEXT_PUBLIC_WHATSAPP_NUMBER_SECONDARY in your settings) | 2 |
| SMS | sms:+916300473113 / sms:+916300985787 | 3 |
| Email | mailto:n.vikram1086@gmail.com | 103 |
| Get directions | Google Maps search for "Door No. 8-08-007, Doventon Road, Bollaram, PIN 500010, India" | 55 |
| Book Repair / Book a Repair / More booking options | /book-repair (HTTP 200) | 150+ |

Consistency: only the two phone numbers, one email and one address appear anywhere on the site. No form, no booking confirmation or success message is shown on any public page. Backend (API, database, admin) untouched.
Not tested: actually placing a call, sending a WhatsApp/SMS or opening the mail app (these hand off to the phone/OS).

## Phase 5 – Images
- All 19 photos now served from the site itself (`public/images/photos/`), descriptive file names, AVIF with WebP fallback, 4 sizes each (480/768/1080/1440 px) = 152 files. Zero requests to Unsplash (verified).
- Every image has width/height, alt text describing the scene, `sizes`/`srcset`; below-the-fold images lazy-load; homepage hero is eager + high priority (verified).
- Cache header for /images and /brand: 30 days (verified on the running server).
- Removed decorative/filler images: photos behind every dark CTA banner; random blog-list covers; generic photos on all 9 brand pages and the brand index; service-areas hero; electronics-index hero (duplicated a card photo).
- No images on Contact, FAQ, legal, blog, book-repair, how-it-works, service-areas (verified).
- Kept: homepage hero + 6 problem photos; one relevant photo per service/problem/electronics page (desktop only); electronics cards; one repair photo on About.
- Brand logos: NOT added. Manufacturer logos on an independent repair site can suggest authorisation, which the project rules forbid. Brand names are shown as text.
- About Us: still a stock soldering photo — no real workshop photo is available. Replace with your own (instructions in `src/config/images.ts`).
- Removed from config (unreferenced): `precision`, `circuitMacro`. `src/components/BrandHeroPanel.tsx` is unused; left in place (file deletion not enabled).

Homepage image weight (all 7 photos, mobile + desktop): 194 KB measured.

## Phase 6 (partial) – Speed
- Pages are statically generated (revalidated hourly); client JavaScript is limited to header, CTA tracking, mobile bar, floating WhatsApp and business context.
- `Photo` is now a server component (no JavaScript shipped for images).
- Inner-page hero photos are not downloaded on mobile where they are hidden.
- Unsplash preconnect removed (no longer needed).

## Not verified
- TypeScript, lint, unit/e2e tests, production build: run `run-verification.cmd`.
- Lighthouse / real page-speed numbers: need a production build (dev server is not representative).
