-- Madrid Noir schema (Phase 2 — RLS hardened)
--
-- Public-read tables: cases, npc_profiles
-- Per-user tables (owned by auth.uid() = profile_id): profiles, dialogue_history,
--   vocabulary_progress, grammar_progress, save_states

-- Tables ----------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.cases (
  id text primary key,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.npc_profiles (
  id text primary key,
  case_id text references public.cases (id) on delete cascade,
  name text not null,
  persona_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dialogue_history (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  case_id text references public.cases (id) on delete cascade,
  npc_id text references public.npc_profiles (id) on delete set null,
  speaker text not null check (speaker in ('npc', 'player', 'system')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists dialogue_history_profile_created_idx
  on public.dialogue_history (profile_id, created_at desc);

create table if not exists public.vocabulary_progress (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  token text not null,
  mastery_score int not null default 0,
  updated_at timestamptz not null default now(),
  unique (profile_id, token)
);

create table if not exists public.grammar_progress (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  grammar_topic text not null,
  mastery_score int not null default 0,
  updated_at timestamptz not null default now(),
  unique (profile_id, grammar_topic)
);

create table if not exists public.save_states (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  case_id text references public.cases (id) on delete cascade,
  state_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, case_id)
);

-- Row level security ----------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.npc_profiles enable row level security;
alter table public.dialogue_history enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.grammar_progress enable row level security;
alter table public.save_states enable row level security;

-- Public-read content
drop policy if exists "cases_public_read" on public.cases;
create policy "cases_public_read" on public.cases
  for select using (true);

drop policy if exists "npc_profiles_public_read" on public.npc_profiles;
create policy "npc_profiles_public_read" on public.npc_profiles
  for select using (true);

-- Per-user profile (one row per auth user)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Macro for per-user owned-by-profile-id tables
do $$
declare
  tbl text;
begin
  foreach tbl in array array['dialogue_history', 'vocabulary_progress', 'grammar_progress', 'save_states']
  loop
    execute format('drop policy if exists "%1$s_select_own" on public.%1$s;', tbl);
    execute format(
      'create policy "%1$s_select_own" on public.%1$s for select using (auth.uid() = profile_id);',
      tbl
    );
    execute format('drop policy if exists "%1$s_insert_own" on public.%1$s;', tbl);
    execute format(
      'create policy "%1$s_insert_own" on public.%1$s for insert with check (auth.uid() = profile_id);',
      tbl
    );
    execute format('drop policy if exists "%1$s_update_own" on public.%1$s;', tbl);
    execute format(
      'create policy "%1$s_update_own" on public.%1$s for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);',
      tbl
    );
    execute format('drop policy if exists "%1$s_delete_own" on public.%1$s;', tbl);
    execute format(
      'create policy "%1$s_delete_own" on public.%1$s for delete using (auth.uid() = profile_id);',
      tbl
    );
  end loop;
end$$;

-- Auto-create a profile row on auth signup
create or replace function public.handle_new_user() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
