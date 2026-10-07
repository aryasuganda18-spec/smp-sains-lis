begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_profiles where id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

do $$
declare
  existing record;
begin
  for existing in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('admin_profiles', 'albums', 'announcements', 'articles', 'gallery_photos', 'ppdb_registrations', 'videos')
  loop
    execute format('drop policy %I on %I.%I', existing.policyname, existing.schemaname, existing.tablename);
  end loop;

  for existing in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (coalesce(qual, '') || coalesce(with_check, '')) like '%cms-media%'
  loop
    execute format('drop policy %I on storage.objects', existing.policyname);
  end loop;
end
$$;

alter table public.admin_profiles enable row level security;
alter table public.albums enable row level security;
alter table public.announcements enable row level security;
alter table public.articles enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.ppdb_registrations enable row level security;
alter table public.videos enable row level security;

create policy "admin membaca profil sendiri" on public.admin_profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "publik membaca album" on public.albums
  for select to anon, authenticated using (true);
create policy "publik membaca foto galeri" on public.gallery_photos
  for select to anon, authenticated using (true);
create policy "publik membaca artikel terbit" on public.articles
  for select to anon, authenticated using (status = 'published');
create policy "publik membaca video tampil" on public.videos
  for select to anon, authenticated using (published = true);
create policy "publik membaca pengumuman tampil" on public.announcements
  for select to anon, authenticated using (published = true);

create policy "publik mengirim pendaftaran" on public.ppdb_registrations
  for insert to anon with check (status = 'baru' and source in ('ppdb_form', 'kontak_form'));

create policy "admin mengelola album" on public.albums
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin mengelola foto galeri" on public.gallery_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin mengelola artikel" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin mengelola video" on public.videos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin mengelola pengumuman" on public.announcements
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin mengelola pendaftaran" on public.ppdb_registrations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin membaca file cms-media" on storage.objects
  for select to authenticated using (bucket_id = 'cms-media' and public.is_admin());
create policy "admin mengunggah file cms-media" on storage.objects
  for insert to authenticated with check (bucket_id = 'cms-media' and public.is_admin());
create policy "admin mengubah file cms-media" on storage.objects
  for update to authenticated using (bucket_id = 'cms-media' and public.is_admin());
create policy "admin menghapus file cms-media" on storage.objects
  for delete to authenticated using (bucket_id = 'cms-media' and public.is_admin());

revoke all on all tables in schema public from anon;
grant select on public.albums, public.gallery_photos, public.articles, public.videos, public.announcements, public.albums_with_cover to anon;
grant insert on public.ppdb_registrations to anon;
revoke all on public.admin_profiles from authenticated;
grant select on public.admin_profiles to authenticated;

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
drop function if exists public.get_dashboard_stats();

update storage.buckets
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png']
where id = 'cms-media';

alter table public.ppdb_registrations drop constraint if exists ppdb_registrations_length_check;
alter table public.ppdb_registrations add constraint ppdb_registrations_length_check check (
  char_length(student_name) <= 100 and char_length(parent_name) <= 100 and char_length(whatsapp) <= 20
  and char_length(email) <= 150 and char_length(nisn) <= 20 and char_length(message) <= 500
  and char_length(student_address) <= 300 and char_length(previous_school) <= 150
  and char_length(parent_job) <= 100 and char_length(student_birthplace) <= 100
) not valid;

alter table public.articles drop constraint if exists articles_length_check;
alter table public.articles add constraint articles_length_check check (
  char_length(title) <= 150 and char_length(excerpt) <= 300 and char_length(author) <= 100
  and char_length(content) <= 200000
) not valid;

alter table public.announcements drop constraint if exists announcements_length_check;
alter table public.announcements add constraint announcements_length_check check (
  char_length(title) <= 150 and char_length(content) <= 3000
) not valid;

alter table public.videos drop constraint if exists videos_length_check;
alter table public.videos add constraint videos_length_check check (
  char_length(title) <= 150 and char_length(description) <= 500
  and char_length(video_url) <= 500 and video_url ~ '^https://'
) not valid;

alter table public.albums drop constraint if exists albums_length_check;
alter table public.albums add constraint albums_length_check check (
  char_length(title) <= 100 and char_length(description) <= 300
) not valid;

alter table public.gallery_photos drop constraint if exists gallery_photos_length_check;
alter table public.gallery_photos add constraint gallery_photos_length_check check (char_length(caption) <= 150) not valid;

create or replace function public.limit_registration_rate()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    select count(*) from public.ppdb_registrations
    where whatsapp = new.whatsapp and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Terlalu banyak pendaftaran dari nomor ini. Coba lagi nanti.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public.limit_registration_rate() from public, anon, authenticated;

drop trigger if exists trg_limit_registration_rate on public.ppdb_registrations;
create trigger trg_limit_registration_rate
  before insert on public.ppdb_registrations
  for each row execute function public.limit_registration_rate();

commit;
