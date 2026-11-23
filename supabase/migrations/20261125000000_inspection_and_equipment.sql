-- =====================================================================
-- Migration 3: inspection charges + supported equipment (Admin -> Business)
-- Safe to run more than once. NULL = not set (website stays neutral).
-- =====================================================================
alter table public.business_settings
  add column if not exists inspection_charges text
    check (inspection_charges is null or char_length(inspection_charges) <= 300),
  add column if not exists supported_equipment text[];   -- NULL = all equipment listed on the website

comment on column public.business_settings.inspection_charges is
  'Inspection / visit charge policy shown to customers, e.g. "Rs 300 home visit, adjusted against the repair". NULL = explained by phone.';
comment on column public.business_settings.supported_equipment is
  'Equipment types repaired. Unlisted types are removed from the website, sitemap and booking form. NULL = all.';
