# CMS and Supabase setup

The CMS uses Supabase Auth for staff sign-in, Postgres for content and inquiries, and Supabase Storage for reusable images and private customer attachments. The service role key is used only from server-only code and must never be prefixed with `NEXT_PUBLIC_`.

## Connect a Supabase project

1. Create a Supabase project and copy its project URL, anon key and service role key from the project API settings.
2. Add these values to `.env.local` for development and to the deployment provider's server environment:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Apply `supabase/migrations/202610260001_cms.sql` in the Supabase SQL Editor. It creates the CMS tables, indexes, RLS policies and the `cms-public` and `cms-private` storage buckets.
4. Create the first staff login in Supabase **Authentication → Users**. Disable public sign-ups in Supabase Auth.
5. Add that user to the CMS admin allowlist. Replace the email below with the account you created:

   ```sql
   insert into public.admin_users (user_id, role, display_name)
   select id, 'owner', 'Site Owner'
   from auth.users
   where email = 'your-admin@example.com'
   on conflict (user_id) do update set role = excluded.role, active = true;
   ```

6. Start the app with `npm run dev` and open `/admin/login/`.

Further staff accounts must first be created in Supabase Auth, then added to `admin_users` as `editor` or `owner`. Only owners can delete pages and page sections or remove gallery images. All server actions and admin API routes check the signed-in user's active admin record; RLS is also enabled on CMS tables.

## What the CMS manages

- **Pages:** create, edit, duplicate, preview, publish, archive or delete CMS pages. CMS-created pages render at `/content/{slug}/`. Page sections use ordered JSON content blocks, and images can be selected from the media library.
- **Blog:** rich-text editor with headings, lists, links and images from the library. Articles support drafts and immediate publishing, categories, tags, featured images and SEO fields. Public routes are `/journal/` and `/journal/{slug}/`.
- **Media:** upload JPEG, PNG or WebP images up to 10 MB. Images are resized and converted to WebP. Alt text and captions can be edited and reused in blog posts, page sections and galleries.
- **Galleries:** create public or private galleries and reuse library images in multiple galleries. Public gallery routes are `/galleries/{slug}/`.
- **Commission types:** manage the CMS commission-type records.
- **Forms:** create field definitions using JSON in the dashboard. Supported `field_type` values are `text`, `textarea`, `email`, `tel` (telephone), `number`, `select`, `radio`, `checkbox`, `date`, `file` and `budget`. Fields can be required, ordered, assigned options/help/placeholder text, and conditionally shown with an `equals` condition. Assign page paths one per line. Forms can be edited, previewed and published at `/forms/{slug}/`, and also render on supported assigned website pages.
- **Submissions:** view and filter by status, form and date; update status; add private notes; open a snapshot of the questions and answers; download private attachments through short-lived signed links; and export up to 5,000 filtered submissions as CSV.

Published pages, posts, visible galleries and CMS pages with indexing enabled are included in the generated sitemap. Draft pages and posts are queried only with published-status filters and are also protected by database row-level security. Inquiry uploads use the private storage bucket; they are not public media URLs.

The existing hand-built service pages keep their custom layouts. CMS-created pages are additional database-driven pages rather than replacements for those source-controlled pages. Legacy quote, repair and contact forms are also saved to the submission inbox when Supabase is configured; they keep their original field/answer snapshot. SMTP remains optional for saving inquiries but is needed for email notifications.
