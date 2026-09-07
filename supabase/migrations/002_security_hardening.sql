-- ============================================================
-- VIBRANT SECURITY HARDENING
-- Application permissions + PostgreSQL RLS
-- ============================================================

-- ============================================================
-- 1. PRIVATE SECURITY SCHEMA
-- ============================================================

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;


-- ============================================================
-- 2. PERMISSION CHECK FUNCTION
-- ============================================================

create or replace function private.has_permission(
  permission_code text
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.admin_users au
    join public.role_permissions rp
      on rp.role_id = au.role_id
    join public.permissions p
      on p.id = rp.permission_id
    where au.id = auth.uid()
      and au.status = 'ACTIVE'
      and au.deleted_at is null
      and p.code = permission_code
  );
$$;

alter function private.has_permission(text) owner to postgres;

revoke all on function private.has_permission(text) from public;
grant execute on function private.has_permission(text) to authenticated;


-- ============================================================
-- 3. ENABLE RLS
-- ============================================================

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.sponsors enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.faqs enable row level security;
alter table public.schedule_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;


-- ============================================================
-- 4. REMOVE DIRECT CRUD PRIVILEGES
-- ============================================================

revoke all on public.roles from anon, authenticated;
revoke all on public.permissions from anon, authenticated;
revoke all on public.role_permissions from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
revoke all on public.events from anon, authenticated;
revoke all on public.sponsors from anon, authenticated;
revoke all on public.gallery_photos from anon, authenticated;
revoke all on public.faqs from anon, authenticated;
revoke all on public.schedule_items from anon, authenticated;
revoke all on public.site_settings from anon, authenticated;
revoke all on public.audit_logs from anon, authenticated;


-- ============================================================
-- 5. PUBLIC READ ACCESS
-- ============================================================

grant select on
  public.events,
  public.sponsors,
  public.gallery_photos,
  public.faqs,
  public.schedule_items,
  public.site_settings
to anon, authenticated;


-- ============================================================
-- 6. AUTHENTICATED PRIVILEGES
-- ============================================================

grant select, insert, update, delete
on public.events
to authenticated;

grant select, insert, update, delete
on public.sponsors
to authenticated;

grant select, insert, update, delete
on public.gallery_photos
to authenticated;

grant select, insert, update, delete
on public.faqs
to authenticated;

grant select, insert, update, delete
on public.schedule_items
to authenticated;

grant select, update
on public.site_settings
to authenticated;

grant select, insert, update, delete
on public.roles
to authenticated;

grant select, insert, update, delete
on public.role_permissions
to authenticated;

grant select
on public.permissions
to authenticated;

grant select, insert, update, delete
on public.admin_users
to authenticated;

grant select
on public.audit_logs
to authenticated;


-- ============================================================
-- 7. EVENTS
-- ============================================================

drop policy if exists "admin events select"
on public.events;

drop policy if exists "admin events insert"
on public.events;

drop policy if exists "admin events update"
on public.events;

drop policy if exists "admin events delete"
on public.events;

create policy "admin events select"
on public.events
for select
to authenticated
using (
  private.has_permission('events.view')
  and deleted_at is null
);

create policy "admin events insert"
on public.events
for insert
to authenticated
with check (
  private.has_permission('events.create')
);

create policy "admin events update"
on public.events
for update
to authenticated
using (
  private.has_permission('events.edit')
  and deleted_at is null
)
with check (
  private.has_permission('events.edit')
);

create policy "admin events delete"
on public.events
for delete
to authenticated
using (
  private.has_permission('events.delete')
  and deleted_at is null
);


-- ============================================================
-- 8. SPONSORS
-- ============================================================

drop policy if exists "admin sponsors select"
on public.sponsors;

drop policy if exists "admin sponsors insert"
on public.sponsors;

drop policy if exists "admin sponsors update"
on public.sponsors;

drop policy if exists "admin sponsors delete"
on public.sponsors;

create policy "admin sponsors select"
on public.sponsors
for select
to authenticated
using (
  private.has_permission('sponsors.view')
  and deleted_at is null
);

create policy "admin sponsors insert"
on public.sponsors
for insert
to authenticated
with check (
  private.has_permission('sponsors.create')
);

