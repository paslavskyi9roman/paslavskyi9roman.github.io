-- Madrid Noir schema draft (MVP foundation)

create table if not exists public.profiles (
  id uuid primary key,
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
  case_id text references public.cases(id) on delete cascade,
  name text not null,
  persona_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.dialogue_history (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  case_id text references public.cases(id) on delete cascade,
  npc_id text references public.npc_profiles(id) on delete set null,
  speaker text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vocabulary_progress (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  token text not null,
  mastery_score int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.grammar_progress (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  grammar_topic text not null,
  mastery_score int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.save_states (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  case_id text references public.cases(id) on delete cascade,
  state_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.npc_profiles enable row level security;
alter table public.dialogue_history enable row level security;
alter table public.vocabulary_progress enable row level security;
alter table public.grammar_progress enable row level security;
alter table public.save_states enable row level security;

-- RLS policy placeholders (intentionally not permissive):
-- create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
-- create policy "dialogue_insert_own" on public.dialogue_history for insert with check (auth.uid() = profile_id);
-- Add full policies only after auth flow and ownership rules are finalized.
