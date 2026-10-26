# Design system

## Brand colours (preserved from the live WordPress theme)

| Token | Hex | Source |
|-------|-----|--------|
| `forest` | `#21463F` | Elementor global primary — text, primary buttons |
| `mint` | `#A5D4C4` | Astra global 0/5 — logo body, CTA panels |
| `mint-light` | `#D1FADF` | Astra global 1 |
| `mint-footer` | `#D3E9E1` | Footer background |
| `mint-wash` | `#F1F8F5` | Astra global 7 (5% mint) |
| `lavender` / `lavender-soft` | `#E4D0FF` / `#F2E7FF` | Astra 2 / 8 |
| `blush` | `#FFCCC9` | Astra 6 |
| `snow` / `petal` | `#F8FDFF` / `#FFF7FC` | Astra 3 / 4 |

Added for accessibility only: `ink-muted #46625C` (6.6:1 on white; replaces the
old `#7A7A7A` body grey) and `mint-deep #3F7F6E` (4.7:1, focus rings and eyebrows).
Muted text is only used on white/wash/soft surfaces; on `mint` use `forest`.

## Type
- Display: **Fredoka** (rounded, echoes the logo wordmark). Body: **Nunito Sans**.
- Replaces Roboto/Roboto Slab from the Elementor kit.

## Components (`src/app/globals.css`)
`.btn-primary`, `.btn-secondary`, `.btn-soft`, `.btn-sm`, `.card`, `.chip`, `.link`,
`.field`, `.field-label`, `.field-error`, `.choice` (radio/checkbox tiles), `.eyebrow`,
`.h-section`, `.lede`, `.bg-paws` texture. Corner radius `rounded-blob` (2rem) for cards/images.

## Motion
- Scroll reveal: `data-reveal` (+ optional `--reveal-delay`) — fade + 16px rise, once.
- `animate-rise` / `animate-reveal` for hero and step transitions.
- FAQ `<details>` animates height where `interpolate-size` is supported.
- All motion disabled under `prefers-reduced-motion`; content is visible without JS.
