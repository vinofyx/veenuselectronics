-- =====================================================================
-- Database security tests. Every check RAISEs on failure, so the run
-- stops with a non-zero exit code if anything is wrong.
-- Run with scripts/test-db.sh (plain PostgreSQL + supabase_mock.sql).
-- =====================================================================
\set ON_ERROR_STOP 1
\set QUIET 1
\pset tuples_only on
\pset format unaligned

-- Mirror Supabase's default table privileges (RLS is what restricts access).
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on storage.objects, storage.buckets to anon, authenticated, service_role;
-- Re-apply migration 2's column restrictions after the blanket grant above.
revoke update on public.repair_enquiries from authenticated;
grant update (status, assigned_technician, diagnosis, estimated_cost, final_cost, parts_used, warranty_details, internal_notes)
  on public.repair_enquiries to authenticated;
revoke insert, update, delete on public.repair_enquiries, public.repair_photos from anon;
revoke insert, update, delete on public.repair_status_history from anon, authenticated;

insert into auth.users values ('11111111-1111-1111-1111-111111111111'), ('22222222-2222-2222-2222-222222222222'), ('33333333-3333-3333-3333-333333333333');
insert into public.admin_users (id, name, email, role) values
  ('11111111-1111-1111-1111-111111111111', 'Test Admin', 'admin@test.invalid', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Test Staff', 'staff@test.invalid', 'staff');
insert into public.service_areas (area_name, city, active) values ('Area A', 'Test City', true), ('Area B', 'Test City', false);

create or replace function pg_temp.expect(ok boolean, name text) returns void language plpgsql as $$
begin
  if ok is not true then raise exception 'FAIL: %', name; end if;
  raise notice 'PASS: %', name;
end $$;

create or replace function pg_temp.expect_error(sql text, name text) returns void language plpgsql as $$
begin
  begin
    execute sql;
  exception when others then
    raise notice 'PASS: % (blocked: %)', name, sqlerrm;
    return;
  end;
  raise exception 'FAIL: % - statement was NOT blocked', name;
end $$;

-- ---------- 1. Server (service role) ----------
set role service_role;
insert into public.repair_enquiries (customer_name, mobile_number, location, consent, ip_hash, equipment_type, problem)
values ('Test Customer', '+919000000001', 'Area A', true, 'iphash1', 'LED TV', 'Black Screen');
select pg_temp.expect((select enquiry_number ~ '^VE-\d{6}-\d{4}$' from public.repair_enquiries limit 1), 'enquiry number format VE-YYMMDD-####');
select pg_temp.expect((select count(*) = 1 from public.repair_status_history), 'status history row created on insert');
select pg_temp.expect(public.enquiry_count_since('iphash1', now() - interval '1 hour') = 1, 'rate-limit counter callable by server');
select pg_temp.expect_error($$insert into public.repair_enquiries (customer_name, mobile_number, location) values ('Bad Mobile', '12345', 'Area A')$$, 'invalid mobile rejected by constraint');
select pg_temp.expect_error($$insert into public.repair_enquiries (customer_name, mobile_number, location, status) values ('Bad Status', '+919000000002', 'Area A', 'Hacked')$$, 'invalid status rejected by constraint');
reset role;

-- ---------- 2. Anonymous visitor ----------
set role anon;
select pg_temp.expect((select count(*) = 0 from public.repair_enquiries), 'anon cannot read enquiries');
select pg_temp.expect((select count(*) = 0 from public.repair_photos), 'anon cannot read photos');
select pg_temp.expect((select count(*) = 0 from public.admin_users), 'anon cannot read staff list');
select pg_temp.expect((select count(*) = 1 from public.service_areas), 'anon sees only active service areas');
select pg_temp.expect((select count(*) = 1 from public.business_settings), 'anon can read public business settings');
select pg_temp.expect_error($$insert into public.repair_enquiries (customer_name, mobile_number, location) values ('Spam', '+919000000003', 'X')$$, 'anon cannot insert enquiries directly');
update public.business_settings set phone = '+919000000009';
select pg_temp.expect_error($$select public.enquiry_count_since('iphash1', now())$$, 'anon cannot call rate-limit function');
select pg_temp.expect((select count(*) = 0 from storage.objects where bucket_id = 'repair-photos'), 'anon cannot list private photos');
reset role;
select pg_temp.expect((select phone is null from public.business_settings), 'anon update of business settings had no effect');

-- ---------- 3. Logged-in user who is NOT staff ----------
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
select pg_temp.expect((select count(*) = 0 from public.repair_enquiries), 'non-staff user cannot read enquiries');
update public.repair_enquiries set status = 'Cancelled';
reset role;
select pg_temp.expect((select status = 'New' from public.repair_enquiries limit 1), 'non-staff update had no effect');
set role authenticated;
set request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';
update public.business_settings set city = 'Hacked';
reset role;
select pg_temp.expect((select city is null from public.business_settings), 'non-staff cannot change business settings');

-- ---------- 4. Staff ----------
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select pg_temp.expect((select count(*) = 1 from public.repair_enquiries), 'staff can read enquiries');
update public.repair_enquiries set status = 'Contacted', assigned_technician = 'Tech 1', diagnosis = 'Backlight', estimated_cost = 2500;
select pg_temp.expect((select count(*) = 1 from public.repair_status_history where new_status = 'Contacted' and changed_by = '22222222-2222-2222-2222-222222222222'), 'status change logged with staff id');
select pg_temp.expect_error($$update public.repair_enquiries set customer_name = 'Changed'$$, 'staff cannot edit customer name (column privilege)');
select pg_temp.expect_error($$update public.repair_enquiries set mobile_number = '+919999999999'$$, 'staff cannot edit customer mobile');
select pg_temp.expect_error($$update public.repair_enquiries set enquiry_number = 'VE-X'$$, 'staff cannot edit enquiry number');
select pg_temp.expect_error($$insert into public.repair_status_history (enquiry_id, new_status) select id, 'Completed' from public.repair_enquiries$$, 'staff cannot forge status history');
delete from public.repair_enquiries;
select pg_temp.expect((select count(*) = 1 from public.repair_enquiries), 'staff cannot delete enquiries');
select pg_temp.expect_error($$insert into public.service_areas (area_name, city) values ('X', 'Y')$$, 'staff cannot add service areas');
update public.business_settings set phone = '+919111111111';
select pg_temp.expect((select phone is null from public.business_settings), 'staff cannot change business settings');
reset role;

-- ---------- 5. Admin ----------
set role authenticated;
set request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
update public.repair_enquiries set status = 'Completed', final_cost = 3000, parts_used = 'LED strips', warranty_details = 'Test';
select pg_temp.expect((select completed_at is not null from public.repair_enquiries), 'completed_at stamped when completed');
update public.business_settings set phone = '+919222222222', city = 'Test City', supported_brands = array['Samsung','LG'];
select pg_temp.expect((select phone = '+919222222222' and updated_by = '11111111-1111-1111-1111-111111111111' from public.business_settings), 'admin can update business settings (updated_by recorded)');
select pg_temp.expect_error($$update public.business_settings set phone = 'not-a-phone'$$, 'invalid phone rejected by constraint');
select pg_temp.expect_error($$update public.business_settings set maps_url = 'javascript:alert(1)'$$, 'non-https link rejected');
select pg_temp.expect_error($$insert into public.business_settings (id) values (2)$$, 'only one settings row allowed');
update public.business_settings set inspection_charges = 'Rs 300 home visit', supported_equipment = array['LED TV','Smart TV'];
select pg_temp.expect((select inspection_charges = 'Rs 300 home visit' and supported_equipment = array['LED TV','Smart TV'] from public.business_settings), 'admin can set inspection charges and supported equipment (migration 3)');
select pg_temp.expect_error($$update public.business_settings set inspection_charges = repeat('x', 301)$$, 'inspection charges length limited');
insert into public.service_areas (area_name, city) values ('Area C', 'Test City');
select pg_temp.expect((select count(*) = 3 from public.service_areas), 'admin manages service areas (sees hidden ones)');
insert into storage.objects (bucket_id, name) values ('site-assets', 'logo.png');
select pg_temp.expect_error($$insert into storage.objects (bucket_id, name) values ('repair-photos', 'x/evil.jpg')$$, 'admin cannot write private photo bucket directly');
delete from public.repair_enquiries;
select pg_temp.expect((select count(*) = 0 from public.repair_enquiries), 'admin can delete enquiries');
reset role;

-- ---------- 6. Staff cannot upload site assets ----------
set role authenticated;
set request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
select pg_temp.expect_error($$insert into storage.objects (bucket_id, name) values ('site-assets', 'staff.png')$$, 'staff cannot upload site assets');
reset role;

\echo ALL DATABASE TESTS PASSED
