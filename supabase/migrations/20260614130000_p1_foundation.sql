create extension if not exists pgcrypto with schema extensions;
create extension if not exists citext with schema extensions;

do $$
begin
  create type public.module_tier as enum ('tier_1', 'tier_2', 'tier_3');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.user_status as enum ('active', 'invited', 'suspended');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.course_status as enum ('planned', 'active', 'completed', 'archived');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.opening_status as enum ('active', 'screening', 'interviewing', 'closed');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.account_status as enum ('active', 'qualified', 'proposal', 'won', 'archived');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.project_status as enum ('planned', 'active', 'paused', 'completed');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.allocation_status as enum ('proposed', 'active', 'paused', 'completed');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.timesheet_status as enum ('draft', 'submitted', 'approved', 'rejected');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.shift_status as enum ('planned', 'assigned', 'confirmed', 'completed');
exception
  when duplicate_object then null;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() -> 'app_metadata' ->> 'tenant_id', '')::uuid;
$$;

create or replace function public.current_role_codes()
returns text[]
language sql
stable
as $$
  select coalesce(
    array(
      select jsonb_array_elements_text(
        coalesce(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb)
      )
    ),
    array[]::text[]
  );
$$;

create or replace function public.has_app_role(role_code text)
returns boolean
language sql
stable
as $$
  select role_code = any(public.current_role_codes())
    or 'platform_admin' = any(public.current_role_codes());
$$;

create or replace function public.has_any_app_role(role_codes text[])
returns boolean
language sql
stable
as $$
  select public.has_app_role('platform_admin')
    or exists (
      select 1
      from unnest(role_codes) as required_role(role_code)
      where required_role.role_code = any(public.current_role_codes())
    );
$$;

create or replace function public.can_read_tenant(target_tenant_id uuid)
returns boolean
language sql
stable
as $$
  select target_tenant_id = public.current_tenant_id()
    or public.has_app_role('platform_admin');
$$;

create or replace function public.can_manage_tenant(target_tenant_id uuid, role_codes text[])
returns boolean
language sql
stable
as $$
  select (
    target_tenant_id = public.current_tenant_id()
    and public.has_any_app_role(role_codes)
  ) or public.has_app_role('platform_admin');
$$;

create table public.tenants (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique,
  legal_name text not null,
  vat_number text not null unique,
  payoff text not null,
  claim text not null,
  phone text not null,
  email extensions.citext not null,
  authorization text not null,
  certifications text[] not null default array[]::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.offices (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  city text not null,
  address text not null,
  purpose text not null,
  timezone text not null default 'Europe/Rome',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, city)
);

create table public.roles (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  description text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table public.app_users (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email extensions.citext not null,
  display_name text not null,
  job_title text not null,
  status public.user_status not null default 'invited',
  primary_office_id uuid references public.offices(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, email)
);

create table public.user_roles (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references public.app_users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.modules (
  id uuid primary key default extensions.gen_random_uuid(),
  module_key text not null unique,
  label text not null,
  tier public.module_tier not null,
  route_path text not null,
  icon_key text not null,
  is_enabled boolean not null default true,
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table public.role_module_permissions (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  can_read boolean not null default true,
  can_write boolean not null default false,
  can_approve boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (role_id, module_id)
);

create table public.academy_courses (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  course_code text not null,
  title text not null,
  domain text not null,
  delivery_mode text not null,
  duration_hours integer not null check (duration_hours > 0),
  status public.course_status not null default 'planned',
  certification_label text,
  placement_kpi text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, course_code)
);

create table public.academy_editions (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  course_id uuid not null references public.academy_courses(id) on delete cascade,
  office_id uuid not null references public.offices(id) on delete restrict,
  edition_code text not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  capacity integer not null check (capacity > 0),
  enrolled_count integer not null default 0 check (enrolled_count >= 0),
  status public.course_status not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, edition_code),
  check (end_date >= start_date),
  check (enrolled_count <= capacity)
);

create table public.job_openings (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  opening_code text not null,
  title text not null,
  business_area text not null,
  location text not null,
  contract_type text not null,
  status public.opening_status not null default 'active',
  priority_score integer not null check (priority_score between 0 and 100),
  required_skills text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, opening_code)
);

