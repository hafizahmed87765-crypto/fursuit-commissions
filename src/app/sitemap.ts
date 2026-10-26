import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { categories, products } from "@/lib/products";

const pages: [string, number][] = [
  ["/", 1],
  ["/fursuit-commission/", 0.9],
  ["/kemono-fursuits/", 0.9],
  ["/toony-fursuits/", 0.9],
  ["/fursuit-repairs/", 0.8],
  ["/get-a-quote/", 0.8],
  ["/gallery/", 0.8],
  ["/order-process/", 0.7],
  ["/shop/", 0.7],
  ["/about-us/", 0.5],
  ["/contact-us/", 0.5],
  ["/furry-ref-sheet-commissions/", 0.5],
  ["/fursuit-parts/", 0.8],
  ["/payment-plans/", 0.7],
  ["/terms-and-conditions/", 0.2],
  ["/privacy-policy/", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(([path, priority]) => ({ url: `${site.url}${path}`, priority })),
    ...categories.map((c) => ({ url: `${site.url}/product-category/${c.slug}/`, priority: 0.5 })),
    ...products.map((p) => ({ url: `${site.url}/product/${p.slug}/`, priority: 0.6 })),
  ];
}
