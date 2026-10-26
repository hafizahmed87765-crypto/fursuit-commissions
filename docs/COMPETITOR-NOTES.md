# Competitor notes (Oct 2026)

Reviewed: dokidokifursuit.com, meowfursuits.com, koshkafursuits.com (all reachable).
lemonbrat.com did not resolve in DNS, so it was not reviewed.

| Pattern | Seen at | What we did |
|---------|---------|-------------|
| "Pick a starting point" coverage cards (Head / Partial / Fullbody) | Koshka | Commission options grid + planner |
| Open/closed commission banner | Koshka, DokiDoki | Config-driven announcement bar (no countdowns) |
| Short numbered process (Quote → Slot → Measurements → Build → Shipping) | Koshka | 7-step process from your actual Terms |
| Generic trust row ("24/7 support", "100% secure") | DokiDoki, Meow | Trust bar uses only your published policies |
| Large collection sprawl (artist, adoption, sale…) | Meow, DokiDoki | Kept shop separate from commissions; commissions get distinct service pages |
| Care guide / after-sales pages | Meow, DokiDoki | Care + warranty FAQ; dedicated repair intake (none of the three has one) |
| Reviews widget | All | Only verified content shown; YouTube client video used |

Opportunities we took: a dedicated **repair assessment** path, a **guided planner**
that prefills the quote, and **Kemono vs Toony** landing pages, none of which the
reviewed competitors offer.

## Homepage design pass (Oct 26, 2026)

Re-checked koshkafursuits.com and meowfursuits.com for layout (dokidokifursuit.com rate-limited the
request, so the notes above stand for it).

| Pattern | Seen at | Adopted as |
|---------|---------|------------|
| Scrolling ribbon of value points under the hero | Koshka | `TrustBar` marquee (published policies only) |
| "Pick a starting point" cards with prices | Koshka | `StartingPoints` (head / partial / fullsuit quoted; parts "from" prices from `site.ts`) |
| Labelled recent-work grid + "see all" | Koshka | Filterable `PortfolioGrid` on the homepage |
| Short numbered process | Koshka | Compact 7-step timeline |
| Three promises block | Koshka | WIP photos / warranty / worldwide shipping |
| Help banner with links + FAQ preview | Koshka | Help panel beside the FAQ |
| Category tabs for styles | Meow | Gallery filter pills |
| Two paths: custom quote vs guided matcher | Meow | Quote panel + commission planner panel |

Not adopted: star-rating widgets, "24/7 support"-style claims, sale pricing and countdowns — none are
backed by the studio's published facts.
