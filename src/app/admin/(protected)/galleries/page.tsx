import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCmsAdmin } from "@/lib/supabase/auth";
import { filterLabels } from "@/content/portfolio";
import { galleryTags, placements, type Placement } from "@/lib/gallery-placements";
import {
  addGalleryItem,
  createGallery,
  importSitePhotos,
  moveGalleryItem,
  removeGalleryItem,
  replaceGalleryPhoto,
  updateGallery,
  updateGalleryItem,
  uploadToGallery,
} from "@/app/admin/actions";

type Asset = { original_name: string; storage_path: string };
type Item = { gallery_id: string; media_id: string; position: number; alt_override: string; caption_override: string; tags?: string[] | null; media_assets: Asset | Asset[] | null };

function PlacementSelect({ value }: { value?: string | null }) {
  return (
    <select className="field mt-1" name="placement" defaultValue={value ?? ""}>
      <option value="">Not on the main website (own page only)</option>
      {(Object.keys(placements) as Placement[]).map((p) => (
        <option key={p} value={p}>
          {placements[p].label}
        </option>
      ))}
    </select>
  );
}

function TagBoxes({ selected = [] }: { selected?: string[] }) {
  return (
    <fieldset className="mt-1 flex flex-wrap gap-2">
      <legend className="sr-only">Tags</legend>
      {galleryTags.map((t) => (
        <label key={t} className="inline-flex items-center gap-1.5 rounded-full border-2 border-forest/15 bg-white px-3 py-1 text-sm font-semibold text-forest has-[:checked]:border-forest has-[:checked]:bg-mint-light">
          <input type="checkbox" name="tags" value={t} defaultChecked={selected.includes(t)} className="h-4 w-4 rounded border-forest/30 text-forest" />
          {filterLabels[t]}
        </label>
      ))}
    </fieldset>
  );
}

