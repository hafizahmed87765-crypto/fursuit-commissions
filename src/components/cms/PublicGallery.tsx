import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PublicGallery({ slug }: { slug: string }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const db = await createSupabaseServerClient();
  const { data: gallery } = await db.from("galleries").select("id,title,description").eq("slug", slug).eq("is_public", true).maybeSingle();
  if (!gallery) return null;
  const { data: items } = await db.from("gallery_items").select("position,alt_override,caption_override,media_assets(storage_bucket,storage_path,alt_text,caption)").eq("gallery_id", gallery.id).order("position");
  return <div className="mt-6"><h3 className="text-2xl font-semibold">{gallery.title}</h3>{gallery.description ? <p className="mt-2 text-ink-muted">{gallery.description}</p> : null}<ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{(items ?? []).map((item, index) => {
    const media = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets;
    if (!media || media.storage_bucket !== "cms-public") return null;
    const src = db.storage.from("cms-public").getPublicUrl(media.storage_path).data.publicUrl;
    return <li key={`${gallery.id}-${index}`}><img src={src} alt={item.alt_override || media.alt_text || ""} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />{item.caption_override || media.caption ? <p className="mt-1 text-sm text-ink-muted">{item.caption_override || media.caption}</p> : null}</li>;
  })}</ul></div>;
}
