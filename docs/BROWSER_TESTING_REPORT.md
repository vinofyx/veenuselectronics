# Browser and responsive testing report

## Status: ❌ Not executed

No browser test has been run against this website yet. To be explicit:
- **No screenshots exist and no viewport was rendered.** Running the pages needs the Next.js runtime, which could not be installed: the npm registry is blocked by your account's network policy, and the workspace on your PC won't start because of low disk space.
- A preview built from mocked components was considered and rejected. React's standard renderer cannot render the site's async server components without Next.js, and a mocked render would not show you the real site.

## 1. Automated browser suite (ready to run)
`npm run build && npm run test:e2e` runs the Playwright suite on **5 viewports**:

| Project | Device | Viewport |
|---|---|---|
| desktop | Desktop Chrome | 1920 × 1080 |
| laptop | Desktop Chrome | 1366 × 768 |
| tablet | iPad (gen 7) | 810 × 1080 |
| android | Pixel 7 | 412 × 915 |
| iphone | iPhone 14 (WebKit) | 390 × 844 |

What it checks automatically on each viewport is in TESTING_REPORT.md, section 2. Most relevant to layout:
- No horizontal overflow on 12 key pages (the most common mobile layout bug).
- Exactly one H1 per page; no JavaScript console errors.
- The mobile sticky Call / WhatsApp / Book bar is visible and fully on-screen on phones, and hidden on desktop and laptop.
- Sticky-bar tap targets are at least 44 px tall.
- The "Book TV Repair" call to action is above the fold on every viewport.
- The hamburger menu works on phones; the dropdown menu works on desktop.

After a run, open `playwright-report/index.html`. Failure screenshots and traces are saved automatically.

## 2. Design review from the code (not a substitute for a browser)
| Area | What the code does | Risk to check visually |
|---|---|---|
| Hero | Two columns from `lg` (1024 px), one column below; headline 36 → 48 → 54 px; CTAs stack vertically on phones | The illustration is placed after the text on phones, so it pushes "Common problems" down. Check that this is acceptable. |
| TV service cards | 1 / 2 / 3 columns; the first three are highlighted in orange | – |
| Brand grid | 2 / 3 / 5 columns, text tiles (no logos, deliberately, for trademark reasons) | Tiles may look plain. Brand logos need permission from the brands. |
| Problem cards | 1 / 2 / 4 columns | Long titles can wrap to 3 lines at 4 columns. |
| Sticky mobile bar | Hidden from `md` (768 px) up; respects the iPhone safe-area inset; the footer has bottom padding so the bar doesn't cover it | Tablet portrait (810 px) shows no sticky bar, only the header CTAs. Confirm this is wanted. |
| Enquiry form | Short by default (5 fields plus consent), "Add more details" expands; sticky beside the content on desktop | On landing pages the form comes after the content on phones; the hero "Request This Repair" button jumps to it. |
| Admin | Tables scroll horizontally inside cards on phones; the navigation shows icons only on small screens | The enquiry table is 960 px wide, so it scrolls sideways on phones (intended). |
| Colours | Primary #12345A, accent #F58220, background #F7F9FC, text #182433 | Measured contrast against white text: orange #F58220 is **2.59:1**, below the WCAG AA minimum of 4.5:1 for normal text; the buttons use 14–16 px semibold, which counts as normal text. The WhatsApp button's green #128C4A is 4.31:1 (just below). Deep blue #12345A is 12.62:1 (excellent). **Recommendation:** use `accent-700` (#B85A0B, 4.66:1, passes) for button backgrounds and keep bright orange for icons and highlights. This changes the look, so it is left for you to decide. |

## 3. Manual visual checklist (do this once on real devices)
- [ ] Home on a phone: the headline reads well, nothing overlaps, the sticky bar doesn't hide the final CTA.
- [ ] Header on a laptop (1366 px): all 7 menu items plus Call and Book fit on one line. The desktop menu appears from `xl` (1280 px); between 1024 and 1279 px the hamburger is used.
- [ ] Service, brand and problem cards line up evenly at every width.
- [ ] The enquiry form on an iPhone: the keyboard doesn't hide the Submit button; the date picker works; the photo picker offers the camera.
- [ ] The admin dashboard and enquiry detail are usable on a phone.
- [ ] The site looks like a TV repair specialist. Real workshop photos (`src/config/images.ts`) will make the biggest difference here.
