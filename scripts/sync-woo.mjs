#!/usr/bin/env node
// Snapshot the public WooCommerce catalogue + portfolio images into the repo.
//
// Reads only public endpoints (Store API + page HTML), so no credentials are
// needed. Images are downloaded once, resized to max 1600px and re-encoded to
// WebP so the Next.js site no longer depends on the WordPress uploads folder.
//
//   npm run sync            fetch + write src/data/*.json + public/media/**
//   npm run sync:dry        fetch + report only
//
// Env: WOO_ORIGIN (default https://fursuitcommissions.com)

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const ORIGIN = (process.env.WOO_ORIGIN || "https://fursuitcommissions.com").replace(/\/$/, "");
const DRY = process.argv.includes("--dry-run");
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const MEDIA = path.join(ROOT, "public", "media");
const DATA = path.join(ROOT, "src", "data");

// Pages whose images make up the portfolio. Their text is NOT imported: the
// live WordPress pages were found injected with casino spam (June 2026).
const GALLERY_PAGES = { 6656: "wip", 1308: "home", 3479: "cosplay", 3495: "cosplay", 3497: "plush" };

// Anything that looks like the injected spam is dropped from imported HTML.
const SPAM = /casino|baccarat|blackjack|roulette|machines à sous|joueur|free spins|no deposit/i;

const decode = (s = "") =>
  s
    .replace(/&#8217;|&#039;|&#39;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;|&rdquo;/g, '"');

function cleanHtml(html = "") {
  return html
    .replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, "")
    .replace(/<p>([\s\S]*?)<\/p>/gi, (m, inner) => (SPAM.test(inner) ? "" : m))
    .replace(/\s(class|style|id|data-[\w-]+)="[^"]*"/gi, "")
    .replace(/<a [^>]*href="(?!https?:\/\/(www\.)?fursuitcommissions\.com)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$2")
    .trim();
}

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "fursuit-commissions-sync" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchAll(endpoint) {
  const out = [];
  for (let page = 1; ; page++) {
    const batch = await getJson(`${ORIGIN}${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=100&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) return out;
  }
}

const seen = new Map();
async function localImage(src, folder) {
  const full = src.replace(/-\d+x\d+(\.\w+)$/, "$1");
  if (seen.has(full)) return seen.get(full);
  const base = path.basename(full).replace(/\.\w+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
  const name = `${base}-${crypto.createHash("sha1").update(full).digest("hex").slice(0, 6)}.webp`;
  const rel = `/media/${folder}/${name}`;
  const abs = path.join(MEDIA, folder, name);
  let meta = { src: rel, width: 0, height: 0 };
  if (!DRY) {
    try {
      const existing = await sharp(abs).metadata();
      meta = { src: rel, width: existing.width, height: existing.height };
    } catch {
      const res = await fetch(full);
      if (!res.ok) {
        console.warn(`  ! skip image ${res.status} ${full}`);
        seen.set(full, null);
        return null;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.mkdir(path.dirname(abs), { recursive: true });
      const info = await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(abs);
      meta = { src: rel, width: info.width, height: info.height };
    }
  }
  seen.set(full, meta);
  return meta;
}

async function syncProducts() {
  const raw = await fetchAll("/wp-json/wc/store/v1/products");
  const products = [];
  for (const p of raw) {
    const images = [];
    for (const img of p.images) {
      const local = await localImage(img.src, "products");
      if (local) images.push({ ...local, alt: decode(img.alt) });
    }
    const shortText = decode(p.short_description.replace(/<[^>]+>/g, " "));
    products.push({
      id: p.id,
      slug: p.slug,
      name: decode(p.name),
      type: p.type,
      price: Number(p.prices.price) / 10 ** p.prices.currency_minor_unit,
      regularPrice: Number(p.prices.regular_price) / 10 ** p.prices.currency_minor_unit,
      currency: p.prices.currency_code,
      inStock: p.is_in_stock,
      purchasable: p.is_purchasable,
      // WooCommerce marks these "available by quote only" in their short description.
      quoteOnly: /quote only|made to order|custom made/i.test(p.name + " " + shortText),
      categories: p.categories.map((c) => ({ slug: c.slug, name: decode(c.name) })),
      shortDescription: cleanHtml(p.short_description),
      description: cleanHtml(p.description),
      attributes: p.attributes
        .filter((a) => a.has_variations)
        .map((a) => ({ name: decode(a.name), options: a.terms.map((t) => decode(t.name)) })),
      variations: p.variations.map((v) => ({ id: v.id, attributes: Object.fromEntries(v.attributes.map((a) => [decode(a.name), decode(a.value)])) })),
      images,
    });
  }
  return products;
}

async function syncCategories() {
  const raw = await getJson(`${ORIGIN}/wp-json/wc/store/v1/products/categories?per_page=100`);
  return raw.filter((c) => c.count > 0 && c.slug !== "uncategorized").map((c) => ({ slug: c.slug, name: decode(c.name), count: c.count }));
}

async function syncGallery() {
  const items = [];
  for (const [id, source] of Object.entries(GALLERY_PAGES)) {
    const page = await getJson(`${ORIGIN}/wp-json/wp/v2/pages/${id}?_fields=content`);
    const urls = new Set(
      (page.content.rendered.match(/https:\/\/fursuitcommissions\.com\/wp-content\/uploads\/[^"' )]+?\.(jpe?g|png|webp)/gi) || []).map((u) =>
        u.replace(/-\d+x\d+(\.\w+)$/, "$1"),
      ),
    );
    for (const u of urls) {
      const local = await localImage(u, "gallery");
      if (local) items.push({ ...local, source, origin: u });
    }
  }
  return items;
}

const products = await syncProducts();
const categories = await syncCategories();
const gallery = await syncGallery();
console.log(`products: ${products.length}  categories: ${categories.length}  gallery images: ${gallery.length}  unique images: ${seen.size}`);

if (!DRY) {
  await fs.mkdir(DATA, { recursive: true });
  await fs.writeFile(path.join(DATA, "products.json"), JSON.stringify(products, null, 2) + "\n");
  await fs.writeFile(path.join(DATA, "categories.json"), JSON.stringify(categories, null, 2) + "\n");
  // gallery.raw.json is regenerated every sync; curated labels live in src/content/portfolio.ts.
  await fs.writeFile(path.join(DATA, "gallery.raw.json"), JSON.stringify(gallery, null, 2) + "\n");
  console.log("wrote src/data/{products,categories,gallery.raw}.json");
}
