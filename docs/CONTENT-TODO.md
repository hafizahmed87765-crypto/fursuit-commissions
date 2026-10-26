# Content & business info to confirm before launch

Everything below is wired up in code but needs an owner decision or real data.
Edit `src/content/*.ts` — no component changes needed.

| # | Item | Where | Current behaviour |
|---|------|-------|-------------------|
| 1 | **Testimonials.** The 4 homepage quotes (Tobey Bryan, Jessica M., Maria Mak, Jackma Kalin) could not be verified. | `src/content/site.ts` → `reviews[].confirmed` | Hidden. Set `confirmed: true` only for genuine, permitted reviews. |
| 2 | **Image provenance.** Most WIP photos have Taobao/Alibaba CDN filenames (`O1CN01…`). Several product images have AI-tool filenames (`use-the-uploaded-image-as-reference…`, `generate-the-exact…`). | `src/content/portfolio.ts`, product data | WIP photos shown in gallery; AI-named images used only as shop examples. Confirm they depict your own real work/products. |
| 3 | **Repair services offered.** Seam repair, fur replacement, head refurbishment, alterations. | `site.ts` → `repairServices`, `inquiry.ts` → `REPAIR_TYPES` | Shown with "assessment only, no guarantee" wording. Remove any you don't offer. |
| 4 | **Announcement bar** says commissions are open (from your About page). | `site.ts` → `announcement` | Change `status`/`text` or `enabled: false` when slots close. |
| 5 | **Before/after repair photos** | — | None exist; add to `portfolio.ts` with tag `wip` or a new tag when you have them. |
| 6 | **Privacy policy** | `src/app/privacy-policy/page.tsx` | Plain-language draft describing what this code does. Have it reviewed. |
| 7 | **Copyrighted characters.** Shop sells Pokémon-themed items (Gengar, Zeraora, Brawl Stars) while the Terms say no copyrighted characters without licensing. The old cosplay page named Spider-Man, Chun-Li etc. | Shop data / Terms | New cosplay page avoids named IP. Decide on the products. |
| 8 | **$0 products** (Inflatable Cat, Yellow & Black Cat Ear headbands) | WooCommerce | Shown as "Ask for price"; no buy button. Fix price in WooCommerce, then `npm run sync`. |
| 9 | **20 uncategorised products** | WooCommerce | Still listed in shop; assign categories in WooCommerce, then `npm run sync`. |
| 10 | Production time "6–12 weeks on average" (from old homepage FAQ) | `site.ts` → `policies` | Confirm still accurate. |
