-- Performance Advisor: "Auth RLS Initialization Plan" on public.subscribers.
--
-- The insert and update policies compared the row's email with
-- lower((select auth.jwt() ->> 'email')). Postgres stores that as
-- (SELECT (auth.jwt() ->> 'email')), which the linter cannot recognise as a
-- once-per-statement value. Wrapping only the function call,
-- (select auth.jwt()) ->> 'email', is the documented form and lets Postgres
-- evaluate auth.jwt() once per statement instead of once per row.
-- Access rules are unchanged.

begin;

drop policy "Users can create their own subscription" on public.subscribers;
create policy "Users can create their own subscription"
  on public.subscribers for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and lower(email) = lower((select auth.jwt()) ->> 'email')
  );

drop policy "Users can update their own subscription" on public.subscribers;
create policy "Users can update their own subscription"
  on public.subscribers for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and lower(email) = lower((select auth.jwt()) ->> 'email')
  );

commit;
