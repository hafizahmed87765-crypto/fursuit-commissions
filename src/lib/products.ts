import raw from "@/data/products.json";
import cats from "@/data/categories.json";

export type ProductImage = { src: string; width: number; height: number; alt: string };
export type Product = {
  id: number;
  slug: string;
  name: string;
  type: string;
  price: number;
  regularPrice: number;
  currency: string;
  inStock: boolean;
  purchasable: boolean;
  quoteOnly: boolean;
  categories: { slug: string; name: string }[];
  shortDescription: string;
  description: string;
  attributes: { name: string; options: string[] }[];
  variations: { id: number; attributes: Record<string, string> }[];
  images: ProductImage[];
};

export const products = raw as Product[];
export const categories = cats as { slug: string; name: string; count: number }[];
/** Categories offered as shop filters. Cosplay-branded categories are kept as
 *  WooCommerce data (their products and URLs still work) but not promoted. */
export const shopCategories = categories.filter((c) => !c.slug.includes("cosplay"));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** A price of 0 in WooCommerce means "not set", so it is never shown as $0. */
export const hasPrice = (p: Product) => p.price > 0;

/** Standard shop products: priced, purchasable and not quote-only. */
export const isShopProduct = (p: Product) => hasPrice(p) && p.purchasable && !p.quoteOnly;

export const shopProducts = products.filter((p) => !p.quoteOnly);
export const madeToOrder = products.filter((p) => p.quoteOnly);

export function formatPrice(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

export function categoryName(slug: string) {
  const name = categories.find((c) => c.slug === slug)?.name ?? slug.replace(/-/g, " ");
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bAnd\b/g, "&");
}

// Matching parts for a product, used for "complete the look" links rather
// than random suggestions.
const RELATED: Record<string, string[]> = {
  "heads-and-partials": ["hand-and-feet-paws", "ear-and-tails", "partials"],
  masks: ["hand-and-feet-paws", "partials"],
  partials: ["heads-and-partials", "ear-and-tails"],
  "hand-and-feet-paws": ["heads-and-partials", "partials", "ear-and-tails"],
  "ear-and-tails": ["hand-and-feet-paws", "heads-and-partials"],
};

export function relatedProducts(p: Product, limit = 4) {
  const own = p.categories.map((c) => c.slug);
  const wanted = own.flatMap((c) => RELATED[c] ?? []).concat(own);
  const scored = shopProducts
    .filter((x) => x.id !== p.id && hasPrice(x))
    .map((x) => {
      const idx = Math.min(...x.categories.map((c) => wanted.indexOf(c.slug)).filter((i) => i >= 0), 99);
      return { x, idx };
    })
    .filter((s) => s.idx < 99)
    .sort((a, b) => a.idx - b.idx);
  return scored.slice(0, limit).map((s) => s.x);
}

// ── WooCommerce hand-off ────────────────────────────────────────────────
// Cart, checkout and PayPal stay in WordPress. Buttons only render when
// NEXT_PUBLIC_WOO_ORIGIN is configured.
export const wooOrigin = (process.env.NEXT_PUBLIC_WOO_ORIGIN || "").replace(/\/$/, "");

const wcAttrKey = (name: string) => "attribute_" + name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function addToCartUrl(p: Product, opts: { quantity?: number; variationId?: number } = {}) {
  if (!wooOrigin) return null;
  const q = new URLSearchParams({ "add-to-cart": String(p.id), quantity: String(opts.quantity ?? 1) });
  if (opts.variationId) {
    const v = p.variations.find((x) => x.id === opts.variationId);
    if (!v) return null;
    q.set("variation_id", String(v.id));
    for (const [k, val] of Object.entries(v.attributes)) q.set(wcAttrKey(k), val);
  }
  return `${wooOrigin}/cart/?${q}`;
}
