-- FursuitCommissions CMS schema. Apply with `supabase db push` or the Supabase SQL editor.
create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
create type public.admin_role as enum ('owner', 'editor');
create type public.submission_status as enum ('new', 'in_progress', 'quoted', 'approved', 'completed', 'archived');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'editor',
  display_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_cms_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid()) and a.active = true
  );
$$;

create or replace function public.is_cms_owner()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid()) and a.active = true and a.role = 'owner'
  );
$$;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null check (storage_bucket in ('cms-public', 'cms-private')),
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  width integer,
  height integer,
  alt_text text not null default '',
  caption text not null default '',
  is_public boolean not null default true,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  status public.content_status not null default 'draft',
  seo_title text not null default '',
  meta_description text not null default '',
  canonical_url text,
  social_image_id uuid references public.media_assets(id) on delete set null,
  is_indexable boolean not null default true,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages(id) on delete cascade,
  section_type text not null check (section_type in ('rich_text', 'hero', 'cards', 'image', 'gallery', 'call_to_action')),
  heading text not null default '',
  body jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, position)
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  body jsonb not null default '[]'::jsonb,
  status public.content_status not null default 'draft',
  featured_image_id uuid references public.media_assets(id) on delete set null,
  seo_title text not null default '',
  meta_description text not null default '',
  canonical_url text,
  is_indexable boolean not null default true,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_post_categories (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  category_id uuid not null references public.blog_categories(id) on delete cascade,
  primary key (post_id, category_id)
);
create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  is_public boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.gallery_items (
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete cascade,
  position integer not null default 0,
  alt_override text not null default '',
  caption_override text not null default '',
  primary key (gallery_id, media_id),
  unique (gallery_id, position)
);

create table public.commission_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text not null default '',
  is_active boolean not null default true,
  position integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cms_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  submit_label text not null default 'Send inquiry',
  success_message text not null default 'Thanks. Your inquiry has been sent.',
  is_published boolean not null default false,
  current_version integer not null default 1 check (current_version > 0),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.form_notification_settings (
  form_id uuid primary key references public.cms_forms(id) on delete cascade,
  recipient_email text not null default '',
  updated_at timestamptz not null default now()
);
create table public.form_pages (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.cms_forms(id) on delete cascade,
  page_id uuid references public.cms_pages(id) on delete cascade,
  page_path text not null,
  unique (form_id, page_path)
);
create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.cms_forms(id) on delete cascade,
  field_key text not null,
  label text not null,
  field_type text not null check (field_type in ('text','textarea','email','tel','number','select','radio','checkbox','date','file','budget')),
  is_required boolean not null default false,
  placeholder text not null default '',
  help_text text not null default '',
  options jsonb not null default '[]'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  condition jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, field_key),
  unique (form_id, position)
);
create table public.form_versions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.cms_forms(id) on delete restrict,
  version integer not null,
  definition jsonb not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (form_id, version)
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid references public.cms_forms(id) on delete set null,
  form_version_id uuid references public.form_versions(id) on delete set null,
  form_name_snapshot text not null,
  form_definition_snapshot jsonb not null,
  page_path text not null default '',
  answers_snapshot jsonb not null,
  status public.submission_status not null default 'new',
  submitter_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.submission_answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.form_submissions(id) on delete cascade,
  field_key text not null,
  question_snapshot text not null,
  answer jsonb not null,
  position integer not null default 0,
  unique (submission_id, field_key)
);
create table public.submission_attachments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.form_submissions(id) on delete cascade,
  media_id uuid not null references public.media_assets(id) on delete restrict,
  original_name text not null,
  created_at timestamptz not null default now()
);
create table public.submission_notes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.form_submissions(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  note text not null check (length(note) between 1 and 10000),
  created_at timestamptz not null default now()
);

create index cms_pages_public_idx on public.cms_pages (published_at desc) where status = 'published';
create index blog_posts_public_idx on public.blog_posts (published_at desc) where status = 'published';
create index submissions_inbox_idx on public.form_submissions (status, created_at desc);
create index sections_order_idx on public.page_sections (page_id, position);
create index form_fields_order_idx on public.form_fields (form_id, position);

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
do $$ declare t text; begin
  foreach t in array array['admin_users','media_assets','cms_pages','page_sections','blog_posts','galleries','commission_types','cms_forms','form_notification_settings','form_fields','form_submissions'] loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- RLS: public reads only explicitly published content; all management requires an active admin.
