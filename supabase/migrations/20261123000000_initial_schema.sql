-- =====================================================================
-- Veenus Electronics - initial schema
-- Run in Supabase SQL editor or with `supabase db push`.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- admin_users: staff allowed into /admin. Linked 1:1 to auth.users.
-- There is NO public registration. Create users in Supabase Auth, then
-- insert a row here (see docs/ADMIN_GUIDE.md).
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- repair_enquiries
-- ---------------------------------------------------------------------
create sequence if not exists public.enquiry_number_seq start 1001;

create table if not exists public.repair_enquiries (
  id                   uuid primary key default gen_random_uuid(),
  enquiry_number       text not null unique,
  customer_name        text not null check (char_length(customer_name) between 2 and 80),
  mobile_number        text not null check (mobile_number ~ '^\+91[6-9][0-9]{9}$'),
  email                text check (email is null or char_length(email) <= 120),
  location             text not null check (char_length(location) between 2 and 160),
  service_type         text check (service_type in ('Home Visit', 'Workshop Repair', 'Pickup and Delivery')),
  equipment_type       text,
  brand                text,
  model_number         text check (model_number is null or char_length(model_number) <= 60),
  screen_size          text,
  problem              text,
  problem_description  text check (problem_description is null or char_length(problem_description) <= 1500),
  preferred_date       date,
  status               text not null default 'New' check (status in (
                         'New','Contacted','Inspection Scheduled','Diagnosing','Estimate Sent',
                         'Approved','Repairing','Completed','Delivered','Cancelled')),
  assigned_technician  text,
  diagnosis            text,
  estimated_cost       numeric(10,2) check (estimated_cost is null or estimated_cost >= 0),
  final_cost           numeric(10,2) check (final_cost is null or final_cost >= 0),
  parts_used           text,
  warranty_details     text,
  internal_notes       text,
  consent              boolean not null default false,
  source_page          text,
  ip_hash              text,
  completed_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists repair_enquiries_created_idx on public.repair_enquiries (created_at desc);
create index if not exists repair_enquiries_status_idx on public.repair_enquiries (status);
create index if not exists repair_enquiries_brand_idx on public.repair_enquiries (brand);
create index if not exists repair_enquiries_equipment_idx on public.repair_enquiries (equipment_type);
create index if not exists repair_enquiries_mobile_idx on public.repair_enquiries (mobile_number);
create index if not exists repair_enquiries_ip_idx on public.repair_enquiries (ip_hash, created_at desc);

-- Human-friendly enquiry number: VE-YYMMDD-#### (sequence based, unique)
create or replace function public.set_enquiry_number()
returns trigger language plpgsql as $$
begin
  if new.enquiry_number is null or new.enquiry_number = '' then
    new.enquiry_number := 'VE-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-' ||
                          lpad(nextval('public.enquiry_number_seq')::text, 4, '0');
  end if;
  return new;
end $$;

drop trigger if exists trg_set_enquiry_number on public.repair_enquiries;
create trigger trg_set_enquiry_number
  before insert on public.repair_enquiries
  for each row execute function public.set_enquiry_number();

-- updated_at + completed_at maintenance
create or replace function public.touch_enquiry()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status in ('Completed', 'Delivered') and old.status not in ('Completed', 'Delivered') then
    new.completed_at := coalesce(new.completed_at, now());
  end if;
  return new;
end $$;

drop trigger if exists trg_touch_enquiry on public.repair_enquiries;
create trigger trg_touch_enquiry
  before update on public.repair_enquiries
  for each row execute function public.touch_enquiry();

-- ---------------------------------------------------------------------
-- repair_photos (files live in the private "repair-photos" bucket)
-- ---------------------------------------------------------------------
create table if not exists public.repair_photos (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references public.repair_enquiries (id) on delete cascade,
  file_url    text not null, -- storage object path inside the bucket (not a public URL)
  created_at  timestamptz not null default now()
);
create index if not exists repair_photos_enquiry_idx on public.repair_photos (enquiry_id);

-- ---------------------------------------------------------------------
-- repair_status_history (written automatically by trigger)
-- ---------------------------------------------------------------------
create table if not exists public.repair_status_history (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references public.repair_enquiries (id) on delete cascade,
  old_status  text,
  new_status  text not null,
  changed_by  uuid references public.admin_users (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists repair_status_history_enquiry_idx on public.repair_status_history (enquiry_id, created_at desc);

create or replace function public.log_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.repair_status_history (enquiry_id, old_status, new_status, changed_by)
    values (new.id, null, new.status, null);
  elsif new.status is distinct from old.status then
    insert into public.repair_status_history (enquiry_id, old_status, new_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end $$;

drop trigger if exists trg_log_status on public.repair_enquiries;
create trigger trg_log_status
  after insert or update of status on public.repair_enquiries
  for each row execute function public.log_status_change();

-- ---------------------------------------------------------------------
-- service_categories & service_areas
-- ---------------------------------------------------------------------
create table if not exists public.service_categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text,
  active       boolean not null default true
);

create table if not exists public.service_areas (
  id          uuid primary key default gen_random_uuid(),
  area_name   text not null,
  city        text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (area_name, city)
);

-- ---------------------------------------------------------------------
-- Helper: is the current user an active admin/staff member?
-- ---------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and active);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where id = auth.uid() and active and role = 'admin');
$$;

-- ---------------------------------------------------------------------
-- Rate limit helper: number of enquiries from an IP hash in a window.
-- Called by the server with the service role only.
-- ---------------------------------------------------------------------
create or replace function public.enquiry_count_since(p_ip_hash text, p_since timestamptz)
returns integer language sql stable security definer set search_path = public as $$
  select count(*)::int from public.repair_enquiries where ip_hash = p_ip_hash and created_at >= p_since;
$$;
revoke all on function public.enquiry_count_since(text, timestamptz) from public, anon, authenticated;
grant execute on function public.enquiry_count_since(text, timestamptz) to service_role;

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public (anon) users get NO direct table access. Enquiries are submitted
-- through the server API, which validates input, rate-limits, and inserts
-- with the service role. Staff access is via authenticated sessions + RLS.
-- =====================================================================
alter table public.admin_users            enable row level security;
alter table public.repair_enquiries       enable row level security;
alter table public.repair_photos          enable row level security;
alter table public.repair_status_history  enable row level security;
alter table public.service_categories     enable row level security;
alter table public.service_areas          enable row level security;

-- admin_users: staff can read the staff list (for technician assignment); only admins can modify.
drop policy if exists "staff read admin_users" on public.admin_users;
create policy "staff read admin_users" on public.admin_users
  for select to authenticated using (public.is_staff());
drop policy if exists "admins manage admin_users" on public.admin_users;
create policy "admins manage admin_users" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- repair_enquiries: staff read/update; only admins delete. No anon access.
drop policy if exists "staff read enquiries" on public.repair_enquiries;
create policy "staff read enquiries" on public.repair_enquiries
  for select to authenticated using (public.is_staff());
drop policy if exists "staff update enquiries" on public.repair_enquiries;
create policy "staff update enquiries" on public.repair_enquiries
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "admins delete enquiries" on public.repair_enquiries;
create policy "admins delete enquiries" on public.repair_enquiries
  for delete to authenticated using (public.is_admin());

-- repair_photos / status history: staff read only.
drop policy if exists "staff read photos" on public.repair_photos;
create policy "staff read photos" on public.repair_photos
  for select to authenticated using (public.is_staff());
drop policy if exists "staff read history" on public.repair_status_history;
create policy "staff read history" on public.repair_status_history
  for select to authenticated using (public.is_staff());

-- service categories / areas: public can read active rows; admins manage.
drop policy if exists "public read active categories" on public.service_categories;
create policy "public read active categories" on public.service_categories
  for select to anon, authenticated using (active or public.is_staff());
drop policy if exists "admins manage categories" on public.service_categories;
create policy "admins manage categories" on public.service_categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read active areas" on public.service_areas;
create policy "public read active areas" on public.service_areas
  for select to anon, authenticated using (active or public.is_staff());
drop policy if exists "admins manage areas" on public.service_areas;
create policy "admins manage areas" on public.service_areas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- STORAGE: private bucket for customer photos
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('repair-photos', 'repair-photos', false, 5242880,
        array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do update set public = false;

drop policy if exists "staff read repair photos" on storage.objects;
create policy "staff read repair photos" on storage.objects
  for select to authenticated using (bucket_id = 'repair-photos' and public.is_staff());
-- No insert/update/delete policies for anon/authenticated: uploads happen server-side with the service role.

-- =====================================================================
-- SEED: service categories (structural data, safe to seed)
-- Service areas are NOT seeded - add only verified areas from /admin/settings.
-- =====================================================================
insert into public.service_categories (name, slug, description) values
  ('LED TV Repair', 'led-tv-repair', 'LED television repair'),
  ('LCD TV Repair', 'lcd-tv-repair', 'LCD television repair'),
  ('Smart TV Repair', 'smart-tv-repair', 'Smart television repair'),
  ('OLED TV Repair', 'oled-tv-repair', 'OLED television repair'),
  ('QLED TV Repair', 'qled-tv-repair', 'QLED television repair'),
  ('Android TV Repair', 'android-tv-repair', 'Android / Google TV repair'),
  ('4K TV Repair', '4k-tv-repair', '4K UHD television repair'),
  ('Home Theatre Repair', 'home-theatre-repair', 'Home theatre and soundbar repair'),
  ('Speaker Repair', 'speaker-repair', 'Speaker and subwoofer repair'),
  ('Amplifier Repair', 'amplifier-repair', 'Amplifier repair'),
  ('Projector Repair', 'projector-repair', 'Projector repair'),
  ('DVD Player Repair', 'dvd-player-repair', 'DVD and Blu-ray player repair'),
  ('Set Top Box Repair', 'set-top-box-repair', 'Set top box repair')
on conflict (slug) do nothing;
