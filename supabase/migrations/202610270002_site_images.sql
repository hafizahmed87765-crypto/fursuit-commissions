-- Site images: lets an admin replace the fixed photos on the website (hero,
-- style cards, page banners, process steps...) from Admin > Site images.
-- Each row overrides one slot (IDs match docs/IMAGE-REPLACEMENT-SHEET.csv);
-- slots without a row keep showing the built-in photo. Run after
-- 202610260001_cms.sql. Safe to run more than once.

create table if not exists public.site_images (
  slot text primary key check (slot ~ '^[A-Z][0-9]{1,2}$'),
  media_id uuid not null references public.media_assets(id) on delete cascade,
  alt_text text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;

drop policy if exists "Public reads site images" on public.site_images;
create policy "Public reads site images" on public.site_images for select to anon, authenticated using (true);

drop policy if exists "Admins manage site images" on public.site_images;
create policy "Admins manage site images" on public.site_images for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
