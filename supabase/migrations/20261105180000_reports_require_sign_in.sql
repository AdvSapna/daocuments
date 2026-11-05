-- Inaccuracy reports now require a signed-in user.
--
-- Sign-in is protected by Cloudflare Turnstile (Supabase Auth CAPTCHA), so
-- tying each report to an authenticated user keeps bots from filling the
-- table through the public publishable key. Signed-in users keep the same
-- column-level insert rights, and user_id still defaults to auth.uid().

begin;

drop policy "Anyone can submit a report as themselves" on public.inaccuracy_reports;
create policy "Signed-in users can submit a report as themselves"
  on public.inaccuracy_reports for insert
  to authenticated
  with check (user_id = (select auth.uid()));

revoke insert on table public.inaccuracy_reports from anon;

commit;
