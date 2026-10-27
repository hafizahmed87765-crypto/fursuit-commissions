# SEO keyword strategy — FursuitCommissions.com (Oct 27, 2026)

Goal: rank for more fursuit searches, with stronger coverage of **furry costume(s)** and **furry mascot (costume)**,
without keyword stuffing or invented claims. Search volume and difficulty were **not available** (no keyword tool
access); every "Volume" below is *unknown* until checked in Google Search Console / Keyword Planner / Ahrefs.

## 1. Competitor research

| Competitor | Reached? | What they target (keyword ideas only — no copy reused) |
|---|---|---|
| ma-mascotte.com (fursuit page) | Yes | "custom fursuit", "furry suit manufacturing", "fursuit manufacturer", "custom made mascot", "mascot costume manufacture", "anthropomorphic animal costume", "toony fursuits", price "from €800", mascot-vs-fursuit explainer, delivery time |
| meowfursuits.com | Yes | "custom kemono & kig fursuits", "fursuit head", "kemono/toony/kig heads", "handpaws", "feetpaws", "partial / full fursuit", "fursona design", "custom quote", "fursuit care guide", "how to measure", blog: production timeline, full vs partial, faux fur quality |
| koshkafursuits.com (earlier pass) | Yes | "toony fursuit", starting prices per coverage, 5-step process, "commission status", washable parts, lifetime warranty |
| lemonbrat.com | **No** (DNS failure from this network) | Known from search: style & price guide, partial/fullsuit, digitigrade/plantigrade |
| dokidokifursuit.com | **No** (DNS failure / rate limit) | Earlier notes: open/closed banner, care pages, generic trust row |
| furrymascot.com | **No** (HTTP 429 rate limit) | Search shows marketplace-style "furry mascot / husky / fox fursuit costume" listings |

Search-result research: "how much does a fursuit cost" has many thin, scraped answer pages, which makes it a strong
opportunity for a genuine, specific pricing page. Common ranges quoted online were **not** copied onto the site.

## 2. Keyword list (categorised)

Intent: **C** commercial/transactional, **I** informational, **N** navigational. Priority: 1 = highest.

| Group | Keyword | Intent | Target page | Priority |
|---|---|---|---|---|
| Primary | fursuit commissions / fursuit commission | C | `/` | 1 |
| Primary | custom fursuit(s), commission a fursuit | C | `/fursuit-commission/` | 1 |
| Primary | fursuit maker(s), fursuit commission services | C | `/`, `/about-us/` | 2 |
| Furry costume | furry costume(s), custom furry costume(s) | C | `/furry-costumes/` | 1 |
| Furry costume | handmade furry costume, furry character costume, animal furry costume, anthropomorphic animal costume, furry suit, custom furry suit | C | `/furry-costumes/` | 2 |
| Furry costume | full furry costume | C | `/furry-costumes/`, `/fursuit-commission/` | 2 |
| Furry mascot | furry mascot(s), furry mascot costume, custom furry mascot (costume) | C | `/furry-mascot-costumes/` | 1 |
| Furry mascot | animal mascot costume, custom mascot costume, handmade mascot costume, full-body mascot costume, furry mascot commission | C | `/furry-mascot-costumes/` | 2 |
| Types | full fursuit / fullsuit commission, partial fursuit, fursuit head | C | `/fursuit-commission/` | 1 |
| Types | digitigrade fursuit, plantigrade fursuit | C/I | `/fursuit-commission/` (FAQ), `/fursuit-prices/` | 2 |
| Types | kemono fursuit, kig head | C | `/kemono-fursuits/` | 1 |
| Types | toony fursuit | C | `/toony-fursuits/` | 1 |
| Types | fursuit paws, hand paws, feet paws, fursuit tail | C | `/fursuit-parts/` | 2 |
| Types | fursuit reference sheet, fursona costume | C | `/furry-ref-sheet-commissions/` | 3 |
| Commercial | fursuit commission prices, custom fursuit cost, furry costume price, fursuit quote | C | `/fursuit-prices/`, `/get-a-quote/` | 1 |
| Commercial | fursuit payment plans | C | `/payment-plans/` | 2 |
| Informational | how much does a fursuit cost | I | `/fursuit-prices/` | 1 |
| Informational | how to commission a fursuit, fursuit commission process, timeline | I | `/order-process/` | 1 |
| Informational | fursuit measurements guide, fursuit care, materials, how to create a fursona | I | journal articles (see §6) | 3 |

**Not targeted (not offered or not supported by the site):** realistic fursuits, mini partials, LED/fan extras,
"fursuits for sale" / ready-made stock, cheap fursuits, mass mascot manufacturing.

## 3. Page-to-keyword map

