import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addGalleryItem, createGallery, removeGalleryItem, updateGallery, updateGalleryItem } from "@/app/admin/actions";

export default async function AdminGalleries({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const [{ data: galleries, error: queryError }, { data: media }] = await Promise.all([
    supabase.from("galleries").select("*").order("updated_at", { ascending: false }),
    supabase.from("media_assets").select("id,original_name,storage_path").eq("storage_bucket", "cms-public").order("created_at", { ascending: false }).limit(200),
  ]);
  const galleriesWithItems = await Promise.all((galleries ?? []).map(async (gallery) => {
    const { data: items } = await supabase.from("gallery_items").select("gallery_id,media_id,position,alt_override,caption_override,media_assets(original_name,storage_path)").eq("gallery_id", gallery.id).order("position");
    return { ...gallery, items: items ?? [] };
  }));
  return (
    <>
      <p className="eyebrow">Library</p><h1 className="mt-2 text-4xl font-bold">Galleries</h1>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load galleries. Apply the CMS migration.</p> : null}
      <form action={createGallery} className="card mt-6 grid gap-4 p-6 md:grid-cols-2"><h2 className="text-2xl font-semibold md:col-span-2">Create a gallery</h2><label className="field-label">Title<input className="field mt-1" name="title" required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" /></label><label className="field-label md:col-span-2">Description<textarea className="field mt-1" name="description" rows={2} /></label><label className="choice flex items-center gap-2 md:col-span-2"><input type="checkbox" name="is_public" />Show this gallery publicly</label><button className="btn-primary justify-self-start">Create gallery</button></form>
      <div className="mt-8 space-y-5">{galleriesWithItems.map((gallery) => <article key={gallery.id} className="card p-6">
        <form action={updateGallery} className="grid gap-3 md:grid-cols-2"><input type="hidden" name="id" value={gallery.id} /><label className="field-label">Title<input className="field mt-1" name="title" defaultValue={gallery.title} /></label><label className="field-label">Description<input className="field mt-1" name="description" defaultValue={gallery.description} /></label><label className="choice flex items-center gap-2"><input type="checkbox" name="is_public" defaultChecked={gallery.is_public} />Public</label><button className="btn-secondary justify-self-start">Save gallery</button></form>
        <h3 className="mt-5 text-xl font-semibold">Images ({gallery.items.length})</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">{gallery.items.map((item) => {
          const asset = Array.isArray(item.media_assets) ? item.media_assets[0] : item.media_assets;
          const image = asset ? supabase.storage.from("cms-public").getPublicUrl(asset.storage_path).data.publicUrl : "";
          return <li key={item.media_id} className="flex gap-3 rounded-xl bg-mint-wash p-3">{image ? <img src={image} alt={item.alt_override} className="h-20 w-24 rounded-lg object-cover" /> : null}<div className="min-w-0 flex-1"><p className="truncate font-semibold">{asset?.original_name}</p><form action={updateGalleryItem} className="mt-2 flex flex-wrap gap-2"><input type="hidden" name="gallery_id" value={gallery.id} /><input type="hidden" name="media_id" value={item.media_id} /><input className="field w-20" name="position" type="number" min="0" defaultValue={item.position} aria-label="Image order" /><input className="field min-w-0 flex-1" name="alt" defaultValue={item.alt_override} aria-label="Alt text" /><button className="link text-sm">Save</button></form><form action={removeGalleryItem} className="mt-1"><input type="hidden" name="gallery_id" value={gallery.id} /><input type="hidden" name="media_id" value={item.media_id} /><button className="text-sm text-red-700 underline">Remove image</button></form></div></li>;
        })}</ul>
        <form action={addGalleryItem} className="mt-4 grid gap-3 md:grid-cols-[1fr_120px_1fr_auto]"><input type="hidden" name="gallery_id" value={gallery.id} /><label className="field-label">Choose library image<select className="field mt-1" name="media_id" required><option value="">Select image</option>{(media ?? []).map((item) => <option key={item.id} value={item.id}>{item.original_name}</option>)}</select></label><label className="field-label">Order<input className="field mt-1" name="position" type="number" min="0" defaultValue={gallery.items.length} /></label><label className="field-label">Alt text override<input className="field mt-1" name="alt" /></label><button className="btn-primary self-end">Add image</button></form>
      </article>)}</div>
    </>
  );
}