do $$ declare t text; begin
  foreach t in array array['admin_users','media_assets','cms_pages','page_sections','blog_categories','blog_tags','blog_posts','blog_post_categories','blog_post_tags','galleries','gallery_items','commission_types','cms_forms','form_notification_settings','form_pages','form_fields','form_versions','form_submissions','submission_answers','submission_attachments','submission_notes'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

create policy "Admins read own admin profile" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Owners manage admin users" on public.admin_users for all to authenticated using (public.is_cms_owner()) with check (public.is_cms_owner());

create policy "Public reads public media" on public.media_assets for select to anon, authenticated using (is_public and storage_bucket = 'cms-public');
create policy "Admins manage media" on public.media_assets for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

create policy "Public reads published pages" on public.cms_pages for select to anon, authenticated using (status = 'published' and (published_at is null or published_at <= now()));
create policy "Admins manage pages" on public.cms_pages for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads sections of published pages" on public.page_sections for select to anon, authenticated using (exists (select 1 from public.cms_pages p where p.id = page_id and p.status = 'published' and (p.published_at is null or p.published_at <= now())));
create policy "Admins manage page sections" on public.page_sections for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

create policy "Public reads published posts" on public.blog_posts for select to anon, authenticated using (status = 'published' and published_at <= now());
create policy "Admins manage posts" on public.blog_posts for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads blog taxonomy" on public.blog_categories for select to anon, authenticated using (exists (select 1 from public.blog_post_categories pc join public.blog_posts p on p.id = pc.post_id where pc.category_id = id and p.status = 'published' and p.published_at <= now()));
create policy "Admins manage categories" on public.blog_categories for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads tags" on public.blog_tags for select to anon, authenticated using (exists (select 1 from public.blog_post_tags pt join public.blog_posts p on p.id = pt.post_id where pt.tag_id = id and p.status = 'published' and p.published_at <= now()));
create policy "Admins manage tags" on public.blog_tags for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads published post categories" on public.blog_post_categories for select to anon, authenticated using (exists (select 1 from public.blog_posts p where p.id = post_id and p.status = 'published' and p.published_at <= now()));
create policy "Admins manage post categories" on public.blog_post_categories for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads published post tags" on public.blog_post_tags for select to anon, authenticated using (exists (select 1 from public.blog_posts p where p.id = post_id and p.status = 'published' and p.published_at <= now()));
create policy "Admins manage post tags" on public.blog_post_tags for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

create policy "Public reads visible galleries" on public.galleries for select to anon, authenticated using (is_public);
create policy "Admins manage galleries" on public.galleries for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads visible gallery items" on public.gallery_items for select to anon, authenticated using (exists (select 1 from public.galleries g where g.id = gallery_id and g.is_public));
create policy "Admins manage gallery items" on public.gallery_items for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads active commission types" on public.commission_types for select to anon, authenticated using (is_active);
create policy "Admins manage commission types" on public.commission_types for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads published forms" on public.cms_forms for select to anon, authenticated using (is_published);
create policy "Admins manage forms" on public.cms_forms for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage form notification settings" on public.form_notification_settings for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads fields of published forms" on public.form_fields for select to anon, authenticated using (exists (select 1 from public.cms_forms f where f.id = form_id and f.is_published));
create policy "Admins manage form fields" on public.form_fields for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Public reads form assignments" on public.form_pages for select to anon, authenticated using (exists (select 1 from public.cms_forms f where f.id = form_id and f.is_published));
create policy "Admins manage form assignments" on public.form_pages for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage form versions" on public.form_versions for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage submissions" on public.form_submissions for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage answers" on public.submission_answers for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage submission attachments" on public.submission_attachments for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());
create policy "Admins manage private notes" on public.submission_notes for all to authenticated using (public.is_cms_admin()) with check (public.is_cms_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('cms-public', 'cms-public', true, 10485760, array['image/jpeg','image/png','image/webp','image/gif']),
  ('cms-private', 'cms-private', false, 20971520, array['image/jpeg','image/png','image/webp','image/gif','image/heic','image/heif','application/pdf'])
on conflict (id) do nothing;

create policy "Public reads CMS public assets" on storage.objects for select to anon, authenticated using (bucket_id = 'cms-public');
create policy "Admins upload CMS assets" on storage.objects for insert to authenticated with check (bucket_id in ('cms-public','cms-private') and public.is_cms_admin());
create policy "Admins update CMS assets" on storage.objects for update to authenticated using (bucket_id in ('cms-public','cms-private') and public.is_cms_admin()) with check (bucket_id in ('cms-public','cms-private') and public.is_cms_admin());
create policy "Admins delete CMS assets" on storage.objects for delete to authenticated using (bucket_id in ('cms-public','cms-private') and public.is_cms_admin());
