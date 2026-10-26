import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { site } from "@/content/site";
import type { ReactNode } from "react";

type Block = { type: string; text?: string; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; content?: Block[]; level?: number };
async function getPost(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("blog_posts").select("slug,title,excerpt,body,seo_title,meta_description,canonical_url,is_indexable,published_at,featured_image_id").eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
  if (!data) return null;
  const { data: image } = data.featured_image_id ? await supabase.from("media_assets").select("storage_path,alt_text").eq("id", data.featured_image_id).eq("storage_bucket", "cms-public").maybeSingle() : { data: null };
  const imageUrl = image ? supabase.storage.from("cms-public").getPublicUrl(image.storage_path).data.publicUrl : null;
  return { ...data, featured_image: imageUrl ? { url: imageUrl, alt: image?.alt_text ?? "" } : null };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.seo_title || post.title, description: post.meta_description || post.excerpt, alternates: { canonical: post.canonical_url || `${site.url}/journal/${post.slug}/` }, robots: post.is_indexable ? undefined : { index: false, follow: false }, openGraph: { title: post.seo_title || post.title, description: post.meta_description || post.excerpt, images: post.featured_image?.url ? [post.featured_image.url] : undefined } };
}

function renderText(block: Block): ReactNode {
  let node: ReactNode = block.text || "";
  for (const mark of block.marks ?? []) {
    if (mark.type === "bold") node = <strong>{node}</strong>;
    else if (mark.type === "italic") node = <em>{node}</em>;
    else if (mark.type === "strike") node = <s>{node}</s>;
    else if (mark.type === "code") node = <code>{node}</code>;
    else if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      if (href.startsWith("/") || href.startsWith("https://")) node = <a className="link" href={href}>{node}</a>;
    }
  }
  return node;
}

function renderBlock(block: Block, key: string): ReactNode {
  const children = (block.content ?? []).map((child, i) => renderBlock(child, `${key}-${i}`));
  if (block.type === "text") return <span key={key}>{renderText(block)}</span>;
  if (block.type === "doc") return <div key={key}>{children}</div>;
  if (block.type === "paragraph") return <p key={key} className="mt-5 whitespace-pre-line leading-relaxed text-ink">{children}</p>;
  if (block.type === "heading") return block.attrs?.level === 3 ? <h3 key={key} className="mt-8 text-2xl font-semibold">{children}</h3> : <h2 key={key} className="mt-10 text-3xl font-semibold">{children}</h2>;
  if (block.type === "bulletList") return <ul key={key} className="mt-5 list-disc space-y-2 pl-6">{children}</ul>;
  if (block.type === "orderedList") return <ol key={key} className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>;
  if (block.type === "listItem") return <li key={key}>{children}</li>;
  if (block.type === "blockquote") return <blockquote key={key} className="mt-5 border-l-4 border-mint pl-5 italic text-ink-muted">{children}</blockquote>;
  if (block.type === "hardBreak") return <br key={key} />;
  if (block.type === "horizontalRule") return <hr key={key} className="my-8 border-forest/15" />;
  if (block.type === "image") {
    const src = typeof block.attrs?.src === "string" ? block.attrs.src : "";
    if (!src.startsWith("/") && !src.startsWith("https://")) return null;
    return <img key={key} src={src} alt={typeof block.attrs?.alt === "string" ? block.attrs.alt : ""} loading="lazy" className="my-8 rounded-2xl" />;
  }
  return <span key={key}>{children}</span>;
}

export default async function JournalPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const body = post.body && typeof post.body === "object" && !Array.isArray(post.body) ? post.body as Block : { type: "doc", content: [] };
  return <article className="container-x max-w-3xl py-12 sm:py-16"><Link href="/journal/" className="link">← All articles</Link><p className="eyebrow mt-8">{post.published_at ? new Date(post.published_at).toLocaleDateString("en", { dateStyle: "long" }) : ""}</p><h1 className="mt-2 text-4xl font-bold sm:text-5xl">{post.title}</h1>{post.excerpt ? <p className="lede mt-5">{post.excerpt}</p> : null}{post.featured_image ? <img src={post.featured_image.url} alt={post.featured_image.alt} className="mt-8 max-h-[34rem] w-full rounded-blob object-cover" /> : null}<div className="prose-content mt-8">{renderBlock(body, "body")}</div></article>;
}
