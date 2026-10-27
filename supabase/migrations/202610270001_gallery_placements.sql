-- Gallery placements: lets an admin choose where on the website a gallery is
-- shown, and tag photos for the gallery page filters. Run after
-- 202610260001_cms.sql. Safe to run more than once.

alter table public.galleries
  add column if not exists placement text;

do $$ begin
  alter table public.galleries
    add constraint galleries_placement_check
    check (placement is null or placement in ('home', 'gallery', 'kemono', 'toony', 'custom', 'parts'));
exception when duplicate_object then null; end $$;

-- One gallery per spot on the site.
create unique index if not exists galleries_placement_key
  on public.galleries (placement) where placement is not null;

alter table public.gallery_items
  add column if not exists tags text[] not null default '{}';
