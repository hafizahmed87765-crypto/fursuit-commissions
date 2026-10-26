import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const pages: [string, number][] = [
  ["/", 1],
  ["/fursuit-commission/", 0.9],
  ["/kemono-fursuits/", 0.9],
  ["/toony-fursuits/", 0.9],
  ["/fursuit-repairs/", 0.8],
  ["/get-a-quote/", 0.8],
  ["/gallery/", 0.8],
  ["/order-process/", 0.7],
  ["/about-us/", 0.5],
  ["/contact-us/", 0.5],
  ["/furry-ref-sheet-commissions/", 0.5],
  ["/fursuit-parts/", 0.8],
  ["/payment-plans/", 0.7],
  ["/terms-and-conditions/", 0.2],
  ["/privacy-policy/", 0.2],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    ...pages.map(([path, priority]) => ({ url: `${site.url}${path}`, priority })),
  ];
  return loadCmsRoutes(staticPages);
}

async function loadCmsRoutes(staticPages: MetadataRoute.Sitemap): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return staticPages;
  try {
    const db = await createSupabaseServerClient();
    const [{ data: cmsPages }, { data: posts }, { data: galleries }] = await Promise.all([
      db.from("cms_pages").select("slug,canonical_url,updated_at").eq("status", "published").eq("is_indexable", true),
      db.from("blog_posts").select("slug,canonical_url,updated_at,published_at").eq("status", "published").eq("is_indexable", true).lte("published_at", new Date().toISOString()),
      db.from("galleries").select("slug,updated_at").eq("is_public", true),
    ]);
    return [
      ...staticPages,
      ...(cmsPages ?? []).map((page) => ({ url: page.canonical_url || `${site.url}/content/${page.slug}/`, lastModified: page.updated_at, priority: 0.6 })),
      { url: `${site.url}/journal/`, priority: 0.5 },
      ...(posts ?? []).map((post) => ({ url: post.canonical_url || `${site.url}/journal/${post.slug}/`, lastModified: post.updated_at || post.published_at, priority: 0.5 })),
      ...(galleries ?? []).map((gallery) => ({ url: `${site.url}/galleries/${gallery.slug}/`, lastModified: gallery.updated_at, priority: 0.4 })),
    ];
  } catch {
    return staticPages;
  }
}