create policy "admin sponsors update"
on public.sponsors
for update
to authenticated
using (
  private.has_permission('sponsors.edit')
  and deleted_at is null
)
with check (
  private.has_permission('sponsors.edit')
);

create policy "admin sponsors delete"
on public.sponsors
for delete
to authenticated
using (
  private.has_permission('sponsors.delete')
  and deleted_at is null
);


-- ============================================================
-- 9. GALLERY
-- ============================================================

drop policy if exists "admin gallery select"
on public.gallery_photos;

drop policy if exists "admin gallery insert"
on public.gallery_photos;

drop policy if exists "admin gallery update"
on public.gallery_photos;

drop policy if exists "admin gallery delete"
on public.gallery_photos;

create policy "admin gallery select"
on public.gallery_photos
for select
to authenticated
using (
  private.has_permission('gallery.view')
  and deleted_at is null
);

create policy "admin gallery insert"
on public.gallery_photos
for insert
to authenticated
with check (
  private.has_permission('gallery.create')
);

create policy "admin gallery update"
on public.gallery_photos
for update
to authenticated
using (
  private.has_permission('gallery.edit')
  and deleted_at is null
)
with check (
  private.has_permission('gallery.edit')
);

create policy "admin gallery delete"
on public.gallery_photos
for delete
to authenticated
using (
  private.has_permission('gallery.delete')
  and deleted_at is null
);


-- ============================================================
-- 10. FAQS
-- ============================================================

drop policy if exists "admin faqs select"
on public.faqs;

drop policy if exists "admin faqs insert"
on public.faqs;

drop policy if exists "admin faqs update"
on public.faqs;

drop policy if exists "admin faqs delete"
on public.faqs;

create policy "admin faqs select"
on public.faqs
for select
to authenticated
using (
  private.has_permission('faqs.view')
  and deleted_at is null
);

create policy "admin faqs insert"
on public.faqs
for insert
to authenticated
with check (
  private.has_permission('faqs.create')
);

create policy "admin faqs update"
on public.faqs
for update
to authenticated
using (
  private.has_permission('faqs.edit')
  and deleted_at is null
)
with check (
  private.has_permission('faqs.edit')
);

create policy "admin faqs delete"
on public.faqs
for delete
to authenticated
using (
  private.has_permission('faqs.delete')
  and deleted_at is null
);


-- ============================================================
-- 11. SCHEDULE
-- ============================================================

drop policy if exists "admin schedule select"
on public.schedule_items;

drop policy if exists "admin schedule insert"
on public.schedule_items;

drop policy if exists "admin schedule update"
on public.schedule_items;

drop policy if exists "admin schedule delete"
on public.schedule_items;

create policy "admin schedule select"
on public.schedule_items
for select
to authenticated
using (
  private.has_permission('schedule.view')
);

create policy "admin schedule insert"
on public.schedule_items
for insert
to authenticated
with check (
  private.has_permission('schedule.create')
);

create policy "admin schedule update"
on public.schedule_items
for update
to authenticated
using (
  private.has_permission('schedule.edit')
)
with check (
  private.has_permission('schedule.edit')
);

create policy "admin schedule delete"
on public.schedule_items
for delete
to authenticated
using (
  private.has_permission('schedule.delete')
);


-- ============================================================
-- 12. SITE SETTINGS
-- ============================================================

drop policy if exists "admin settings select"
on public.site_settings;

drop policy if exists "admin settings update"
on public.site_settings;

create policy "admin settings select"
on public.site_settings
for select
to authenticated
using (
  private.has_permission('settings.view')
);

create policy "admin settings update"
on public.site_settings
for update
to authenticated
using (
  private.has_permission('settings.manage')
)
with check (
  private.has_permission('settings.manage')
);


-- ============================================================
-- 13. ROLES
-- ============================================================

drop policy if exists "admin roles select"
on public.roles;

drop policy if exists "admin roles insert"
on public.roles;

drop policy if exists "admin roles update"
on public.roles;

drop policy if exists "admin roles delete"
on public.roles;

