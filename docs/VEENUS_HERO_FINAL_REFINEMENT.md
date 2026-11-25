# Veenus Electronics — Final Homepage Hero Refinement (addendum)

Date: 24 Nov 2026 · Verified on the running dev server in a real browser.

## Changes
- **Estimate First card removed completely** — heading, shield icon, text, card, shadow, border and positioning. No replacement card. Page text checked: no "Estimate first" anywhere on the homepage at any size.
- Duplicate estimate wording removed from the hero: description is now "…Our technicians diagnose faults, explain the repair and provide clear pricing before work begins."
- Benefits row: Professional TV diagnosis · Clear pricing before repair · Home visit, workshop or pickup (shown only while those options are enabled in Admin) · Multiple TV brands supported.
- Main photo: large 4:3 landscape, 24px corners, focal point adjusted, only a light scrim behind the caption.
- TV inset: smaller (26% width), neatly inside the upper-right corner, 3px white border, subtle shadow; hidden on phones.
- Diagnosis card: more compact, white text, small orange icon, inside the lower-left of the photo.
- Background grid opacity reduced to 2.2%.
- Vertical spacing tightened so the whole hero fits **real browser viewports** (e.g. 1366-wide laptops show ~643px after browser chrome).

## Measured (scripted in the browser)
| Viewport | Layout | Benefits row bottom / visible limit | Estimate text | Image | Overlaps | Horizontal scroll |
|---|---|---|---|---|---|---|
| 1359×643 (user's browser) | 2-col, columns centred (0px offset) | 602 / 643 ✅ | none | 4:3 | none | 0 |
| 1366×768 | 2-col | 610 / 768 ✅ | none | 4:3 | none | 0 |
| 1920×1080 & 1920×950 | 2-col | 671 / 950 ✅ | none | 4:3 | none | 0 |
| 1280×600 | 2-col | 594 / 600 ✅ | none | 4:3 | none | 0 |
| 1024×768, 768×1024 | stacked | ✅ | none | 4:3 | none | 0 |
| 390×844 | stacked | 741 / 779 (above action bar) ✅ | none | 4:3 | none | 0 |
| 375×812 | stacked | 741 / 747 (above action bar) ✅ | none | 4:3 | none | 0 |

Hero buttons: Book TV Repair → `/book-repair`; Call Now → `tel:+916300473113`; WhatsApp Us → `wa.me/916300473113` (new tab). Header, logo, contact bar, dropdowns, other sections, SEO and enquiry logic unchanged.
