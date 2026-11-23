# Admin guide

The admin panel is at **`/admin`** (for example `https://www.veenuselectronics.in/admin`).

## Roles
| Role | Can do |
|---|---|
| `admin` | Everything: dashboard, enquiries, reports and revenue, CSV export, **business details**, settings (service areas, staff list) |
| `staff` | Dashboard, view enquiries and customer photos, update status, technician, diagnosis, costs, parts, warranty and notes |

## Creating staff accounts
There is no public sign-up. To add a person:

1. **Supabase → Authentication → Users → Add user → Create new user.** Enter their email and a strong password, and tick "Auto confirm user".
2. Copy the new user's **UID**.
3. **Supabase → SQL Editor**, run:
   ```sql
   insert into public.admin_users (id, name, email, role)
   values ('PASTE-UID-HERE', 'Full Name', 'person@example.com', 'admin');  -- or 'staff'
   ```
4. They can now sign in at `/admin/login`.

**To remove access:** `update public.admin_users set active = false where email = '…';` Optionally, also delete the user in Authentication → Users.

**Password reset:** in Authentication → Users, open the user's menu and choose "Send password recovery", or set a new password there.

## Daily workflow
1. **Dashboard:** check **New Enquiries**. Click any widget to see the matching enquiries.
2. Open an enquiry. Use **Call** or **WhatsApp** to contact the customer. The WhatsApp message is pre-filled with the enquiry ID.
3. Move the status along as the job progresses:
   `New → Contacted → Inspection Scheduled → Diagnosing → Estimate Sent → Approved → Repairing → Completed → Delivered` (or `Cancelled`).
   Every change is recorded in **Status history** with the staff member's name and the time.
4. Fill in **Assigned technician**, **Diagnosis**, **Estimate**, then **Final cost**, **Parts used** and **Warranty information** as the work happens.
5. **Internal notes** are visible to staff only and never shown to customers.

> Remember: a customer enquiry is **not** a confirmed appointment. Always contact the customer to confirm availability.

## Searching and filtering
- **Search** matches customer name, phone number (any 3 or more digits) or enquiry ID.
- **Filters:** status, repair category (equipment), brand, and a date range (in IST).
- **Export CSV** (admin only) exports whatever the current filters show. The file opens in Excel or Google Sheets.

## Reports (admin)
Choose a month to see daily and weekly enquiries, a 12-month trend, the category breakdown, brand-wise counts, repairs completed and revenue. Revenue is the sum of **Final cost** for repairs marked Completed or Delivered that month, so it is only accurate if final costs are recorded.

## Business details (admin)
**Admin → Business.** Everything the public website shows about the business, edited without touching code:
- Business name and logo (PNG, JPG or WEBP, max 1 MB)
- Phone (used by all Call buttons), display format, WhatsApp number (all WhatsApp buttons), email, working hours
- Shop address, city, PIN code, Google Maps link and map coordinates, Google reviews link
- Service options: home visit, workshop repair, pickup and delivery. Unticked options are removed from the booking form and the website text.
- TV brands you repair. Unticked brands disappear from the site, the sitemap and the form, and their brand page returns "not found".
- Years of experience and warranty terms. Leave them empty unless verified; they appear on the site only when filled in.
- **Website claims:** tick only statements that are true (for example "quality-tested parts").

Leave anything unconfirmed empty; the website hides it. Changes appear on the website within about a minute. Each save records who saved it and when.

> Setting the **city** also adds it to page titles for local search (for example "LED TV Repair … in Hyderabad"). Set it only to the city you actually serve.

## Service areas (admin)
**Settings → Service areas.** Add only localities you really serve. Hidden areas are kept but do not appear on the website. Changes show on the public site within an hour.

## Customer photos
Photos are stored privately. Links in the admin panel expire after 1 hour, so refresh the page to see them again. Never share these links publicly.
