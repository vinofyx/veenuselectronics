-- Paste into Supabase -> SQL Editor after applying both migrations. Every row should say OK.
select 'RLS enabled: ' || c.relname as check, case when c.relrowsecurity then 'OK' else 'FAIL' end as result
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
  and c.relname in ('repair_enquiries','repair_photos','repair_status_history','admin_users','service_categories','service_areas','business_settings')
union all
select 'bucket repair-photos is private', case when not public then 'OK' else 'FAIL' end from storage.buckets where id = 'repair-photos'
union all
select 'bucket site-assets exists (public, logo only)', case when public then 'OK' else 'FAIL' end from storage.buckets where id = 'site-assets'
union all
select 'business_settings has one row', case when count(*) = 1 then 'OK' else 'FAIL' end from public.business_settings
union all
select 'staff cannot update customer_name (column privilege)',
       case when has_column_privilege('authenticated', 'public.repair_enquiries', 'customer_name', 'UPDATE') then 'FAIL' else 'OK' end
union all
select 'staff can update status (column privilege)',
       case when has_column_privilege('authenticated', 'public.repair_enquiries', 'status', 'UPDATE') then 'OK' else 'FAIL' end
union all
select 'anon cannot call rate-limit function',
       case when has_function_privilege('anon', 'public.enquiry_count_since(text, timestamptz)', 'EXECUTE') then 'FAIL' else 'OK' end
union all
select 'server can call rate-limit function',
       case when has_function_privilege('service_role', 'public.enquiry_count_since(text, timestamptz)', 'EXECUTE') then 'OK' else 'FAIL' end
union all
select 'migration 3 applied (inspection_charges, supported_equipment)',
       case when count(*) = 2 then 'OK' else 'FAIL - run 20261125000000_inspection_and_equipment.sql' end
from information_schema.columns
where table_schema = 'public' and table_name = 'business_settings' and column_name in ('inspection_charges','supported_equipment')
union all
select 'at least one active admin', case when count(*) >= 1 then 'OK' else 'FAIL - create your admin (ADMIN_GUIDE.md)' end
from public.admin_users where role = 'admin' and active;
