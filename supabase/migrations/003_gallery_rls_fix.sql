-- Service-role operations are only performed by trusted server code.
-- This policy allows the privileged server client to manage gallery rows.

drop policy if exists "service role full access to gallery" on public.gallery_photos;

create policy "service role full access to gallery"
on public.gallery_photos
as permissive
for all
to service_role
using (true)
with check (true);