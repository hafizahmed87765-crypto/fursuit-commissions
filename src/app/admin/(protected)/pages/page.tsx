import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addPageSection, createPage, deletePage, deletePageSection, duplicatePage, updatePage, updatePageSection } from "@/app/admin/actions";

export default async function AdminPages({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const [{ data: pages, error: queryError }, { data: media }] = await Promise.all([
    supabase.from("cms_pages").select("*, page_sections(*)").order("updated_at", { ascending: false }),
    supabase.from("media_assets").select("id,original_name").eq("storage_bucket", "cms-public").order("created_at", { ascending: false }).limit(200),
  ]);
  return (
    <>
      <p className="eyebrow">CMS</p>
      <h1 className="mt-2 text-4xl font-bold">Pages</h1>
      <p className="mt-3 text-ink-muted">Create content-managed pages at <code>/content/your-slug/</code>. Published pages are public; drafts stay in the dashboard.</p>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load CMS pages. Apply the Supabase migration and check the project environment.</p> : null}
      <section className="card mt-6 p-6">
        <h2 className="text-2xl font-semibold">Create a page</h2>
        <form action={createPage} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="field-label">Page title<input className="field mt-1" name="title" required maxLength={180} /></label>
          <label className="field-label">URL slug<input className="field mt-1" name="slug" placeholder="leave blank to use title" /></label>
          <label className="field-label md:col-span-2">Short description<textarea className="field mt-1" name="description" rows={2} /></label>
          <button className="btn-primary md:col-span-2 md:justify-self-start">Create draft</button>
        </form>
      </section>
      <div className="mt-8 space-y-6">
        {(pages ?? []).map((page) => (
          <article key={page.id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{page.title}</h2>
              <span className="chip">{page.status}</span>
            </div>
            {page.status === "published" ? <Link className="link mt-2 inline-block" href={`/content/${page.slug}/`}>View published page</Link> : null}
            <form action={updatePage} className="mt-4 grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={page.id} />
              <label className="field-label">Title<input className="field mt-1" name="title" defaultValue={page.title} required /></label>
              <label className="field-label">Slug<input className="field mt-1" name="slug" defaultValue={page.slug} required /></label>
              <label className="field-label md:col-span-2">Description<textarea className="field mt-1" name="description" defaultValue={page.description} rows={2} /></label>
              <label className="field-label">SEO title<input className="field mt-1" name="seo_title" defaultValue={page.seo_title} maxLength={180} /></label>
              <label className="field-label">Meta description<input className="field mt-1" name="meta_description" defaultValue={page.meta_description} maxLength={320} /></label>
              <label className="field-label">Canonical URL<input className="field mt-1" name="canonical_url" type="url" defaultValue={page.canonical_url ?? ""} /></label>
              <label className="field-label">Social sharing image<select className="field mt-1" name="social_image_id" defaultValue={page.social_image_id ?? ""}><option value="">None</option>{(media ?? []).map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name}</option>)}</select></label>
              <label className="field-label">Status<select className="field mt-1" name="status" defaultValue={page.status}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
              <label className="choice flex items-center gap-2"><input type="checkbox" name="is_indexable" defaultChecked={page.is_indexable} />Allow search engines to index this page</label>
              <button className="btn-primary md:col-span-2 md:justify-self-start">Save page</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-4"><Link className="link" href={`/admin/pages/preview/${page.id}/`}>Preview draft</Link>{page.status === "published" ? <Link className="link" href={`/content/${page.slug}/`}>Open public page</Link> : null}<form action={duplicatePage}><input type="hidden" name="id" value={page.id} /><button className="link">Duplicate</button></form><form action={deletePage}><input type="hidden" name="id" value={page.id} /><button className="text-sm text-red-700 underline">Delete page</button></form></div>
            <details className="mt-5 rounded-2xl bg-mint-wash p-4">
              <summary className="cursor-pointer font-semibold">Sections ({page.page_sections?.length ?? 0})</summary>
              <ul className="mt-3 space-y-3">
                {(page.page_sections ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position).map((section: { id: string; heading: string; section_type: string; position: number; body: Record<string, unknown> }) => (
                  <li key={section.id} className="rounded-xl bg-white p-4">
                    <form action={updatePageSection} className="grid gap-3 md:grid-cols-2">
                      <input type="hidden" name="id" value={section.id} />
                      <label className="field-label">Heading<input className="field mt-1" name="heading" defaultValue={section.heading} /></label>
                      <label className="field-label">Type<select className="field mt-1" name="section_type" defaultValue={section.section_type}><option value="rich_text">Text</option><option value="hero">Hero</option><option value="cards">Cards</option><option value="image">Image</option><option value="gallery">Gallery</option><option value="call_to_action">Call to action</option></select></label>
                      <label className="field-label">Position<input className="field mt-1" name="position" type="number" min="0" defaultValue={section.position} /></label>
                      <label className="field-label">Image (for image sections)<select className="field mt-1" name="media_id"><option value="">Keep JSON image URL</option>{(media ?? []).map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name}</option>)}</select></label>
                      <label className="field-label md:col-span-2">Section data (JSON)<textarea className="field mt-1 font-mono text-sm" name="body" rows={5} defaultValue={JSON.stringify(section.body, null, 2)} /></label>
                      <div className="flex gap-4 md:col-span-2"><button className="btn-secondary btn-sm">Save section</button></div>
                    </form>
                    <form action={deletePageSection} className="mt-2"><input type="hidden" name="id" value={section.id} /><button className="text-sm text-red-700 underline">Delete section</button></form>
                  </li>
                ))}
              </ul>
              <form action={addPageSection} className="mt-4 grid gap-3 md:grid-cols-2">
                <input type="hidden" name="page_id" value={page.id} />
                <label className="field-label">Section heading<input className="field mt-1" name="heading" /></label>
                <label className="field-label">Type<select className="field mt-1" name="section_type"><option value="rich_text">Text</option><option value="hero">Hero</option><option value="cards">Cards</option><option value="image">Image</option><option value="gallery">Gallery</option><option value="call_to_action">Call to action</option></select></label>
                <label className="field-label">Image (for image sections)<select className="field mt-1" name="media_id"><option value="">Select from library</option>{(media ?? []).map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name}</option>)}</select></label>
                <label className="field-label">Order<input className="field mt-1" name="position" type="number" min="0" defaultValue={(page.page_sections?.length ?? 0) + 1} /></label>
                <label className="field-label md:col-span-2">Section data (JSON)<textarea className="field mt-1 font-mono text-sm" name="body" rows={5} defaultValue={'{\n  "text": "Write the section content here."\n}'} /></label>
                <button className="btn-secondary md:col-span-2 md:justify-self-start">Add section</button>
              </form>
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
