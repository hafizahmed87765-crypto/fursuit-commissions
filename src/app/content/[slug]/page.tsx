import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { site } from "@/content/site";
import PublicGallery from "@/components/cms/PublicGallery";

type CmsPage = {
  slug: string; title: string; description: string; seo_title: string; meta_description: string;
  canonical_url: string | null; social_image_id: string | null; status: string; is_indexable: boolean; page_sections: { id: string; section_type: string; heading: string; body: Record<string, unknown>; position: number }[];
};

async function getPage(slug: string): Promise<CmsPage | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("cms_pages").select("*, page_sections(*)").eq("slug", slug).eq("status", "published").maybeSingle();
  return data as CmsPage | null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "Page not found" };
  const socialImage = page.social_image_id ? await getPublicImage(page.social_image_id) : null;
  return {
    title: page.seo_title || page.title,
    description: page.meta_description || page.description,
    alternates: { canonical: page.canonical_url || `${site.url}/content/${page.slug}/` },
    openGraph: { title: page.seo_title || page.title, description: page.meta_description || page.description, url: page.canonical_url || `${site.url}/content/${page.slug}/`, images: socialImage ? [{ url: socialImage }] : undefined },
    robots: page.is_indexable ? undefined : { index: false, follow: false },
  };
}

async function getPublicImage(mediaId: string): Promise<string | null> {
  const db = await createSupabaseServerClient();
  const { data } = await db.from("media_assets").select("storage_path").eq("id", mediaId).eq("storage_bucket", "cms-public").maybeSingle();
  return data ? db.storage.from("cms-public").getPublicUrl(data.storage_path).data.publicUrl : null;
}

async function Section({ section }: { section: CmsPage["page_sections"][number] }) {
  const paragraphs = Array.isArray(section.body.paragraphs) ? section.body.paragraphs.filter((p): p is string => typeof p === "string") : [];
  const bodyText = typeof section.body.text === "string" ? section.body.text : "";
  const items = Array.isArray(section.body.items) ? section.body.items.filter((item): item is { title?: string; text?: string } => Boolean(item && typeof item === "object")) : [];
  const imageUrl = typeof section.body.image_url === "string" ? section.body.image_url : "";
  const alt = typeof section.body.alt === "string" ? section.body.alt : "";
  const ctaLabel = typeof section.body.button_label === "string" ? section.body.button_label : "";
  const ctaHref = typeof section.body.button_href === "string" && section.body.button_href.startsWith("/") ? section.body.button_href : "";
  const gallerySlug = typeof section.body.gallery_slug === "string" ? section.body.gallery_slug : "";
  return (
    <section className="container-x py-12 sm:py-16">
      {section.heading ? <SectionHeading title={section.heading} /> : null}
      {section.section_type === "image" && imageUrl ? <figure className="mt-6"><img src={imageUrl} alt={alt} loading="lazy" className="max-h-[42rem] w-full rounded-blob object-cover" /></figure> : null}
      {bodyText ? <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-ink">{bodyText}</p> : null}
      {paragraphs.map((paragraph, i) => <p key={i} className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-ink">{paragraph}</p>)}
      {items.length ? <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, i) => <li key={i} className="card p-5"><h3 className="text-xl font-semibold">{item.title || ""}</h3><p className="mt-2 text-ink-muted">{item.text || ""}</p></li>)}</ul> : null}
      {section.section_type === "gallery" && gallerySlug ? <PublicGallery slug={gallerySlug} /> : null}
      {ctaLabel && ctaHref ? <a href={ctaHref} className="btn-primary mt-6">{ctaLabel}</a> : null}
    </section>
  );
}

export default async function CmsPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  const sections = [...(page.page_sections ?? [])].sort((a, b) => a.position - b.position);
  return (
    <>
      <PageIntro crumbs={[{ name: page.title, path: `/content/${page.slug}/` }]} eyebrow="" title={page.title} lede={page.description} />
      {sections.map((section) => <Section key={section.id} section={section} />)}
    </>
  );
}
