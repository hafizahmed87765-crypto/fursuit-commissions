import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateMediaMetadata, uploadPublicMedia } from "@/app/admin/actions";

export default async function AdminMedia({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const { data: assets, error: queryError } = await supabase.from("media_assets").select("id,storage_path,original_name,size_bytes,width,height,alt_text,caption,created_at").eq("storage_bucket", "cms-public").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <p className="eyebrow">Library</p><h1 className="mt-2 text-4xl font-bold">Media</h1><p className="mt-3 text-ink-muted">Images are resized and stored in Supabase Storage. Customer attachments are private and appear with their inquiry.</p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load media. Apply the CMS migration and configure storage.</p> : null}
      <form action={uploadPublicMedia} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
        <label className="field-label md:col-span-2">Image (JPEG, PNG or WebP, max 10 MB)<input className="field mt-1" type="file" name="file" accept="image/jpeg,image/png,image/webp" required /></label>
        <label className="field-label">Alt text<input className="field mt-1" name="alt_text" maxLength={500} /></label>
        <label className="field-label">Caption<input className="field mt-1" name="caption" maxLength={500} /></label>
        <button className="btn-primary md:col-span-2 md:justify-self-start">Upload image</button>
      </form>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{(assets ?? []).map((asset) => {
        const { data } = supabase.storage.from("cms-public").getPublicUrl(asset.storage_path);
        return <li key={asset.id} className="card overflow-hidden">
          <img src={data.publicUrl} alt={asset.alt_text || ""} loading="lazy" className="aspect-[4/3] w-full bg-mint-wash object-cover" />
          <form action={updateMediaMetadata} className="space-y-3 p-4"><input type="hidden" name="id" value={asset.id} /><p className="truncate text-xs text-ink-muted">{asset.original_name} · {Math.round(asset.size_bytes / 1024)} KB · {asset.width}×{asset.height}</p><label className="field-label">Alt text<input className="field mt-1" name="alt_text" defaultValue={asset.alt_text} /></label><label className="field-label">Caption<input className="field mt-1" name="caption" defaultValue={asset.caption} /></label><button className="btn-secondary btn-sm">Save details</button></form>
        </li>;
      })}</ul>
      {!assets?.length ? <p className="mt-8 text-ink-muted">No media uploaded yet.</p> : null}
    </>
  );
}
