create extension if not exists postgis;
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null check (role in ('super_admin','admin','farm_manager','field_inspector','ai_dev','viewer')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table if not exists farms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique,
  location text,
  district text,
  state text,
  country text,
  total_acres numeric not null default 0,
  boundary geometry(polygon, 4326),
  status text not null default 'active',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists fields (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  name text not null,
  code text not null,
  area_acres numeric not null default 0,
  boundary geometry(polygon, 4326),
  total_trees integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (farm_id, code)
);

create table if not exists farm_members (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  status text not null default 'active',
  unique (farm_id, user_id)
);

create table if not exists field_members (
  id uuid primary key default uuid_generate_v4(),
  field_id uuid not null references fields(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  status text not null default 'active',
  unique (field_id, user_id)
);

create table if not exists member_reallocation_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  old_farm_id uuid references farms(id),
  new_farm_id uuid references farms(id),
  old_field_id uuid references fields(id),
  new_field_id uuid references fields(id),
  reallocated_by uuid references profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists model_versions (
  id uuid primary key default uuid_generate_v4(),
  version text not null unique,
  description text,
  deployed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists drone_scans (
  id uuid primary key default uuid_generate_v4(),
  scan_code text not null unique,
  farm_id uuid not null references farms(id),
  field_id uuid references fields(id),
  drone_operator text,
  scan_date date not null,
  model_version_id uuid references model_versions(id),
  orthomosaic_url text,
  status text not null default 'uploaded',
  total_trees_processed integer not null default 0,
  healthy_count integer not null default 0,
  suspected_count integer not null default 0,
  affected_count integer not null default 0,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists trees (
  id uuid primary key default uuid_generate_v4(),
  tree_code text not null unique,
  farm_id uuid not null references farms(id) on delete cascade,
  field_id uuid not null references fields(id) on delete cascade,
  latitude numeric not null,
  longitude numeric not null,
  location geography(point, 4326) generated always as (st_setsrid(st_makepoint(longitude, latitude), 4326)::geography) stored,
  planting_year integer,
  current_health_status text not null default 'healthy' check (current_health_status in ('healthy','suspected','affected','removed','dead')),
  current_disease_stage text not null default 'none' check (current_disease_stage in ('none','early_stage','stage_1','stage_2','stage_3')),
  current_confidence numeric check (current_confidence between 0 and 1),
  current_model_version_id uuid references model_versions(id),
  latest_image_url text,
  latest_scan_id uuid references drone_scans(id),
  inspection_status text not null default 'pending',
  treatment_status text not null default 'none',
  risk_score numeric not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trees_location_idx on trees using gist(location);
create index if not exists trees_farm_field_idx on trees(farm_id, field_id);

create table if not exists model_predictions (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references drone_scans(id),
  tree_id uuid references trees(id),
  farm_id uuid references farms(id),
  field_id uuid references fields(id),
  model_version_id uuid references model_versions(id),
  prediction text not null,
  health_status text not null,
  disease_stage text not null,
  confidence numeric check (confidence between 0 and 1),
  drone_image_url text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now()
);

create table if not exists tree_images (
  id uuid primary key default uuid_generate_v4(),
  tree_id uuid references trees(id) on delete cascade,
  farm_id uuid references farms(id),
  field_id uuid references fields(id),
  scan_id uuid references drone_scans(id),
  image_url text not null,
  image_type text not null check (image_type in ('drone_image','orthomosaic','cropped_tree','ground_photo','thermal_image','multispectral_image')),
  latitude numeric,
  longitude numeric,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists inspections (
  id uuid primary key default uuid_generate_v4(),
  tree_id uuid not null references trees(id),
  farm_id uuid not null references farms(id),
  field_id uuid not null references fields(id),
  prediction_id uuid references model_predictions(id),
  assigned_to uuid references profiles(id),
  assigned_by uuid references profiles(id),
  status text not null default 'pending',
  priority text not null default 'medium',
  due_date date,
  inspection_result text,
  corrected_stage text,
  inspector_notes text,
  inspected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists inspection_images (
  id uuid primary key default uuid_generate_v4(),
  inspection_id uuid not null references inspections(id) on delete cascade,
  tree_id uuid references trees(id),
  image_url text not null,
  image_type text not null default 'ground_photo',
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz not null default now()
);

create table if not exists false_positive_reports (
  id uuid primary key default uuid_generate_v4(),
  tree_id uuid references trees(id),
  farm_id uuid references farms(id),
  field_id uuid references fields(id),
  prediction_id uuid references model_predictions(id),
  inspection_id uuid references inspections(id),
  model_version_id uuid references model_versions(id),
  ai_prediction text,
  ai_stage text,
  ai_confidence numeric,
  inspector_correction text,
  reason_tag text,
  inspector_notes text,
  dev_notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references profiles(id)
);

create table if not exists tree_history (
  id uuid primary key default uuid_generate_v4(),
  tree_id uuid not null references trees(id) on delete cascade,
  event_type text not null,
  event_title text not null,
  event_description text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists farm_history (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references farms(id) on delete cascade,
  event_type text not null,
  event_title text not null,
  event_description text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table farms enable row level security;
alter table fields enable row level security;
alter table trees enable row level security;
alter table farm_members enable row level security;
alter table field_members enable row level security;
alter table inspections enable row level security;
alter table false_positive_reports enable row level security;
alter table model_predictions enable row level security;
alter table drone_scans enable row level security;
alter table tree_images enable row level security;
alter table inspection_images enable row level security;
alter table tree_history enable row level security;
alter table farm_history enable row level security;
alter table audit_logs enable row level security;

create or replace function current_profile_role()
returns text language sql stable as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function is_super_admin()
returns boolean language sql stable as $$
  select current_profile_role() = 'super_admin'
$$;

create or replace function can_access_farm(target_farm_id uuid)
returns boolean language sql stable as $$
  select is_super_admin()
    or exists (select 1 from farm_members where farm_id = target_farm_id and user_id = auth.uid() and status = 'active')
    or current_profile_role() = 'ai_dev'
$$;

create policy "profiles_self_or_admin_read" on profiles for select using (id = auth.uid() or is_super_admin() or current_profile_role() = 'admin');
create policy "farms_scoped_read" on farms for select using (can_access_farm(id));
create policy "fields_scoped_read" on fields for select using (can_access_farm(farm_id));
create policy "trees_scoped_read" on trees for select using (can_access_farm(farm_id));
create policy "inspections_scoped_read" on inspections for select using (can_access_farm(farm_id) or assigned_to = auth.uid());
create policy "false_positive_ai_read" on false_positive_reports for select using (can_access_farm(farm_id) or current_profile_role() = 'ai_dev');

create policy "admin_manage_farms" on farms for all using (is_super_admin() or current_profile_role() = 'admin') with check (is_super_admin() or current_profile_role() = 'admin');
create policy "admin_manage_fields" on fields for all using (is_super_admin() or current_profile_role() = 'admin') with check (is_super_admin() or current_profile_role() = 'admin');
create policy "ai_or_admin_manage_scans" on drone_scans for all using (is_super_admin() or current_profile_role() in ('admin','ai_dev')) with check (is_super_admin() or current_profile_role() in ('admin','ai_dev'));
create policy "manager_manage_inspections" on inspections for all using (is_super_admin() or current_profile_role() in ('admin','farm_manager') or assigned_to = auth.uid()) with check (is_super_admin() or current_profile_role() in ('admin','farm_manager') or assigned_to = auth.uid());
create policy "audit_admin_read" on audit_logs for select using (is_super_admin() or current_profile_role() = 'admin');
