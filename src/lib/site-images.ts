import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export type SiteImage = { src: string; width: number; height: number; alt: string };
type SlotDef = SiteImage & { label: string; page: string; shape: string };

const g = (f: string) => `/media/gallery/${f}.webp`;
const p = (f: string) => `/media/products/${f}.webp`;

/**
 * Fixed photo slots on the website. IDs match docs/IMAGE-REPLACEMENT-SHEET.csv.
 * The values here are the built-in defaults; Admin > Site images can override any slot.
 */
export const siteImageSlots = {
  H1: { page: "Homepage", label: "Hero ref sheet – main photo (Kemono)", shape: "Portrait 4:5", src: "/media/work/toony-neon-wolf-fullsuit-1.webp", width: 1200, height: 1600, alt: "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye, waving a hand paw" },
  H2: { page: "Homepage", label: "Hero ref sheet – 'More sonas' thumbnail 1", shape: "Square", src: "/media/work/kemono-red-panda-fursuit-head-1.webp", width: 1067, height: 1600, alt: "Kemono-style red panda fursuit head with red and pink striped ears, ruby anime eyes and freckled white cheeks, front view" },
  H3: { page: "Homepage", label: "Hero ref sheet – 'More sonas' thumbnail 2", shape: "Square", src: "/media/work/kemono-blue-flame-horn-fullsuit-1.webp", width: 1255, height: 1600, alt: "Kemono-style blue and white fursuit with flame-shaped orange horns, amber anime eyes, a paw-print bandana and a long striped tail, seated with the tail curled round" },
  H4: { page: "Homepage", label: "Style badge – Kemono Fursuits", shape: "Square", src: "/media/work/kemono-lavender-wolf-fursuit-head-1.webp", width: 1067, height: 1600, alt: "Kemono-style white and lavender wolf fursuit head with purple stripes, big violet anime eyes and an orange chest mark, front view" },
  H5: { page: "Homepage", label: "Style badge – Toony Fursuits", shape: "Square", src: "/media/work/toony-teal-ear-husky-fursuit-head-1.webp", width: 1067, height: 1600, alt: "Toony-style black and white husky fursuit head with teal ears, lime cheek fluff, blue and yellow anime eyes and a studded bell collar, front view" },
  H6: { page: "Homepage", label: "Style badge – Custom Fursuits", shape: "Square", src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-1.webp", width: 900, height: 1600, alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, full-body front view" },
  H7: { page: "Homepage", label: "Repairs band – photo 1", shape: "Square", src: "/media/work/fursuit-head-base-patterning-1.webp", width: 1600, height: 1600, alt: "Fursuit head base, wrapped in film with seam lines drawn on, front view" },
  H8: { page: "Homepage", label: "Repairs band – photo 2", shape: "Square", src: "/media/work/fursuit-studio-2.webp", width: 1079, height: 1431, alt: "Our fursuit studio, with rolls of faux fur in every colour" },
  C1: { page: "Coverage cards", label: "Fullsuit", shape: "Square", src: "/media/work/toony-neon-wolf-fullsuit-2.webp", width: 718, height: 1032, alt: "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye, full-body pose" },
  C2: { page: "Coverage cards", label: "Partial", shape: "Square", src: "/media/work/kemono-grey-horned-dragon-partial-1.webp", width: 1255, height: 1600, alt: "Kemono-style grey and white horned dragon fursuit with coral ears, red-tipped horns, golden anime eyes and a paw-print bandana, front view with hand and feet paws" },
  C3: { page: "Coverage cards", label: "Fursuit head", shape: "Square", src: "/media/work/toony-navy-fox-glasses-fursuit-head-1.webp", width: 1067, height: 1600, alt: "Toony-style navy and white fox fursuit head with orange inner ears, olive cheek tufts, magenta eyes and black glasses, front view" },
  C4: { page: "Coverage cards", label: "Hand paws", shape: "Square", src: "/media/work/toony-snow-leopard-partial-1.webp", width: 1200, height: 1600, alt: "Toony-style grey snow leopard fursuit with black rosettes, pink eyes, glasses, a gold bell collar and white hand paws with red paw pads, showing the paw pads" },
  C5: { page: "Coverage cards", label: "Feet paws", shape: "Square", src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-8.webp", width: 1200, height: 1600, alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, feet paws with claws" },
  C6: { page: "Coverage cards", label: "Tail", shape: "Square", src: "/media/work/kemono-blue-flame-horn-fullsuit-4.webp", width: 1258, height: 1600, alt: "Kemono-style blue and white fursuit with flame-shaped orange horns, amber anime eyes, a paw-print bandana and a long striped tail, the striped tail laid flat" },
  C7: { page: "Coverage cards", label: "Character neon sign", shape: "Square", src: p("whatsapp-image-2025-12-14-at-12-39-50-pm-1a4bc4"), width: 960, height: 1280, alt: "Character neon sign" },
  S1: { page: "Kemono Fursuits", label: "Page banner + social preview", shape: "Landscape 4:3", src: "/media/work/kemono-grey-horned-dragon-partial-2.webp", width: 1257, height: 1600, alt: "Kemono-style grey and white horned dragon fursuit with coral ears, red-tipped horns, golden anime eyes and a paw-print bandana, three-quarter view" },
  S2: { page: "Toony Fursuits", label: "Page banner + social preview", shape: "Landscape 4:3", src: "/media/work/toony-red-streak-wolf-partial-1.webp", width: 1067, height: 1600, alt: "Toony-style charcoal and white wolf fursuit with a red hair streak, red eye markings, red inner ears and matching feet paws, front view" },
  S3: { page: "Custom Fursuits", label: "Page banner", shape: "Landscape 4:3", src: "/media/work/kemono-crowned-fox-fullsuit-1.webp", width: 1200, height: 1600, alt: "Kemono-style crimson and grey fox fursuit with a teal crown marking, blue anime eyes and red-striped paws, head, hand paws and feet paws in the workshop" },
  S4: { page: "Furry Mascot Costumes", label: "Page photo + social preview", shape: "Square", src: "/media/work/toony-neon-wolf-fullsuit-2.webp", width: 718, height: 1032, alt: "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye, full-body pose" },
  S5: { page: "Fursuit Repairs", label: "Banner photo 1", shape: "Portrait 3:4", src: "/media/work/fursuit-head-base-patterning-2.webp", width: 1600, height: 1600, alt: "Fursuit head base, wrapped in film with seam lines drawn on, three-quarter view" },
  S6: { page: "Fursuit Repairs", label: "Banner photo 2", shape: "Portrait 3:4", src: "/media/work/toony-red-streak-wolf-partial-4.webp", width: 1067, height: 1600, alt: "Toony-style charcoal and white wolf fursuit with a red hair streak, red eye markings, red inner ears and matching feet paws, with the matching feet paws" },
  S7: { page: "About Us", label: "Story photo 1", shape: "Portrait 3:4", src: "/media/work/fursuit-studio-1.webp", width: 1079, height: 1447, alt: "Our fursuit studio, with finished heads and 3D-printed head bases on the shelves" },
  S8: { page: "About Us", label: "Story photo 2", shape: "Portrait 3:4", src: "/media/work/fursuit-studio-4.webp", width: 1079, height: 1448, alt: "Our fursuit studio, with the 3D printers that make our head bases" },
  P1: { page: "Our Process", label: "Step 1 – Share your character", shape: "Landscape 3:2", src: "/media/work/fursuit-head-base-patterning-3.webp", width: 1600, height: 1600, alt: "Fursuit head base, 3D-modelled designs with an open-mouth jaw" },
  P2: { page: "Our Process", label: "Step 2 – Receive your quote", shape: "Landscape 3:2", src: "/media/work/fursuit-studio-2.webp", width: 1079, height: 1431, alt: "Our fursuit studio, with rolls of faux fur in every colour" },
  P3: { page: "Our Process + Payment Plans", label: "Step 3 – Confirm & pay deposit", shape: "Landscape 3:2", src: "/media/work/fursuit-studio-4.webp", width: 1079, height: 1448, alt: "Our fursuit studio, with the 3D printers that make our head bases" },
  P4: { page: "Our Process", label: "Step 4 – Measurements & approvals", shape: "Landscape 3:2", src: "/media/work/fursuit-duct-tape-dummy-1.webp", width: 1200, height: 1600, alt: "Duct-tape dummy for a custom fursuit bodysuit, with a feet paw base" },
  P5: { page: "Our Process", label: "Step 5 – Build with WIP updates", shape: "Landscape 3:2", src: "/media/work/fursuit-head-base-patterning-1.webp", width: 1600, height: 1600, alt: "Fursuit head base, wrapped in film with seam lines drawn on, front view" },
  P6: { page: "Our Process", label: "Step 6 – Final approval", shape: "Landscape 3:2", src: "/media/work/toony-neon-wolf-fullsuit-1.webp", width: 1200, height: 1600, alt: "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye, waving a hand paw" },
  P7: { page: "Reference Sheets", label: "Example illustration", shape: "Landscape 3:2", src: g("assets-task-01k07cz82zf7zb7scm5rpcy2xj-175259525-ca3c05"), width: 1536, height: 1024, alt: "" },
  P8: { page: "All pages", label: "Default social share preview (1200 × 630)", shape: "Landscape 1.91:1", src: "/media/work/fursuit-commissions-share.jpg", width: 1200, height: 630, alt: "Three custom fursuits from FursuitCommissions.com: a black husky head, a neon wolf fullsuit and a red panda head" },
} satisfies Record<string, SlotDef>;

