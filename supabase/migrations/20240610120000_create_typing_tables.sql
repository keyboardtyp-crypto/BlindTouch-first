-- Create user_progress table
create table if not exists public.user_progress (
  user_id uuid references auth.users on delete cascade not null primary key,
  highest_level_id text not null default '1-1',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for user_progress
alter table public.user_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can modify their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Create typing_results table
create table if not exists public.typing_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  level_id text not null,
  accuracy float not null,
  is_success boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for typing_results
alter table public.typing_results enable row level security;

create policy "Users can view their own typing results"
  on public.typing_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own typing results"
  on public.typing_results for insert
  with check (auth.uid() = user_id);
