# SEO verification report

**Method:** source-code review plus executed automated checks (navigation and SEO unit tests). Checks on the rendered HTML (`tests/e2e/seo.spec.ts`) are written but **not run**, because the site could not be built here.

## Priority keywords → target pages
| Keyword | Target page | Title (city appended only when configured) |
|---|---|---|
| TV Repair | `/` and `/tv-repair` | "TV Repair Service - LED, LCD, Smart, OLED & QLED" / "TV Repair Services - LED, LCD, Smart, OLED, QLED" |
| LED TV Repair | `/tv-repair/led-tv-repair` | "LED TV Repair Service \| Backlight, Power & Board Repair" |
| Smart TV Repair | `/tv-repair/smart-tv-repair` | "Smart TV Repair \| Boot Loop, Wi-Fi, Software & Hardware" |
| Samsung TV Repair | `/tv-brand-repair/samsung-tv-repair` | "Samsung TV Repair \| LED, QLED & Smart TV" |
| LG TV Repair | `/tv-brand-repair/lg-tv-repair` | "LG TV Repair \| LED, NanoCell, OLED & webOS" |
| Sony TV Repair | `/tv-brand-repair/sony-tv-repair` | "Sony TV Repair \| Bravia LED, OLED & Google TV" |
| **TV Screen Repair** | `/tv-problems/tv-screen-repair` **(new in this pass)** | "TV Screen Repair \| Broken & Cracked TV Screen Options" |
| TV Backlight Repair | `/tv-problems/tv-backlight-repair` | "TV Backlight Repair \| LED Strip Replacement" |
| TV Motherboard Repair | `/tv-problems/tv-motherboard-repair` | "TV Motherboard Repair \| Main Board Diagnosis" |

The new screen-repair page is honest about the economics: a cracked panel can only be replaced, never repaired. It sends people whose screen is dark but not cracked to the backlight page.

## Validation of all 51 routes (executed)
`tests/unit/seo.test.ts` reads the metadata of every route, including the 15 static pages:
- 51/51 titles unique; 51/51 descriptions unique; titles 10–70 characters; descriptions 50–160 characters
- each canonical path equals its own route
- each priority keyword has a dedicated page whose title contains it
- no location-stuffed URLs (no "repair-in-…" or "near-me" pages)
- every landing page has at least 120 words of its own content. **10 pages failed and were expanded** with useful, accurate content (pre-booking checks, repair process, FAQs). Lowest is now 144 words.

## Checklist
| Requirement | Status | How it was verified |
|---|---|---|
| Unique page titles | ✅ | Unit test: all 33 landing-page titles unique, ≤60 characters. Static pages reviewed by hand. |
| Meta descriptions | ✅ (fixed) | Unit test: 70–160 characters. **5 were too long and have been shortened.** |
| Canonical URLs | ✅ code / 📝 rendered | `alternates.canonical` on every page. **Fixed:** it no longer falls back to `localhost` on Vercel when `NEXT_PUBLIC_SITE_URL` is missing. |
| XML sitemap | ✅ code / 📝 rendered | `/sitemap.xml`: 51 URLs; brands switched off in the admin are excluded; `/admin` excluded |
| Robots.txt | ✅ code | Allows `/`; disallows `/admin` and `/api/`; links the sitemap |
| LocalBusiness structured data | ✅ code | Only configured fields appear. **Changed** from "ElectronicsStore" (wrong: you're a repair service, not a shop) to `LocalBusiness` with `knowsAbout` repair topics. **No ratings.** |
| Service structured data | ✅ code | On all 33 landing pages, with `areaServed` only when a city is set |
| Breadcrumb structured data | ✅ code | On every inner page, matching the visible breadcrumbs |
| FAQPage | ✅ code | On pages with FAQs. Google currently shows FAQ rich results mainly for government and health sites, so treat it as a minor bonus. |
| Open Graph / Twitter | ✅ code | Title, description, URL, 1200×630 image on every page |
| Image alt text | ✅ code / 📝 rendered | Hero illustration has `role="img"` with a label; uploaded logo images have alt text; e2e test checks for any `<img>` missing alt |
| Internal links | ✅ executed | Navigation test: every header, footer, related and hard-coded link resolves (0 broken) |
| Mobile-first rendering | ✅ code / ❌ browser | Tailwind mobile-first classes, viewport meta. Browser test not run. |
| Indexability | ✅ code | Server-rendered static HTML (SSG/ISR); no `noindex` on public pages; `X-Robots-Tag: noindex` only on `/admin` |
| Core Web Vitals | ❌ not measured | Fonts via `next/font` (no layout shift), inline SVG hero, no third-party JavaScript except optional GA4. Measure with PageSpeed Insights after deploy. |

## Local SEO and the Hyderabad question
The brief says "Hyderabad, Telangana – confirm actual shop location". **The city is not hard-coded anywhere.** When an admin sets the city in **Admin → Business details**, it is added to page titles ("LED TV Repair … in Hyderabad"), the LocalBusiness address, and `areaServed`. Until then, nothing location-specific appears.

**No location pages were generated** (for example "TV repair in Kukatpally"). Verified service areas appear as a list on `/service-areas`, which avoids thin, duplicate pages.

## Off-site actions (manual, these matter most for "TV repair near me")
1. Create or verify a **Google Business Profile** with exactly the same name, address and phone as the website. Category: "Television repair service".
2. Submit `/sitemap.xml` in Search Console.
3. Ask real customers for Google reviews, and link to them from **Admin → Business details → Google reviews link**.
