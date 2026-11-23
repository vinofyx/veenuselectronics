# Post-launch growth plan

## 1. Measurement (already built into the site)
| What | How | Status |
|---|---|---|
| Phone clicks | GA4 event `click_call` (with button location) | ✅ in code, needs a GA4 ID |
| WhatsApp clicks | `click_whatsapp` | ✅ |
| Book Repair clicks | `click_book_repair` | ✅ |
| Form submissions | `enquiry_submit_attempt`, `enquiry_submit_success`, `enquiry_submit_error` | ✅ |
| Successful enquiries (ground truth) | Admin → Reports (from the database, not analytics) | ✅ |
| Traffic sources and organic search | GA4 → Acquisition; Search Console → Performance | Set up per SEO_LAUNCH_REPORT §3–4 |

**Key events in GA4:** `enquiry_submit_success`, `click_call`, `click_whatsapp`.

## 2. Google review collection (genuine reviews only)
1. Get the review link from your Google Business Profile ("Ask for reviews").
2. When a repair is marked **Delivered** in the admin, send the customer a WhatsApp message (from the enquiry page's WhatsApp button):
   > "Thank you for choosing {business name}. If you're happy with the repair, a short Google review helps other customers find us: {review link}"
3. Ask every customer; never offer discounts or gifts for reviews; never write reviews yourself.
4. Reply to every review within 48 hours, especially negative ones (calm, factual, offer to fix).
5. Add genuine reviews to the website only with permission (`src/content/reviews.ts`).

## 3. Local SEO monitoring (monthly, about 30 minutes)
- Search Console: top queries and pages, clicks, average position for the 10 priority keywords.
- GBP Insights: calls, direction requests, website clicks.
- Check new reviews and replies.
- Check that the name, address and phone are identical on the website, GBP and any directory listings.

## 4. Monthly enquiry report template
| Metric | Source | This month | Last month |
|---|---|---|---|
| Website visits | GA4 | | |
| Organic search clicks | Search Console | | |
| Call clicks / WhatsApp clicks | GA4 | | |
| Enquiries received | Admin → Reports | | |
| TV share of enquiries | Admin → Reports (category breakdown) | | |
| Top 3 brands / problems | Admin → Reports | | |
| Repairs completed | Admin → Reports | | |
| Revenue (recorded final costs) | Admin → Reports | | |
| Conversion: enquiries ÷ visits | calculated | | |
| New Google reviews | GBP | | |
| Actions for next month | – | | |

## 5. 30-day Google Ads test (optional, after organic basics are live)
**Goal:** learn the cost per real enquiry. Not a long-term commitment.
- **Pre-requisites:** phone and WhatsApp configured, GA4 key events imported into Google Ads, conversion tracking verified with one test.
- **Budget:** a small fixed daily budget you are comfortable losing in a test. Decide the amount yourself; there's no fixed figure here.
- **Location:** radius around the confirmed shop, limited to localities you actually serve.
- **Campaign:** one Search campaign, 3 ad groups:
  1. Generic: "tv repair", "led tv repair", "tv repair shop", "tv repair near me" → homepage
  2. Problems: "tv no picture", "tv backlight repair", "tv screen repair" → matching problem pages
  3. Brands (only supported brands): "samsung tv repair", "lg tv repair" → brand pages; **never** use "authorised" or "service centre" in ad text
- **Negative keywords:** "service centre", "authorised", "customer care", "toll free", "jobs", "course", "training", "new tv", "buy".
- **Ad schedule:** working hours only (calls outside hours are wasted).
- **Assets:** call asset (business hours only), location asset (linked GBP), sitelinks to Book Repair, Brands, Screen Repair.
- **Week 1:** check search terms daily and add negatives. **Week 2–3:** pause keywords with spend but no conversions. **Day 30:** compare cost per enquiry (from the admin, not just Ads) with your average repair margin, then continue, adjust or stop.
