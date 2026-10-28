import "server-only";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { unstable_cache } from "next/cache";
import { filterLabels, type PortfolioItem, type PortfolioTag } from "@/content/portfolio";

/** Spots on the website that an admin gallery can be assigned to. */
export const placements = {
  home: { label: "Homepage: “Fresh from the workshop”", path: "/" },
  gallery: { label: "Gallery page (/gallery/)", path: "/gallery/" },
  kemono: { label: "Kemono Suits page: Recent work", path: "/kemono-fursuits/" },
  toony: { label: "Toony Suits page: Recent work", path: "/toony-fursuits/" },
  custom: { label: "Custom Fursuits page: Recent work", path: "/fursuit-commission/" },
  parts: { label: "Fursuit Parts page: Recent parts", path: "/fursuit-parts/" },
} as const;

export type Placement = keyof typeof placements;
export const isPlacement = (v: string): v is Placement => v in placements;

/** Tags an admin can put on a photo; they drive the gallery page filters. */
export const galleryTags = Object.keys(filterLabels) as PortfolioTag[];

export const GALLERY_CACHE_TAG = "cms-galleries";

type Row = {
  position: number;
  alt_override: string;
  caption_override: string;
  tags: string[] | null;
  media_assets: { id: string; storage_bucket: string; storage_path: string; alt_text: string; caption: string; width: number | null; height: number | null } | null;
};

async function load(placement: Placement): Promise<PortfolioItem[] | null> {
  const db = createSupabasePublicClient();
  if (!db) return null;
  const { data: gallery, error } = await db.from("galleries").select("id").eq("placement", placement).eq("is_public", true).maybeSingle();
  if (error || !gallery) return null;
  const { data: rows } = await db
    .from("gallery_items")
    .select("position,alt_override,caption_override,tags,media_assets(id,storage_bucket,storage_path,alt_text,caption,width,height)")
    .eq("gallery_id", gallery.id)
    .order("position")
    .returns<Row[]>();
  const items = (rows ?? []).flatMap((r): PortfolioItem[] => {
    const m = r.media_assets;
    if (!m || m.storage_bucket !== "cms-public") return [];
    const alt = r.alt_override || m.alt_text || r.caption_override || m.caption || "Fursuit photo";
    return [{
      id: m.id,
      title: r.caption_override || m.caption || alt,
      src: db.storage.from("cms-public").getPublicUrl(m.storage_path).data.publicUrl,
      width: m.width || 1200,
      height: m.height || 1200,
      alt,
      tags: (r.tags ?? []).filter((t): t is PortfolioTag => (galleryTags as string[]).includes(t)),
    }];
  });
  return items.length ? items : null;
}

/**
 * Photos for a spot on the site, from the public admin gallery assigned to it.
 * Returns null when nothing is assigned (or Supabase is unreachable), so the
 * caller falls back to the built-in portfolio. Cleared by gallery admin actions.
 */
export const getPlacementItems = (placement: Placement) =>
  unstable_cache(() => load(placement).catch(() => null), ["gallery-placement", placement], { tags: [GALLERY_CACHE_TAG], revalidate: 3600 })();