create table public.candidates (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  profile_code text not null,
  display_name text not null,
  email extensions.citext,
  headline text not null,
  source text not null,
  status text not null,
  skills text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_code)
);

create table public.placements (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_opening_id uuid not null references public.job_openings(id) on delete restrict,
  outcome_label text not null,
  placed_at date,
  coaching_notes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  legal_name text not null,
  vat_number text,
  industry text not null,
  account_owner_id uuid references public.app_users(id) on delete set null,
  status public.account_status not null default 'qualified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, legal_name)
);

create table public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  account_id uuid not null references public.business_accounts(id) on delete restrict,
  project_code text not null,
  name text not null,
  service_line text not null,
  start_date date not null,
  end_date date,
  status public.project_status not null default 'planned',
  budget_cents integer not null default 0 check (budget_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, project_code),
  check (end_date is null or end_date >= start_date)
);

create table public.consultants (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.app_users(id) on delete set null,
  profile_code text not null,
  display_name text not null,
  seniority text not null,
  primary_skill text not null,
  availability_status text not null,
  daily_rate_cents integer not null check (daily_rate_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_code)
);

create table public.consultant_allocations (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  status public.allocation_status not null default 'proposed',
  start_date date not null,
  end_date date,
  allocation_percentage integer not null check (allocation_percentage between 1 and 100),
  billable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create table public.timesheets (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  consultant_id uuid not null references public.consultants(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  work_date date not null,
  hours numeric(4, 2) not null check (hours > 0 and hours <= 24),
  activity text not null,
  status public.timesheet_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (consultant_id, project_id, work_date)
);

create table public.resource_shifts (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  office_id uuid not null references public.offices(id) on delete restrict,
  assigned_user_id uuid references public.app_users(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.shift_status not null default 'planned',
  activity text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.audit_events (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_user_id uuid references public.app_users(id) on delete set null,
  event_type text not null,
  entity_table text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index offices_tenant_id_idx on public.offices (tenant_id);
create index roles_tenant_code_idx on public.roles (tenant_id, code);
create index app_users_tenant_email_idx on public.app_users (tenant_id, email);
create index user_roles_tenant_role_idx on public.user_roles (tenant_id, role_id);
create index role_module_permissions_tenant_idx on public.role_module_permissions (tenant_id);
create index academy_courses_tenant_status_idx on public.academy_courses (tenant_id, status);
create index academy_editions_tenant_start_idx on public.academy_editions (tenant_id, start_date);
create index job_openings_tenant_status_idx on public.job_openings (tenant_id, status);
create index job_openings_required_skills_idx on public.job_openings using gin (required_skills);
create index candidates_tenant_status_idx on public.candidates (tenant_id, status);
create index candidates_skills_idx on public.candidates using gin (skills);
create index placements_tenant_placed_at_idx on public.placements (tenant_id, placed_at);
create index business_accounts_tenant_status_idx on public.business_accounts (tenant_id, status);
create index projects_tenant_status_idx on public.projects (tenant_id, status);
create index consultants_tenant_availability_idx on public.consultants (tenant_id, availability_status);
create index consultant_allocations_tenant_status_idx on public.consultant_allocations (tenant_id, status);
create index timesheets_tenant_work_date_idx on public.timesheets (tenant_id, work_date);
create index resource_shifts_tenant_starts_at_idx on public.resource_shifts (tenant_id, starts_at);
create index audit_events_tenant_created_at_idx on public.audit_events (tenant_id, created_at desc);

create trigger set_tenants_updated_at before update on public.tenants for each row execute function public.set_updated_at();
create trigger set_offices_updated_at before update on public.offices for each row execute function public.set_updated_at();
create trigger set_app_users_updated_at before update on public.app_users for each row execute function public.set_updated_at();
create trigger set_academy_courses_updated_at before update on public.academy_courses for each row execute function public.set_updated_at();
create trigger set_academy_editions_updated_at before update on public.academy_editions for each row execute function public.set_updated_at();
create trigger set_job_openings_updated_at before update on public.job_openings for each row execute function public.set_updated_at();
create trigger set_candidates_updated_at before update on public.candidates for each row execute function public.set_updated_at();
create trigger set_placements_updated_at before update on public.placements for each row execute function public.set_updated_at();
create trigger set_business_accounts_updated_at before update on public.business_accounts for each row execute function public.set_updated_at();
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger set_consultants_updated_at before update on public.consultants for each row execute function public.set_updated_at();
create trigger set_consultant_allocations_updated_at before update on public.consultant_allocations for each row execute function public.set_updated_at();
create trigger set_timesheets_updated_at before update on public.timesheets for each row execute function public.set_updated_at();
create trigger set_resource_shifts_updated_at before update on public.resource_shifts for each row execute function public.set_updated_at();

alter table public.tenants enable row level security;
alter table public.modules enable row level security;

create policy tenants_select on public.tenants for select to authenticated using (public.can_read_tenant(id));
create policy tenants_manage on public.tenants for all to authenticated using (public.can_manage_tenant(id, array['tenant_admin', 'compliance_manager'])) with check (public.can_manage_tenant(id, array['tenant_admin', 'compliance_manager']));
create policy modules_select on public.modules for select to authenticated using (is_enabled or public.has_app_role('platform_admin'));
create policy modules_manage on public.modules for all to authenticated using (public.has_app_role('platform_admin')) with check (public.has_app_role('platform_admin'));

do $$
declare
  tenant_table text;
begin
  foreach tenant_table in array array[
    'offices',
    'roles',
    'app_users',
    'user_roles',
    'role_module_permissions',
    'academy_courses',
    'academy_editions',
    'job_openings',
    'candidates',
    'placements',
    'business_accounts',
    'projects',
    'consultants',
    'consultant_allocations',
    'timesheets',
    'resource_shifts',
    'audit_events'
  ]
  loop
    execute format('alter table public.%I enable row level security', tenant_table);
    execute format('create policy %I on public.%I for select to authenticated using (public.can_read_tenant(tenant_id))', tenant_table || '_select', tenant_table);
  end loop;
end
$$;

do $$
declare
  core_table text;
begin
  foreach core_table in array array['offices', 'roles', 'app_users', 'user_roles', 'role_module_permissions', 'audit_events']
  loop
    execute format('create policy %I on public.%I for all to authenticated using (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''compliance_manager''])) with check (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''compliance_manager'']))', core_table || '_manage', core_table);
  end loop;
end
$$;

do $$
declare
  academy_table text;
begin
  foreach academy_table in array array['academy_courses', 'academy_editions']
  loop
    execute format('create policy %I on public.%I for all to authenticated using (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''academy_manager''])) with check (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''academy_manager'']))', academy_table || '_manage', academy_table);
  end loop;
end
$$;

do $$
declare
  talent_table text;
begin
  foreach talent_table in array array['job_openings', 'candidates', 'placements']
  loop
    execute format('create policy %I on public.%I for all to authenticated using (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''recruiter'', ''placement_manager''])) with check (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''recruiter'', ''placement_manager'']))', talent_table || '_manage', talent_table);
  end loop;
end
$$;

do $$
declare
  management_table text;
begin
  foreach management_table in array array['business_accounts', 'projects', 'consultants', 'consultant_allocations', 'timesheets']
  loop
    execute format('create policy %I on public.%I for all to authenticated using (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''staffing_manager'', ''sales_manager''])) with check (public.can_manage_tenant(tenant_id, array[''tenant_admin'', ''staffing_manager'', ''sales_manager'']))', management_table || '_manage', management_table);
  end loop;
end
$$;

create policy resource_shifts_manage on public.resource_shifts for all to authenticated using (public.can_manage_tenant(tenant_id, array['tenant_admin', 'academy_manager', 'staffing_manager'])) with check (public.can_manage_tenant(tenant_id, array['tenant_admin', 'academy_manager', 'staffing_manager']));
