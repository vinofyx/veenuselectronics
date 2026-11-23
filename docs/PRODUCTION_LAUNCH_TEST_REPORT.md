# Production launch test report (Phase 13)

## Status: ❌ Not executed. There is no production deployment.

Run this checklist on the production site **after** your deployment approval, and record each result with the date.

| # | Test | How | Result |
|---|---|---|---|
| 1 | Submit a real test TV repair enquiry | `/book-repair`, name "TEST – please ignore", your own mobile | |
| 2 | Upload a test TV photo | Same form, 1 photo | |
| 3 | Enquiry number shown (`VE-YYMMDD-####`) | Success screen | |
| 4 | Database record exists | Admin → Enquiries → search "TEST" | |
| 5 | Admin notification email received | Inbox of `ENQUIRY_NOTIFY_EMAIL` | |
| 6 | WhatsApp contact works | "Share details on WhatsApp" on the success screen, and the floating button on a phone | |
| 7 | Admin status update + history | Change status; history shows your name | |
| 8 | Photo privacy | Copy the photo link from admin, open it in a private window after 1 hour → must fail; `verify:supabase` → photo not public | |
| 9 | Estimate and final cost fields saved | Enquiry detail | |
| 10 | CSV export | Admin → Export CSV opens in Excel | |
| 11 | Delete test data | **Only with your approval:** Supabase → Table Editor → delete the TEST enquiry (photos and history are deleted with it), and delete its photo from Storage | |