export type SlotId = keyof typeof siteImageSlots;
export const isSlotId = (v: string): v is SlotId => v in siteImageSlots;
export const SITE_IMAGES_TAG = "cms-site-images";

/** Coverage card slot for each commission option key in site.ts. */
export const optionSlots: Record<string, SlotId> = { fullsuit: "C1", partial: "C2", head: "C3", "hand-paws": "C4", "feet-paws": "C5", tail: "C6", neon: "C7" };
/** Process step slots, in step order (the last step has no image). */
export const processSlots: (SlotId | null)[] = ["P1", "P2", "P3", "P4", "P5", "P6", null];

type Row = { slot: string; alt_text: string; media_assets: { storage_bucket: string; storage_path: string; width: number | null; height: number | null; alt_text: string } | null };

async function loadOverrides(): Promise<Partial<Record<SlotId, SiteImage>>> {
  const db = createSupabasePublicClient();
  if (!db) return {};
  const { data, error } = await db.from("site_images").select("slot,alt_text,media_assets(storage_bucket,storage_path,width,height,alt_text)").returns<Row[]>();
  if (error || !data) return {};
  const out: Partial<Record<SlotId, SiteImage>> = {};
  for (const r of data) {
    const m = r.media_assets;
    if (!isSlotId(r.slot) || !m || m.storage_bucket !== "cms-public") continue;
    out[r.slot] = {
      src: db.storage.from("cms-public").getPublicUrl(m.storage_path).data.publicUrl,
      width: m.width || 1600,
      height: m.height || 1600,
      alt: r.alt_text || m.alt_text || siteImageSlots[r.slot].alt,
    };
  }
  return out;
}

const cachedOverrides = unstable_cache(() => loadOverrides().catch((): Partial<Record<SlotId, SiteImage>> => ({})), ["site-images"], { tags: [SITE_IMAGES_TAG], revalidate: 3600 });

/** Every slot's current image: the admin's replacement if set, otherwise the built-in default. */
export async function getSiteImages(): Promise<Record<SlotId, SiteImage>> {
  const overrides = await cachedOverrides();
  const all = {} as Record<SlotId, SiteImage>;
  for (const id of Object.keys(siteImageSlots) as SlotId[]) {
    const d = siteImageSlots[id];
    all[id] = overrides[id] ?? { src: d.src, width: d.width, height: d.height, alt: d.alt };
  }
  return all;
}

/** Which slots currently have an admin replacement (for the admin screen). */
export async function getSiteImageOverrides() {
  return cachedOverrides();
}