| Page | Main keyword | Supporting keywords |
|---|---|---|
| `/` | fursuit commissions | custom fursuits, furry costumes, fursuit maker, furry mascot costumes |
| `/fursuit-commission/` | custom fursuit commission | fullsuit, partial, fursuit head, custom furry costume, digitigrade/plantigrade |
| `/furry-costumes/` **(new)** | custom furry costume(s) | furry costume, handmade, full furry costume, furry suit, costume styles |
| `/furry-mascot-costumes/` **(new)** | furry mascot costume | custom furry mascot, animal mascot costume, mascot vs fursuit |
| `/fursuit-prices/` **(new)** | fursuit commission prices | how much does a fursuit cost, custom fursuit cost, furry costume price |
| `/kemono-fursuits/` | kemono fursuit | kig commission, anime fursuit |
| `/toony-fursuits/` | toony fursuit | cartoon fursuit |
| `/fursuit-parts/` | fursuit parts | hand paws, feet paws, fursuit tail, fursuit head |
| `/gallery/` | fursuit gallery | custom fursuits, furry costumes, WIP |
| `/order-process/` | how to commission a fursuit | fursuit commission process, timeline |
| `/get-a-quote/` | custom fursuit quote | free quote |
| `/payment-plans/` | fursuit payment plans | deposits |
| `/fursuit-repairs/` | fursuit repairs | refurbishment |
| `/furry-ref-sheet-commissions/` | fursona reference sheet commission | ref sheet |
| `/journal/` | fursuit guides | (informational articles) |

Each page has one distinct intent; the three new pages do not duplicate existing ones.

## 4. Implemented changes

- **New pages:** `/furry-costumes/`, `/furry-mascot-costumes/`, `/fursuit-prices/`, built with the existing design
  system, each with breadcrumbs, FAQ structured data and (costume/mascot) `Service` schema. Prices shown are only those
  already published in `src/content/site.ts`; no ratings, reviews or prices were invented.
- **FAQs:** added "Is a fursuit the same as a furry costume?" and "Do you make digitigrade and plantigrade fursuits?"
  to the general FAQ (homepage), linked the pricing answer to `/fursuit-prices/`, and added costume, mascot and
  pricing FAQ sets (`src/content/faqs.ts`).
- **Metadata:** keyword-focused titles/descriptions for home, custom fursuits, gallery, process, quote, parts, about and
  journal; titles kept short enough to avoid truncation where practical.
- **Homepage copy:** hero eyebrow and intro now naturally mention fursuit commissions, custom furry costumes and a
  handmade fursuit maker; new "Fursuits, furry costumes & mascots" section links to the three new pages.
- **Internal links:** navigation (Fursuits menu, new "Prices" item; Payment Plans moved under More), footer, custom
  fursuit related links, process page, costume/mascot/price pages cross-link to quote, gallery, styles, parts,
  process, ref sheets and payment plans.
- **Sitemap:** three new pages added; galleries placed on a site page are excluded (see §5).

## 5. Technical issues found and fixed

| Issue | Fix |
|---|---|
| `/journal/` had no canonical URL or Open Graph data | Uses `pageMeta` with canonical |
| `/galleries/{slug}/` had no canonical; an admin gallery placed on e.g. `/gallery/` would be duplicate content | Canonical points to the placement page; placed galleries left out of the sitemap |
| No page targeted "furry costume", "furry mascot" or pricing intent | Dedicated pages added |
| Verified on all 19 sitemap URLs | 200 status, one H1, canonical matches URL, no accidental `noindex`, valid JSON-LD types, 0 broken internal links; robots.txt allows the site and blocks only `/api/` and `/admin/` |
| Query parameters (`/get-a-quote/?coverage=…`) | Canonical already strips them — no change needed |

## 6. Outstanding tasks (need your access or tools)

1. **Confirm mascot scope** (docs/CONTENT-TODO.md) — whether brand/team/business mascots are offered.
2. **Keyword volumes:** check the §2 list in Google Search Console and a keyword tool; reprioritise by real demand.
3. **Retry competitor research** for lemonbrat.com, dokidokifursuit.com and furrymascot.com from another network.
4. **Journal articles** (create in Admin → Blog; each should link to the matching service page and the quote form):
   - How much does a fursuit cost? Coverage, style and extras explained → link `/fursuit-prices/`
   - Partial vs fullsuit: which furry costume is right for you? → `/fursuit-commission/`
   - Kemono vs Toony fursuits: choosing your style → `/kemono-fursuits/`, `/toony-fursuits/`
   - Digitigrade vs plantigrade fursuits → `/fursuit-commission/`
   - How to measure for a fursuit (only with your real measurement instructions)
   - How to care for your fursuit (from your aftercare guidance)
   - How to commission a fursuit, step by step → `/order-process/`
5. **Submit the sitemap** (`/sitemap.xml`) in Google Search Console and Bing Webmaster Tools after deploying.
6. **Image file names:** many WIP photos use marketplace CDN names (`o1cn01…`). Renaming changes URLs, so do it
   gradually via the new admin gallery upload (descriptive file names) rather than renaming files in place.

## 7. Tracking

- **Google Search Console:** track impressions, clicks and average position for the §2 keywords; watch the three new
  pages under Pages → Performance.
- **GA4 via the existing GTM consent setup:** organic sessions by landing page, and conversions for quote, repair and
  contact form submissions (the site already fires analytics events through `src/lib/analytics.ts`).
- **CMS submissions inbox:** add a "how did you find us?" field to the quote form if you want to attribute
  commissions to search.
- Review monthly; expand pages that gain impressions but low clicks (improve titles), and write journal articles for
  queries that appear in Search Console but have no matching page.