export default async function AdminGalleries({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase, admin] = await Promise.all([searchParams, createSupabaseServerClient(), getCmsAdmin()]);
  const isOwner = admin?.role === "owner";
  const [{ data: galleries, error: queryError }, { data: media }] = await Promise.all([
    supabase.from("galleries").select("*").order("updated_at", { ascending: false }),
    supabase.from("media_assets").select("id,original_name,storage_path").eq("storage_bucket", "cms-public").order("created_at", { ascending: false }).limit(200),
  ]);
  const placementsReady = !galleries?.length || "placement" in galleries[0];
  const galleriesWithItems = await Promise.all(
    (galleries ?? []).map(async (gallery) => {
      const { data: items } = await supabase.from("gallery_items").select("*,media_assets(original_name,storage_path)").eq("gallery_id", gallery.id).order("position");
      return { ...gallery, items: (items ?? []) as Item[] };
    }),
  );
  const imageUrl = (asset: Asset | null) => (asset ? supabase.storage.from("cms-public").getPublicUrl(asset.storage_path).data.publicUrl : "");

  return (
    <>
      <p className="eyebrow">Library</p>
      <h1 className="mt-2 text-4xl font-bold">Galleries</h1>
      <p className="mt-3 max-w-3xl text-ink-muted">
        Upload, replace and arrange photos, then choose <strong>where each gallery appears</strong> on the website. A spot keeps showing the built-in photos until a <em>public</em> gallery with at least one photo is assigned to it.
      </p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load galleries. Apply the CMS migration.</p> : null}
      {!placementsReady ? (
        <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">
          To choose where galleries appear, run <code>supabase/migrations/202610270001_gallery_placements.sql</code> in the Supabase SQL Editor.
        </p>
      ) : null}

      <form action={createGallery} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <h2 className="text-2xl font-semibold md:col-span-2">Create a gallery</h2>
        <label className="field-label">Title<input className="field mt-1" name="title" required placeholder="e.g. Website gallery" /></label>
        <label className="field-label">Slug<input className="field mt-1" name="slug" placeholder="website-gallery" /></label>
        <label className="field-label md:col-span-2">Where should it appear?<PlacementSelect /></label>
        <label className="field-label md:col-span-2">Description<textarea className="field mt-1" name="description" rows={2} /></label>
        <label className="choice flex items-center gap-2 md:col-span-2"><input type="checkbox" name="is_public" defaultChecked />Show this gallery publicly</label>
        <button className="btn-primary justify-self-start">Create gallery</button>
      </form>

      <div className="mt-8 space-y-8">
        {galleriesWithItems.map((gallery) => {
          const where = gallery.placement ? placements[gallery.placement as Placement] : null;
          return (
            <article key={gallery.id} className="card p-6">
              <header className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">{gallery.title}</h2>
                <span className={`chip ${gallery.is_public ? "" : "bg-blush"}`}>{gallery.is_public ? "Public" : "Hidden"}</span>
                {where ? (
                  <a className="chip bg-lavender-soft" href={where.path} target="_blank" rel="noopener">Shown on: {where.label} ↗</a>
                ) : (
                  <span className="text-sm text-ink-muted">Only at /galleries/{gallery.slug}/</span>
                )}
              </header>

              <details className="mt-4 rounded-2xl bg-mint-wash p-4">
                <summary className="cursor-pointer font-display font-semibold text-forest">Gallery settings</summary>
                <form action={updateGallery} className="mt-3 grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={gallery.id} />
                  <label className="field-label">Title<input className="field mt-1" name="title" defaultValue={gallery.title} /></label>
                  <label className="field-label">Where should it appear?<PlacementSelect value={gallery.placement} /></label>
                  <label className="field-label md:col-span-2">Description<input className="field mt-1" name="description" defaultValue={gallery.description} /></label>
                  <label className="choice flex items-center gap-2"><input type="checkbox" name="is_public" defaultChecked={gallery.is_public} />Public</label>
                  <button className="btn-secondary justify-self-start">Save settings</button>
                </form>
              </details>

              <form action={uploadToGallery} className="mt-4 grid gap-3 rounded-2xl border-2 border-dashed border-forest/20 p-4">
                <input type="hidden" name="gallery_id" value={gallery.id} />
                <p className="font-display text-lg font-semibold text-forest">Add photos</p>
                <label className="field-label">Photos (JPEG, PNG or WebP, up to 10 MB each, 12 at a time)
                  <input className="field mt-1" type="file" name="files" accept="image/jpeg,image/png,image/webp" multiple required />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="field-label">Title shown under the photos (optional)<input className="field mt-1" name="caption" placeholder="e.g. Snow leopard partial" /></label>
                  <label className="field-label">Alt text for screen readers (optional)<input className="field mt-1" name="alt" placeholder="Describe what the photo shows" /></label>
                </div>
                <div><p className="field-label">Tags (used by the gallery page filters)</p><TagBoxes /></div>
                <button className="btn-primary justify-self-start">Upload photos</button>
              </form>

              <form action={importSitePhotos} className="mt-3 flex flex-wrap items-end gap-3 text-sm">
                <input type="hidden" name="gallery_id" value={gallery.id} />
                <label className="field-label">Start from the photos already on the website
                  <select className="field mt-1" name="only" defaultValue="">
                    <option value="">All current website photos</option>
                    {galleryTags.map((t) => <option key={t} value={t}>Only {filterLabels[t]}</option>)}
                  </select>
                </label>
                <button className="btn-soft btn-sm">Import</button>
              </form>

              <h3 className="mt-6 text-xl font-semibold">Photos ({gallery.items.length})</h3>
              {gallery.items.length === 0 ? <p className="mt-2 text-ink-muted">No photos yet. Upload some above or import the website&apos;s current photos.</p> : null}
              <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {gallery.items.map((item: Item, i: number) => {
                  const asset = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets;
                  const hidden = (name: string, value: string) => <input type="hidden" name={name} value={value} />;
                  return (
                    <li key={item.media_id} className="flex flex-col overflow-hidden rounded-2xl border-2 border-forest/10 bg-white">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail from Supabase Storage */}
                        <img src={imageUrl(asset)} alt={item.alt_override} className="aspect-[4/3] w-full bg-forest/5 object-cover" />
                        <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-forest shadow">#{i + 1}</span>
                        <div className="absolute right-2 top-2 flex gap-1">
                          {(["up", "down"] as const).map((dir) => (
                            <form key={dir} action={moveGalleryItem}>
                              {hidden("gallery_id", gallery.id)}{hidden("media_id", item.media_id)}{hidden("direction", dir)}
                              <button
                                className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold text-forest shadow disabled:opacity-40"
                                disabled={dir === "up" ? i === 0 : i === gallery.items.length - 1}
                                aria-label={`Move photo ${i + 1} ${dir === "up" ? "earlier" : "later"}`}
                              >
                                {dir === "up" ? "←" : "→"}
                              </button>
                            </form>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 p-3">
                        <p className="truncate font-display font-semibold text-forest">{item.caption_override || asset?.original_name}</p>
                        <details>
                          <summary className="cursor-pointer text-sm font-semibold text-mint-deep">Edit title, alt text &amp; tags</summary>
                          <form action={updateGalleryItem} className="mt-2 grid gap-2">
                            {hidden("gallery_id", gallery.id)}{hidden("media_id", item.media_id)}{hidden("position", String(item.position))}
                            <label className="field-label">Title<input className="field mt-1" name="caption" defaultValue={item.caption_override} /></label>
                            <label className="field-label">Alt text<input className="field mt-1" name="alt" defaultValue={item.alt_override} /></label>
                            <TagBoxes selected={item.tags ?? []} />
                            <button className="btn-secondary btn-sm justify-self-start">Save</button>
                          </form>
                        </details>
                        <form action={replaceGalleryPhoto} className="flex flex-wrap items-center gap-2 text-sm">
                          {hidden("gallery_id", gallery.id)}{hidden("media_id", item.media_id)}
                          <label className="sr-only" htmlFor={`replace-${item.media_id}`}>Replacement photo</label>
                          <input id={`replace-${item.media_id}`} type="file" name="file" accept="image/jpeg,image/png,image/webp" required className="min-w-0 flex-1 text-xs" />
                          <button className="btn-soft btn-sm">Replace</button>
                        </form>
                        {isOwner ? (
                          <form action={removeGalleryItem}>
                            {hidden("gallery_id", gallery.id)}{hidden("media_id", item.media_id)}
                            <button className="text-sm text-red-700 underline">Remove from gallery</button>
                          </form>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form action={addGalleryItem} className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <input type="hidden" name="gallery_id" value={gallery.id} />
                <label className="field-label">Or add a photo from the media library
                  <select className="field mt-1" name="media_id" required>
                    <option value="">Select image</option>
                    {(media ?? []).map((m) => <option key={m.id} value={m.id}>{m.original_name}</option>)}
                  </select>
                </label>
                <label className="field-label">Alt text override<input className="field mt-1" name="alt" /></label>
                <button className="btn-secondary self-end">Add photo</button>
              </form>
            </article>
          );
        })}
      </div>
    </>
  );
}
