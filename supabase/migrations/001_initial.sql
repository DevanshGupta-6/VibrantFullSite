create extension if not exists pgcrypto;

do $$ begin
  create type public.admin_status as enum ('PENDING','ACTIVE','DISABLED');
exception when duplicate_object then null; end $$;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role_id uuid not null references public.roles(id) on delete restrict,
  status public.admin_status not null default 'PENDING',
  scope text default 'Global',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.events (
  id text primary key,
  number text not null,
  name text not null,
  slug text not null unique,
  category text not null,
  tagline text,
  description text,
  date text,
  time text,
  venue text,
  team_size text,
  eligibility text,
  rules text[] not null default '{}',
  prize text,
  fee text,
  coordinators text,
  contact text,
  image text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null,
  logo text,
  url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null,
  category text not null,
  caption text,
  aspect_ratio text not null default 'square',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text,
  category text not null default 'general',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.schedule_items (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  date_text text not null,
  time text not null,
  title text not null,
  description text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'site',
  event_name text not null default 'VIBRANT 2K26',
  tagline text not null default 'INNOVATE. IMPACT. IDEAS.',
  dates_label text not null default '16 & 17 October 2026',
  venue text not null default 'G.L. Bajaj Institute of Technology & Management',
  registration_url text,
  instagram_url text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id text,
  ip_address inet,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_users_role on public.admin_users(role_id);
create index if not exists idx_admin_users_status on public.admin_users(status);
create index if not exists idx_events_published on public.events(published);
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_date on public.events(date);
create index if not exists idx_events_sort_order on public.events(sort_order);
create index if not exists idx_sponsors_published on public.sponsors(published);
create index if not exists idx_sponsors_tier on public.sponsors(tier);
create index if not exists idx_gallery_published on public.gallery_photos(published);
create index if not exists idx_gallery_category on public.gallery_photos(category);
create index if not exists idx_gallery_created_at on public.gallery_photos(created_at);
create index if not exists idx_faqs_published on public.faqs(published);
create index if not exists idx_faqs_sort_order on public.faqs(sort_order);
create index if not exists idx_schedule_published on public.schedule_items(published);
create index if not exists idx_audit_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_action on public.audit_logs(action);
create index if not exists idx_audit_entity_type on public.audit_logs(entity_type);
create index if not exists idx_audit_created_at on public.audit_logs(created_at);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;

drop trigger if exists roles_updated_at on public.roles; create trigger roles_updated_at before update on public.roles for each row execute function public.set_updated_at();
drop trigger if exists admin_users_updated_at on public.admin_users; create trigger admin_users_updated_at before update on public.admin_users for each row execute function public.set_updated_at();
drop trigger if exists events_updated_at on public.events; create trigger events_updated_at before update on public.events for each row execute function public.set_updated_at();
drop trigger if exists sponsors_updated_at on public.sponsors; create trigger sponsors_updated_at before update on public.sponsors for each row execute function public.set_updated_at();
drop trigger if exists gallery_updated_at on public.gallery_photos; create trigger gallery_updated_at before update on public.gallery_photos for each row execute function public.set_updated_at();
drop trigger if exists faqs_updated_at on public.faqs; create trigger faqs_updated_at before update on public.faqs for each row execute function public.set_updated_at();
drop trigger if exists schedule_updated_at on public.schedule_items; create trigger schedule_updated_at before update on public.schedule_items for each row execute function public.set_updated_at();
drop trigger if exists settings_updated_at on public.site_settings; create trigger settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

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

create policy "public can read published events" on public.events for select to anon, authenticated using (published = true and deleted_at is null);
create policy "public can read published sponsors" on public.sponsors for select to anon, authenticated using (published = true and deleted_at is null);
create policy "public can read published gallery" on public.gallery_photos for select to anon, authenticated using (published = true and deleted_at is null);
create policy "public can read published faqs" on public.faqs for select to anon, authenticated using (published = true and deleted_at is null);
create policy "public can read published schedule" on public.schedule_items for select to anon, authenticated using (published = true);
create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);

create policy "admins can read own profile" on public.admin_users for select to authenticated using (id = auth.uid());
create policy "admins can read own role" on public.roles for select to authenticated using (id in (select role_id from public.admin_users where id=auth.uid() and deleted_at is null));
create policy "admins can read own permissions" on public.role_permissions for select to authenticated using (role_id in (select role_id from public.admin_users where id=auth.uid() and deleted_at is null));
create policy "admins can read assigned permission rows" on public.permissions for select to authenticated using (id in (select permission_id from public.role_permissions where role_id in (select role_id from public.admin_users where id=auth.uid() and deleted_at is null)));

grant usage on schema public to anon, authenticated;
grant select on public.events, public.sponsors, public.gallery_photos, public.faqs, public.schedule_items, public.site_settings to anon, authenticated;
grant select on public.admin_users, public.roles, public.permissions, public.role_permissions to authenticated;
grant all on all tables in schema public to service_role;
