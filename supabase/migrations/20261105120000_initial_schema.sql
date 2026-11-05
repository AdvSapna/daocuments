-- DAOcuments database schema.
--
-- Recreates everything the app talks to through Supabase:
--   public.countries          optional overrides for the built-in country data
--   public.subscribers        newsletter opt-ins, saved after sign-in
--   public.inaccuracy_reports "Report inaccuracy" form submissions
--   public.increment_visitor_count()  the visitor counter
--
-- Access is explicit: every table starts with all Data API access revoked,
-- then gets only the grants the app needs, and Row Level Security limits
-- which rows each role can touch. This works the same whether or not the
-- project has "Automatically expose new tables" turned on.
--
-- Run once on a new project (SQL Editor, or psql over a direct connection).

begin;

-- ---------------------------------------------------------------------------
-- Private schema for internals. It is not exposed through the Data API.
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- countries
--
-- A published row replaces the built-in SAMPLE entry with the same ISO-2
-- code, so column names match the keys the app reads (including "euMember").
-- Edit rows from the Dashboard; the app only reads published rows.
-- ---------------------------------------------------------------------------
create table public.countries (
  iso2          text primary key check (iso2 ~ '^[A-Z]{2}$'),
  name          text not null,
  status        text not null check (status in ('legal', 'partial', 'restricted', 'banned')),
  summary       text,
  legislation   jsonb not null default '[]'::jsonb check (jsonb_typeof(legislation) = 'array'),
  news          jsonb not null default '[]'::jsonb check (jsonb_typeof(news) = 'array'),
  cases         jsonb not null default '[]'::jsonb check (jsonb_typeof(cases) = 'array'),
  analysis      jsonb not null default '[]'::jsonb check (jsonb_typeof(analysis) = 'array'),
  framework     jsonb check (framework is null or jsonb_typeof(framework) = 'object'),
  "euMember"    boolean not null default false,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.countries is
  'Optional overrides for the country data built into the app. Only rows with is_published = true are shown.';

create trigger countries_set_updated_at
  before update on public.countries
  for each row execute function private.set_updated_at();

alter table public.countries enable row level security;

create policy "Anyone can read published countries"
  on public.countries for select
  to anon, authenticated
  using (is_published);

revoke all on table public.countries from anon, authenticated;
grant select on table public.countries to anon, authenticated;
grant select, insert, update, delete on table public.countries to service_role;

-- ---------------------------------------------------------------------------
-- subscribers
--
-- After a magic-link sign-in the app upserts one row per user
-- (on conflict user_id). Users can only see and change their own row, and
-- only for the email address they actually signed in with.
-- ---------------------------------------------------------------------------
create table public.subscribers (
  user_id           uuid primary key references auth.users (id) on delete cascade,
  email             text not null check (char_length(email) <= 320),
  newsletter_optin  boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.subscribers is
  'Newsletter preference for each signed-in user.';

create trigger subscribers_set_updated_at
  before update on public.subscribers
  for each row execute function private.set_updated_at();

alter table public.subscribers enable row level security;

-- UPDATE (and so upsert) needs a SELECT policy to find the existing row.
create policy "Users can read their own subscription"
  on public.subscribers for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own subscription"
  on public.subscribers for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and lower(email) = lower((select auth.jwt() ->> 'email'))
  );

create policy "Users can update their own subscription"
  on public.subscribers for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and lower(email) = lower((select auth.jwt() ->> 'email'))
  );

revoke all on table public.subscribers from anon, authenticated;
grant select, insert, update on table public.subscribers to authenticated;
grant select, insert, update, delete on table public.subscribers to service_role;

-- ---------------------------------------------------------------------------
-- inaccuracy_reports
--
-- Anyone viewing a country can report a problem. Clients may only insert the
-- five form fields; user_id, status and timestamps are set by the database.
-- Nobody but the project owner can read reports.
-- ---------------------------------------------------------------------------
create table public.inaccuracy_reports (
  id              uuid primary key default gen_random_uuid(),
  country_code    text not null check (char_length(country_code) <= 10),
  country_name    text not null check (char_length(country_name) between 1 and 200),
  field_reported  text not null check (char_length(field_reported) between 1 and 200),
  detail          text not null check (char_length(detail) between 1 and 5000),
  source_link     text check (char_length(source_link) <= 2000),
  user_id         uuid default auth.uid() references auth.users (id) on delete set null,
  status          text not null default 'new' check (status in ('new', 'reviewing', 'resolved', 'rejected')),
  created_at      timestamptz not null default now()
);

comment on table public.inaccuracy_reports is
  'Reports submitted from the "Report inaccuracy" form. user_id is set when the reporter is signed in.';

create index inaccuracy_reports_created_at_idx on public.inaccuracy_reports (created_at desc);
create index inaccuracy_reports_user_id_idx on public.inaccuracy_reports (user_id);

alter table public.inaccuracy_reports enable row level security;

create policy "Anyone can submit a report as themselves"
  on public.inaccuracy_reports for insert
  to anon, authenticated
  with check (user_id is not distinct from (select auth.uid()));

revoke all on table public.inaccuracy_reports from anon, authenticated;
grant insert (country_code, country_name, field_reported, detail, source_link)
  on table public.inaccuracy_reports to anon, authenticated;
grant select, insert, update, delete on table public.inaccuracy_reports to service_role;

-- ---------------------------------------------------------------------------
-- Visitor counter
--
-- The count lives in the private schema so clients cannot set it directly.
-- public.increment_visitor_count() is the only way in: it adds one and
-- returns the new total.
-- ---------------------------------------------------------------------------
create table private.site_stats (
  id             boolean primary key default true check (id),
  visitor_count  bigint not null default 0 check (visitor_count >= 0)
);

insert into private.site_stats default values;

create function private.increment_visitor_count()
returns bigint
language sql
security definer
set search_path = ''
as $$
  update private.site_stats
     set visitor_count = visitor_count + 1
   where id
  returning visitor_count;
$$;

revoke all on function private.increment_visitor_count() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.increment_visitor_count() to anon, authenticated;

create function public.increment_visitor_count()
returns bigint
language sql
security invoker
set search_path = ''
as $$
  select private.increment_visitor_count();
$$;

revoke all on function public.increment_visitor_count() from public, anon, authenticated;
grant execute on function public.increment_visitor_count() to anon, authenticated, service_role;

commit;
