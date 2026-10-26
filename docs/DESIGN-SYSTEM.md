# Design system

## Brand colours (preserved from the live WordPress theme)

| Token | Hex | Source / use |
|-------|-----|--------------|
| `forest` | `#21463F` | Elementor global primary — text, primary buttons, ribbon, repair band |
| `mint` | `#A5D4C4` | Astra global 0/5 — logo body, CTA panels, timeline line |
| `mint-light` | `#D1FADF` | Astra global 1 — chips, soft buttons, step rings |
| `mint-footer` | `#D3E9E1` | Footer background |
| `mint-wash` | `#F1F8F5` | Astra global 7 — hero and alternate sections |
| `lavender` / `lavender-soft` | `#E4D0FF` / `#F2E7FF` | Astra 2 / 8 — planner, "Partial" card, Kemono chip |
| `blush` | `#FFCCC9` | Astra 6 — Toony chip |
| `snow` / `petal` | `#F8FDFF` / `#FFF7FC` | Astra 3 / 4 |

Added for accessibility only: `ink-muted #46625C` (6.6:1 on white) and `mint-deep #3F7F6E`
(4.7:1, focus rings and eyebrows). Muted text is only used on white/wash/soft surfaces; on `mint` use `forest`.
No orange is used anywhere on the site.

## Type
- Display: **Fredoka** (rounded, echoes the logo wordmark), bold for headings. Body: **Nunito Sans**.

## Look: toony sticker-book
Built to feel native to the furry fandom: 3px forest outlines with hard offset shadows (`shadow-toon-sm|toon|toon-lg`)
like toony linework, a paw-print background (`.bg-paws`), paw bullets (`components/Paw.tsx`), a character **ref sheet**
hero, **con-badge** style cards with lanyard clips, **polaroid** gallery frames with washi tape, and the wolf mascot
peeking from the final CTA. Fandom language is used in eyebrows only (fursona, ref sheet, con floor, badge wall);
all claims stay within the studio's published facts.

## Components (`src/app/globals.css`)
`.btn-primary`, `.btn-secondary`, `.btn-soft`, `.btn-sm` (outlined pills that press in on click), `.toon` + `.toon-hover`
(outlined cards), `.sticker` (tilted labels), `.marker` (highlighter under a heading phrase — `SectionHeading mark="…"`),
`.tape` (washi tape on photo frames), `.card`, `.card-hover`, `.img-zoom`, `.chip`, `.link`, `.field`, `.field-label`,
`.field-error`, `.choice`, `.eyebrow`, `.h-section`, `.lede`, `.bg-paws`, `.marquee-track`. Radius `rounded-blob` (2rem).

Note: never put a rotate/translate utility on the same element as `data-reveal` *and* an entrance animation class
(`animate-rise` etc.) — keyframes override utility transforms. Wrap the element instead.

## Homepage structure (informed by docs/COMPETITOR-NOTES.md)
Hero → selling-point ribbon → "Pick a starting point" coverage cards → style cards → two paths
(quote vs planner) → filterable featured work → 7-step timeline → why commission → repairs →
planner (`#planner`) → promises → client video → help + FAQ (`#faq`) → CMS form slot → final CTA.

## Motion
- Easing: `ease-smooth` (`cubic-bezier(.16,1,.3,1)`).
- Page transitions: `src/app/template.tsx` fades each page in on navigation (`animate-page`).
- Hero: staggered `animate-rise`, collage `animate-reveal`, underline `animate-draw`, floating status card (`animate-float`).
- Ribbon: tilted band with `animate-marquee`, pauses on hover; wraps statically under reduced motion.
- Paw trail (`PawTrail`): prints appear one after another (`animate-paw-step`); stickers `animate-wiggle`; mascot `animate-peek` when the CTA scrolls in.
- Scroll reveal: `data-reveal` (+ optional `--reveal-delay`, or `data-reveal="zoom"`) — fade + 24px rise, once.
- Hover: `.card-hover` lifts cards, `.img-zoom` eases images in, buttons lift; all buttons press in on click.
- Header shrinks and gains a shadow on scroll; dropdowns fade/scale; status dots use `animate-soft-pulse`.
- All motion is disabled under `prefers-reduced-motion`; content is visible without JS.
