-- =====================================================================
-- Migration 2: admin-editable business settings + security hardening
-- Safe to run more than once.
-- =====================================================================

-- ---------------------------------------------------------------------
-- business_settings: a single row (id = 1) edited from /admin/business.
-- NULL means "not set" - the website then falls back to the environment
-- variable, and hides the element if that is empty too. Nothing invented.
-- ---------------------------------------------------------------------
create table if not exists public.business_settings (
  id                         smallint primary key default 1 check (id = 1),
  business_name              text check (business_name is null or char_length(business_name) between 2 and 80),
  logo_url                   text check (logo_url is null or logo_url ~ '^https://'),
  phone                      text check (phone is null or phone ~ '^\+[1-9][0-9]{7,14}$'),
  phone_display              text check (phone_display is null or char_length(phone_display) <= 30),
  whatsapp                   text check (whatsapp is null or whatsapp ~ '^[1-9][0-9]{9,14}$'),
  email                      text check (email is null or char_length(email) <= 120),
  address_street             text check (address_street is null or char_length(address_street) <= 160),
  address_locality           text check (address_locality is null or char_length(address_locality) <= 80),
  city                       text check (city is null or char_length(city) <= 60),
  state                      text check (state is null or char_length(state) <= 60),
  postcode                   text check (postcode is null or postcode ~ '^[1-9][0-9]{5}$'),
  latitude                   numeric(9,6) check (latitude is null or latitude between -90 and 90),
  longitude                  numeric(9,6) check (longitude is null or longitude between -180 and 180),
  maps_url                   text check (maps_url is null or maps_url ~ '^https://'),
  reviews_url                text check (reviews_url is null or reviews_url ~ '^https://'),
  working_hours              text check (working_hours is null or char_length(working_hours) <= 120),
  years_experience           integer check (years_experience is null or years_experience between 0 and 99),
  supported_brands           text[],      -- NULL = all brands listed on the website
  home_visit_available       boolean,     -- NULL = not confirmed (option offered as in the original brief)
  workshop_repair_available  boolean,
  pickup_delivery_available  boolean,
  warranty_terms             text check (warranty_terms is null or char_length(warranty_terms) <= 300),
  confirmed_claims           jsonb not null default '{}'::jsonb,
  updated_at                 timestamptz not null default now(),
  updated_by                 uuid references public.admin_users (id) on delete set null
);

insert into public.business_settings (id) values (1) on conflict (id) do nothing;

create or replace function public.touch_business_settings()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  return new;
end $$;

drop trigger if exists trg_touch_business_settings on public.business_settings;
create trigger trg_touch_business_settings
  before update on public.business_settings
  for each row execute function public.touch_business_settings();

alter table public.business_settings enable row level security;

-- Business details are public information shown on the website.
drop policy if exists "public read business settings" on public.business_settings;
create policy "public read business settings" on public.business_settings
  for select to anon, authenticated using (true);

drop policy if exists "admins update business settings" on public.business_settings;
create policy "admins update business settings" on public.business_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
-- No insert/delete policies: the single row is created by this migration.

-- ---------------------------------------------------------------------
-- HARDENING: staff may only change repair-workflow columns.
-- RLS decides WHICH rows; column privileges decide WHICH columns.
-- Customer details, enquiry number, consent and IP hash become read-only
-- for logged-in users (the server's service role is unaffected).
-- ---------------------------------------------------------------------
revoke update on public.repair_enquiries from authenticated;
grant update (status, assigned_technician, diagnosis, estimated_cost, final_cost,
              parts_used, warranty_details, internal_notes)
  on public.repair_enquiries to authenticated;

-- Anonymous users never write enquiries directly (they go through the API).
revoke insert, update, delete on public.repair_enquiries from anon;
revoke insert, update, delete on public.repair_photos from anon;
revoke insert, update, delete on public.repair_status_history from anon, authenticated;

-- Re-assert: only the server may call the rate-limit counter (defends against later blanket grants).
revoke all on function public.enquiry_count_since(text, timestamptz) from public, anon, authenticated;
grant execute on function public.enquiry_count_since(text, timestamptz) to service_role;

-- ---------------------------------------------------------------------
-- Duplicate-submission lookup used by the enquiry API (service role only)
-- ---------------------------------------------------------------------
create index if not exists repair_enquiries_dedupe_idx
  on public.repair_enquiries (mobile_number, created_at desc);

-- ---------------------------------------------------------------------
-- STORAGE: public bucket for the business logo (admins upload)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 1048576, array['image/png','image/jpeg','image/webp','image/svg+xml'])
on conflict (id) do update set public = true, file_size_limit = 1048576;

drop policy if exists "admins upload site assets" on storage.objects;
create policy "admins upload site assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets' and public.is_admin());
drop policy if exists "admins update site assets" on storage.objects;
create policy "admins update site assets" on storage.objects
  for update to authenticated using (bucket_id = 'site-assets' and public.is_admin());
drop policy if exists "admins delete site assets" on storage.objects;
create policy "admins delete site assets" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets' and public.is_admin());
