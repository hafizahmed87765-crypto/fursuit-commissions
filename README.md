# FursuitCommissions.com

Code rebuild of fursuitcommissions.com (previously WordPress + Elementor + WooCommerce on Hostinger).
Next.js 16 (App Router) · React 19 · Tailwind 3 · TypeScript. The public website focuses on custom commissions, parts, repairs and studio information; the shop and checkout have been removed.

## Commands

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint && npm run typecheck
```

## Structure

| Path | Purpose |
|------|---------|
| `src/content/site.ts` | Business facts, nav, announcement, prices, process, reviews (edit here) |
| `src/content/faqs.ts`, `portfolio.ts`, `legal.ts` | FAQs, curated gallery, Terms of Service |
| `src/data/gallery.raw.json` | Raw gallery image inventory; curated entries live in `src/content/portfolio.ts` |
| `public/media/` | Optimised local WebP image assets |
| `src/app/api/inquiry/route.ts` | Quote / repair / contact submissions → SMTP email with attachments |
| `src/proxy.ts` | 410 Gone for the injected spam URLs (`/blog/*`, old sitemaps) |
| `next.config.mjs` | 301/308 redirects from old WordPress URLs |
| `docs/` | Design system, content to-do, competitor notes |

## Environment

See `.env.example`. Required for production:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `OWNER_EMAIL` — optional email notifications for
  inquiries. With Supabase configured, submissions are saved in the admin inbox even if SMTP is unavailable.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — required for CMS, admin authentication, dynamic forms and database inquiry storage. Keep the service role key server-only.
- `NEXT_PUBLIC_GTM_ID` — existing GTM container (`GTM-57MGG25L`); loads only after cookie consent.

## CMS setup

See [CMS and Supabase setup](docs/CMS-SETUP.md) for the database migration, environment settings, first owner account and dashboard modules.

## Analytics events (dataLayer)

`service_selection`, `commission_planner_start`, `commission_planner_complete`, `quote_form_start`,
`quote_form_submit_success`, `repair_form_submit_success`, and `contact_form_submit_success`.
Success events fire only after the server confirms delivery. The public site has no shop checkout events.

## Deploying (outline)

1. Clean the WordPress install first (see security note below).
2. Deploy this app (Vercel, Netlify or Hostinger Node hosting) on the main domain with the env vars.
3. Submit the new `sitemap.xml` in Search Console; remove the old Yoast sitemaps.

## ⚠️ Security note — old WordPress site

The live WordPress site is compromised (found Oct 2026): ~5,500 injected casino spam posts under
`/blog/` (listed in the Yoast sitemaps) and French casino text injected into 15 pages on
2026-06-13. Before keeping that WordPress installation online for any purpose, restore from a
pre-June backup or clean it, update core/plugins, remove unknown admin users and plugins, rotate all
passwords and keys, and run a malware scan (Wordfence is installed).
