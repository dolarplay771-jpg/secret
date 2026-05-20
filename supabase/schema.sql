create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Secret User',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_day text not null check (due_day in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  priority text not null check (priority in ('low','medium','high')),
  category text not null check (category in ('personal','work','health','study','finance')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.finance_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#d7b35a',
  type text not null check (type in ('income','expense','both')),
  created_at timestamptz not null default now()
);

create table if not exists public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.finance_categories(id) on delete set null,
  title text not null,
  amount numeric(12,2) not null check (amount > 0),
  type text not null check (type in ('income','expense')),
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.study_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#d7b35a',
  priority text not null check (priority in ('low','medium','high')),
  weekly_goal_minutes integer not null check (weekly_goal_minutes >= 30),
  created_at timestamptz not null default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.study_subjects(id) on delete cascade,
  title text not null,
  minutes integer not null check (minutes >= 10),
  date date not null,
  completed boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.study_subjects(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null check (category in ('personal','finance','study','health','career')),
  priority text not null check (priority in ('low','medium','high')),
  target_value numeric(12,2) not null check (target_value > 0),
  current_value numeric(12,2) not null default 0 check (current_value >= 0),
  unit text not null default 'itens',
  deadline date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.finance_categories enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.study_subjects enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_notes enable row level security;
alter table public.goals enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "tasks_all_own" on public.tasks;
create policy "tasks_all_own" on public.tasks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "finance_categories_all_own" on public.finance_categories;
create policy "finance_categories_all_own" on public.finance_categories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "finance_transactions_all_own" on public.finance_transactions;
create policy "finance_transactions_all_own" on public.finance_transactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_subjects_all_own" on public.study_subjects;
create policy "study_subjects_all_own" on public.study_subjects
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_sessions_all_own" on public.study_sessions;
create policy "study_sessions_all_own" on public.study_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "study_notes_all_own" on public.study_notes;
create policy "study_notes_all_own" on public.study_notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "goals_all_own" on public.goals;
create policy "goals_all_own" on public.goals
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_achievements_all_own" on public.user_achievements;
create policy "user_achievements_all_own" on public.user_achievements
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Secret User'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