create policy "admin roles select"
on public.roles
for select
to authenticated
using (
  private.has_permission('roles.view')
  or id in (
    select role_id
    from public.admin_users
    where id = auth.uid()
      and deleted_at is null
  )
);

create policy "admin roles insert"
on public.roles
for insert
to authenticated
with check (
  private.has_permission('roles.create')
);

create policy "admin roles update"
on public.roles
for update
to authenticated
using (
  private.has_permission('roles.edit')
)
with check (
  private.has_permission('roles.edit')
);

create policy "admin roles delete"
on public.roles
for delete
to authenticated
using (
  private.has_permission('roles.delete')
);


-- ============================================================
-- 14. ROLE PERMISSIONS
-- ============================================================

drop policy if exists "admin role_permissions select"
on public.role_permissions;

drop policy if exists "admin role_permissions insert"
on public.role_permissions;

drop policy if exists "admin role_permissions update"
on public.role_permissions;

drop policy if exists "admin role_permissions delete"
on public.role_permissions;

create policy "admin role_permissions select"
on public.role_permissions
for select
to authenticated
using (
  private.has_permission('roles.view')
  or role_id in (
    select role_id
    from public.admin_users
    where id = auth.uid()
      and deleted_at is null
  )
);

create policy "admin role_permissions insert"
on public.role_permissions
for insert
to authenticated
with check (
  private.has_permission('roles.create')
  or private.has_permission('roles.edit')
);

create policy "admin role_permissions update"
on public.role_permissions
for update
to authenticated
using (
  private.has_permission('roles.edit')
)
with check (
  private.has_permission('roles.edit')
);

create policy "admin role_permissions delete"
on public.role_permissions
for delete
to authenticated
using (
  private.has_permission('roles.edit')
);


-- ============================================================
-- 15. PERMISSIONS
-- ============================================================

drop policy if exists "admin permissions select"
on public.permissions;

create policy "admin permissions select"
on public.permissions
for select
to authenticated
using (
  private.has_permission('roles.view')
  or id in (
    select rp.permission_id
    from public.role_permissions rp
    join public.admin_users au
      on au.role_id = rp.role_id
    where au.id = auth.uid()
      and au.deleted_at is null
  )
);


-- ============================================================
-- 16. ADMIN USERS
-- ============================================================

drop policy if exists "admin users select"
on public.admin_users;

drop policy if exists "admin users insert"
on public.admin_users;

drop policy if exists "admin users update"
on public.admin_users;

drop policy if exists "admin users delete"
on public.admin_users;


-- Read:
-- Users can always read their own profile.
-- users.view allows reading other active admin profiles.

create policy "admin users select"
on public.admin_users
for select
to authenticated
using (
  id = auth.uid()
  or (
    private.has_permission('users.view')
    and deleted_at is null
  )
);


-- Create:
-- Only users with users.create may create admin records.

create policy "admin users insert"
on public.admin_users
for insert
to authenticated
with check (
  private.has_permission('users.create')
);


-- FIX:
-- Users with users.edit OR users.delete may update admin records.
--
-- users.delete is included because deleteUser() performs a soft-delete
-- using UPDATE:
--
--   status = 'DISABLED'
--   deleted_at = timestamp
--
-- The old policy only checked users.edit, which did not match the
-- Server Action's users.delete authorization.

create policy "admin users update"
on public.admin_users
for update
to authenticated
using (
  private.has_permission('users.edit')
  or private.has_permission('users.delete')
)
with check (
  private.has_permission('users.edit')
  or private.has_permission('users.delete')
);


-- Direct DELETE is still restricted to users.delete.

create policy "admin users delete"
on public.admin_users
for delete
to authenticated
using (
  private.has_permission('users.delete')
);


-- ============================================================
-- 17. AUDIT LOGS
-- ============================================================

drop policy if exists "admin audit select"
on public.audit_logs;

create policy "admin audit select"
on public.audit_logs
for select
to authenticated
using (
  private.has_permission('audit.view')
);

-- IMPORTANT:
-- No INSERT policy is granted to authenticated users.
-- Audit records should be written through the service-role
-- server-side auditAction() implementation.


-- ============================================================
-- END
-- ============================================================