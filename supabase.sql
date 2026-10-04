-- Optional cross-device sync backend for Life100.
-- Create a Supabase project, run this in SQL Editor, and enable Email auth.

create table if not exists public.life100_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.life100_snapshots enable row level security;

create policy "life100_select_own"
on public.life100_snapshots for select
using (auth.uid() = user_id);

create policy "life100_insert_own"
on public.life100_snapshots for insert
with check (auth.uid() = user_id);

create policy "life100_update_own"
on public.life100_snapshots for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
