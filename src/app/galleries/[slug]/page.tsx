import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicGallery from "@/components/cms/PublicGallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return { title: "Gallery not found" };
  const db = await createSupabaseServerClient();
  const { data } = await db.from("galleries").select("title,description").eq("slug", slug).eq("is_public", true).maybeSingle();
  return data ? { title: data.title, description: data.description } : { title: "Gallery not found" };
}

export default async function CmsGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) notFound();
  const db = await createSupabaseServerClient();
  const { data: gallery } = await db.from("galleries").select("title,description").eq("slug", slug).eq("is_public", true).maybeSingle();
  if (!gallery) notFound();
  return <main className="container-x py-12 sm:py-16"><p className="eyebrow">Gallery</p><h1 className="mt-2 text-4xl font-bold">{gallery.title}</h1>{gallery.description ? <p className="lede mt-3">{gallery.description}</p> : null}<PublicGallery slug={slug} /></main>;
}
