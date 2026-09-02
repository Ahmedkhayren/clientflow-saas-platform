-- ClientFlow: workspace data model, row-level security, demo initialization, and activity logging.
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'ClientFlow member',
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  company text,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  name text not null,
  description text,
  status text not null default 'planning' check (status in ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  progress integer not null default 0 check (progress between 0 and 100),
  start_date date,
  due_date date,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id uuid references auth.users(id) on delete set null,
  due_date date,
  position integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index clients_workspace_idx on public.clients(workspace_id);
create index projects_workspace_client_idx on public.projects(workspace_id, client_id);
create index tasks_workspace_project_idx on public.tasks(workspace_id, project_id);
create index tasks_workspace_status_idx on public.tasks(workspace_id, status);
create index activity_logs_workspace_created_idx on public.activity_logs(workspace_id, created_at desc);
create index workspace_members_user_idx on public.workspace_members(user_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger clients_set_updated_at before update on public.clients for each row execute function public.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks for each row execute function public.set_updated_at();

-- Security-definer helpers avoid RLS policy recursion while keeping all checks anchored to auth.uid().
create or replace function public.is_workspace_member(p_workspace_id uuid) returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.workspace_members where workspace_id = p_workspace_id and user_id = auth.uid());
$$;
create or replace function public.can_manage_workspace(p_workspace_id uuid) returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.workspace_members where workspace_id = p_workspace_id and user_id = auth.uid() and role in ('owner', 'admin'));
$$;
create or replace function public.can_view_profile(p_user_id uuid) returns boolean language sql security definer set search_path = public stable as $$
  select p_user_id = auth.uid() or exists (
    select 1 from public.workspace_members target join public.workspace_members viewer on viewer.workspace_id = target.workspace_id
    where target.user_id = p_user_id and viewer.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles_select_same_workspace" on public.profiles for select using (public.can_view_profile(id));
create policy "profiles_insert_self" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_self" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "workspaces_select_members" on public.workspaces for select using (public.is_workspace_member(id));
create policy "workspaces_update_admins" on public.workspaces for update using (public.can_manage_workspace(id)) with check (public.can_manage_workspace(id));
create policy "workspace_members_select_members" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "workspace_members_insert_admins" on public.workspace_members for insert with check (public.can_manage_workspace(workspace_id));
create policy "workspace_members_update_admins" on public.workspace_members for update using (public.can_manage_workspace(workspace_id)) with check (public.can_manage_workspace(workspace_id));
create policy "workspace_members_delete_admins" on public.workspace_members for delete using (public.can_manage_workspace(workspace_id));
create policy "clients_select_members" on public.clients for select using (public.is_workspace_member(workspace_id));
create policy "clients_insert_members" on public.clients for insert with check (public.is_workspace_member(workspace_id));
create policy "clients_update_members" on public.clients for update using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "clients_delete_members" on public.clients for delete using (public.is_workspace_member(workspace_id));
create policy "projects_select_members" on public.projects for select using (public.is_workspace_member(workspace_id));
create policy "projects_insert_members" on public.projects for insert with check (public.is_workspace_member(workspace_id));
create policy "projects_update_members" on public.projects for update using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "projects_delete_members" on public.projects for delete using (public.is_workspace_member(workspace_id));
create policy "tasks_select_members" on public.tasks for select using (public.is_workspace_member(workspace_id));
create policy "tasks_insert_members" on public.tasks for insert with check (public.is_workspace_member(workspace_id));
create policy "tasks_update_members" on public.tasks for update using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "tasks_delete_members" on public.tasks for delete using (public.is_workspace_member(workspace_id));
create policy "activity_select_members" on public.activity_logs for select using (public.is_workspace_member(workspace_id));
create policy "activity_insert_members" on public.activity_logs for insert with check (public.is_workspace_member(workspace_id));

create or replace view public.workspace_member_details with (security_invoker = true) as
  select wm.user_id as id, wm.workspace_id, wm.user_id, wm.role, wm.created_at, p.full_name, p.avatar_url
  from public.workspace_members wm join public.profiles p on p.id = wm.user_id;

create or replace function public.log_activity_change() returns trigger language plpgsql security definer set search_path = public as $$
declare v_workspace uuid; v_entity uuid; v_label text; v_action text;
begin
  if tg_op = 'DELETE' then v_workspace := old.workspace_id; v_entity := old.id; v_label := coalesce(to_jsonb(old) ->> 'name', to_jsonb(old) ->> 'title', 'item'); v_action := 'deleted ' || v_label;
  else v_workspace := new.workspace_id; v_entity := new.id; v_label := coalesce(to_jsonb(new) ->> 'name', to_jsonb(new) ->> 'title', 'item');
    if tg_op = 'INSERT' then v_action := 'created ' || v_label;
    elsif tg_table_name = 'tasks' and new.status = 'done' and old.status is distinct from 'done' then v_action := 'completed ' || v_label;
    elsif tg_table_name = 'tasks' and new.status is distinct from old.status then v_action := 'moved ' || v_label || ' to ' || replace(new.status, '_', ' ');
    else v_action := 'updated ' || v_label; end if;
  end if;
  insert into public.activity_logs(workspace_id, user_id, entity_type, entity_id, action) values (v_workspace, auth.uid(), tg_table_name, v_entity, v_action);
  return coalesce(new, old);
end; $$;
create trigger clients_activity after insert or update or delete on public.clients for each row execute function public.log_activity_change();
create trigger projects_activity after insert or update or delete on public.projects for each row execute function public.log_activity_change();
create trigger tasks_activity after insert or update or delete on public.tasks for each row execute function public.log_activity_change();

create or replace function public.seed_demo_workspace(p_workspace uuid, p_owner uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.clients(workspace_id, name, company, email, phone, status, notes) values
    (p_workspace, 'Northstar Studio', 'Northstar Studio', 'hello@northstar.studio', '+1 (415) 555-0110', 'active', 'Primary brand and web partner.'),
    (p_workspace, 'PixelCraft', 'PixelCraft Co.', 'team@pixelcraft.co', '+1 (415) 555-0111', 'active', null),
    (p_workspace, 'Atlas Advisory', 'Atlas Advisory', 'hello@atlasadvisory.com', '+1 (415) 555-0112', 'active', null),
    (p_workspace, 'NovaWorks', 'NovaWorks', 'contact@novaworks.io', '+1 (415) 555-0113', 'active', null),
    (p_workspace, 'Summit Consulting', 'Summit Consulting', 'hello@summit.co', '+1 (415) 555-0114', 'active', null),
    (p_workspace, 'Oak & Co.', 'Oak & Co.', 'team@oakandco.com', '+1 (415) 555-0115', 'inactive', null);
  insert into public.projects(workspace_id, client_id, name, description, status, progress, start_date, due_date, created_by)
  select p_workspace, c.id, v.name, v.description, v.status, v.progress, current_date - v.started, current_date + v.due, p_owner
  from (values
    ('Northstar Studio','Website Redesign','A clear web experience for Northstar''s next chapter.','in_progress',68,35,9),
    ('PixelCraft','Brand Refresh','A consistent visual system and launch-ready files.','review',84,32,3),
    ('Atlas Advisory','Client Portal','A focused client portal and onboarding experience.','planning',20,25,20),
    ('NovaWorks','Marketing Campaign','Launch planning and campaign coordination.','in_progress',51,22,14),
    ('NovaWorks','Mobile App','Core mobile app flows and release readiness.','in_progress',42,20,7),
    ('Summit Consulting','Operations Dashboard','Executive visibility for operational work.','completed',100,40,-4),
    ('Oak & Co.','Content Strategy','Editorial plan and content operations.','planning',15,10,29),
    ('Atlas Advisory','CRM Migration','Safe planning for records migration.','on_hold',32,15,38)
  ) as v(client_name, name, description, status, progress, started, due) join public.clients c on c.workspace_id = p_workspace and c.name = v.client_name;
  insert into public.tasks(workspace_id, project_id, title, description, status, priority, assignee_id, due_date, position, created_by)
  select p_workspace, p.id, v.title, 'A focused next action for ' || v.project_name || '.', v.status, v.priority, p_owner, current_date + v.due, v.position, p_owner
  from (values
    ('Website Redesign','Create wireframes','in_progress','high',2,1),('Website Redesign','Review navigation system','review','medium',4,2),('Website Redesign','Build responsive homepage','todo','high',5,3),('Website Redesign','QA desktop breakpoints','todo','medium',7,4),
    ('Brand Refresh','Prepare final logo files','done','high',-2,5),('Brand Refresh','Collect client feedback','review','medium',1,6),('Brand Refresh','Update brand guidelines','done','low',-7,7),
    ('Client Portal','Plan onboarding flow','todo','urgent',8,8),('Client Portal','Map account permissions','in_progress','high',11,9),('Client Portal','Draft portal architecture','todo','medium',15,10),
    ('Marketing Campaign','Write campaign concepts','review','high',3,11),('Marketing Campaign','Schedule launch assets','todo','medium',10,12),('Marketing Campaign','Approve media plan','done','medium',-5,13),
    ('Mobile App','Design app navigation','in_progress','high',5,14),('Mobile App','Prototype empty states','todo','low',12,15),('Mobile App','Test authentication','review','urgent',1,16),('Mobile App','Create store screenshots','todo','medium',17,17),
    ('Operations Dashboard','Reconcile data fields','done','high',-12,18),('Operations Dashboard','Document reporting views','done','low',-9,19),('Operations Dashboard','Validate user flows','done','medium',-6,20),
    ('Content Strategy','Audit content inventory','todo','medium',22,21),('Content Strategy','Interview stakeholders','in_progress','high',17,22),('CRM Migration','Create migration checklist','todo','high',30,23),('CRM Migration','Import test records','todo','medium',34,24),('CRM Migration','Confirm cutover plan','review','urgent',26,25)
  ) as v(project_name, title, status, priority, due, position) join public.projects p on p.workspace_id = p_workspace and p.name = v.project_name;
end; $$;

create or replace function public.initialize_workspace() returns uuid language plpgsql security definer set search_path = public as $$
declare v_workspace uuid; v_name text; v_demo boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.profiles(id, full_name, timezone) values (auth.uid(), coalesce(auth.jwt() -> 'user_metadata' ->> 'full_name', 'ClientFlow member'), coalesce(auth.jwt() -> 'user_metadata' ->> 'timezone', 'UTC')) on conflict (id) do nothing;
  select workspace_id into v_workspace from public.workspace_members where user_id = auth.uid() order by created_at limit 1;
  if v_workspace is not null then return v_workspace; end if;
  v_demo := coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
  v_name := case when v_demo then 'ClientFlow Demo' else coalesce(auth.jwt() -> 'user_metadata' ->> 'full_name', 'My') || '''s Workspace' end;
  insert into public.workspaces(name, owner_id, is_demo) values (v_name, auth.uid(), v_demo) returning id into v_workspace;
  insert into public.workspace_members(workspace_id, user_id, role) values (v_workspace, auth.uid(), 'owner');
  if v_demo then perform public.seed_demo_workspace(v_workspace, auth.uid()); end if;
  return v_workspace;
end; $$;

create or replace function public.reset_demo_workspace() returns uuid language plpgsql security definer set search_path = public as $$
declare v_workspace uuid;
begin
  if auth.uid() is null or not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then raise exception 'Only anonymous demo workspaces can be reset'; end if;
  select w.id into v_workspace from public.workspaces w join public.workspace_members wm on wm.workspace_id = w.id where wm.user_id = auth.uid() and w.is_demo limit 1;
  if v_workspace is null then raise exception 'Demo workspace not found'; end if;
  delete from public.activity_logs where workspace_id = v_workspace;
  delete from public.tasks where workspace_id = v_workspace;
  delete from public.projects where workspace_id = v_workspace;
  delete from public.clients where workspace_id = v_workspace;
  perform public.seed_demo_workspace(v_workspace, auth.uid());
  return v_workspace;
end; $$;

revoke all on function public.seed_demo_workspace(uuid, uuid) from public;
grant execute on function public.initialize_workspace() to authenticated, anon;
grant execute on function public.reset_demo_workspace() to authenticated, anon;
