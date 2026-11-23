# SEO launch report

## 1. Technical checks
| Check | Status | Evidence |
|---|---|---|
| Page titles | ✅ executed | `tests/unit/seo.test.ts`: 51/51 unique, 10–70 characters, priority keyword in the title of its target page |
| Meta descriptions | ✅ executed | 51/51 unique, 50–160 characters |
| Canonical URLs | ✅ executed (source) / ⏳ live | The canonical path equals the route on all 51 pages; never localhost on Vercel |
| XML sitemap | ✅ code / ⏳ live | `/sitemap.xml`, filtered by the brands and equipment the business supports |
| robots.txt | ✅ code / ⏳ live | Disallows `/admin` and `/api/`; points to the sitemap |
| LocalBusiness / Service / Breadcrumb schema | ✅ code / ⏳ rendered | Only configured facts are included; no ratings |
| Image alt text | ✅ code / ⏳ e2e | E2E test fails if any `<img>` lacks alt |
| Internal linking | ✅ executed | 226 internal links checked, 0 broken |
| Thin or duplicate pages | ✅ executed | Every landing page ≥120 words of unique content; no location-stuffed URLs |
| Mobile-first, Core Web Vitals | ⏳ not measured | Needs the deployed site: run PageSpeed Insights (mobile) after the Vercel preview |

## 2. Priority keywords → pages
| Keyword | Page |
|---|---|
| TV repair near me / TV repair shop | `/` + Google Business Profile (the "near me" ranking comes mainly from the GBP) |
| LED TV repair | `/tv-repair/led-tv-repair` |
| Smart TV repair | `/tv-repair/smart-tv-repair` |
| Samsung / LG / Sony TV repair | `/tv-brand-repair/samsung-tv-repair`, `/lg-tv-repair`, `/sony-tv-repair` |
| TV screen repair | `/tv-problems/tv-screen-repair` |
| TV motherboard repair | `/tv-problems/tv-motherboard-repair` |
| TV backlight repair | `/tv-problems/tv-backlight-repair` |

## 3. Google Search Console (after the domain is live)
1. https://search.google.com/search-console → **Add property** → **Domain** (verified by a DNS TXT record; needs your DNS approval) or **URL prefix** (verified by the HTML tag via `NEXT_PUBLIC_GSC_VERIFICATION`, then redeploy).
2. **Sitemaps** → submit `https://<domain>/sitemap.xml`.
3. **URL Inspection** → request indexing for `/`, `/tv-repair/led-tv-repair`, `/tv-problems/tv-screen-repair` and the brand pages you support.
4. After 7 days, check **Pages** (indexed vs excluded) and **Core Web Vitals**.

## 4. Google Analytics 4
1. https://analytics.google.com → create a property ("Veenus Electronics", time zone India, currency INR) → Web data stream for the domain.
2. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-…` in Vercel and redeploy.
3. Events already sent by the site: `click_call`, `click_whatsapp`, `click_book_repair`, `enquiry_submit_attempt`, `enquiry_submit_success`, `enquiry_submit_error` (each with `page_path`, and location or equipment/brand where relevant).
4. **Admin → Events:** mark `enquiry_submit_success`, `click_call` and `click_whatsapp` as **Key events**.
5. Link GA4 to Search Console (Admin → Product links).
6. Consent: GA4 runs with IP anonymisation; the privacy policy already describes analytics.

## 5. Google Business Profile checklist
- [ ] Claim or create the profile with **exactly** the same name, address and phone as Admin → Business (consistent details matter for local ranking).
- [ ] Primary category **"Television repair service"**; secondary "Electronics repair shop" (only if true).
- [ ] Opening hours identical to the website.
- [ ] Services: list each TV repair service and each brand **actually** supported. Never "authorised service centre".
- [ ] Service area: only verified localities (the same as Admin → Settings).
- [ ] Website link to the homepage; appointment link to `/book-repair`.
- [ ] Photos: real shop front, workbench, technicians at work (also usable on the website).
- [ ] Turn on messaging, and add the WhatsApp number if the profile allows it.
- [ ] Copy the review link into Admin → Business → Google reviews link.
- [ ] Post weekly (see the calendar below).

## 6. Local keyword landing-page strategy
**Rule:** no "TV repair in <area>" pages unless each has genuinely unique local content. Thin duplicates hurt rankings.
1. **Now:** one strong `/service-areas` page listing verified localities (from the admin), plus city-level titles once the city is confirmed.
2. **After 2–3 months, using Search Console data:** for any locality bringing real impressions, consider one page per locality, **only** with local substance: travel and pickup arrangements, real jobs done there (with customer permission), landmarks for the shop, local voltage/surge notes. Aim for ≥300 unique words; never reuse the same text with a swapped area name.
3. Brand × problem pages (e.g. "Samsung TV backlight repair") only where Search Console shows demand and there is genuinely brand-specific content.

## 7. 30-day TV repair content calendar
Each blog guide should be practical and original, about 600–900 words, and link to the matching service page plus `/book-repair`. GBP posts are short (about 150 words) with one photo.

| Day | Blog guide (website) | GBP post |
|---|---|---|
| 1 | — | "We repair LED, Smart, OLED & QLED TVs" + workshop photo |
| 3 | TV turns on then off: 5 causes and what to check safely | Link to the guide |
| 6 | — | Backlight repair explained (before/after photo) |
| 8 | Smart TV stuck on the logo: software or hardware? | Link |
| 11 | — | Monsoon tip: protecting your TV from surges |
| 13 | Lines on the TV screen: when they can be fixed | Link |
| 16 | — | Brands we repair (only supported ones) |
| 18 | Should you repair or replace a 5-year-old TV? (honest cost guide, no invented prices) | Link |
| 21 | — | Home visit vs workshop: which do you need? (only offered options) |
| 23 | Wi-Fi keeps disconnecting on Android TV | Link |
| 26 | — | Reminder: free troubleshooting checklist link |
| 28 | Choosing a surge protector or stabiliser for your TV | Link |
| 30 | Review the month: Search Console queries → plan next month's topics | Monthly summary post |

## 8. Content rules followed
Original content only; no keyword stuffing; no invented reviews or ratings; no claims of official brand authorisation (every brand page carries a disclaimer); city and service areas only from verified admin settings.
