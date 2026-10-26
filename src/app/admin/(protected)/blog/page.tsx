import type { JSONContent } from "@tiptap/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createBlogCategory, createBlogPost, createBlogTag, updateBlogPost } from "@/app/admin/actions";
import RichTextEditor from "@/components/cms/RichTextEditor";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, supabase] = await Promise.all([searchParams, createSupabaseServerClient()]);
  const [{ data: posts, error: queryError }, { data: categories }, { data: tags }, { data: assets }] = await Promise.all([
    supabase.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    supabase.from("blog_categories").select("id,name,slug").order("name"),
    supabase.from("blog_tags").select("id,name,slug").order("name"),
    supabase.from("media_assets").select("id,storage_path,original_name,alt_text").eq("storage_bucket", "cms-public").order("created_at", { ascending: false }).limit(200),
  ]);
  const mediaChoices = (assets ?? []).map((asset) => ({ url: supabase.storage.from("cms-public").getPublicUrl(asset.storage_path).data.publicUrl, alt: asset.alt_text, label: asset.original_name }));
  const postsWithTaxonomy = await Promise.all((posts ?? []).map(async (post) => {
    const [{ data: postCategories }, { data: postTags }] = await Promise.all([
      supabase.from("blog_post_categories").select("category_id").eq("post_id", post.id),
      supabase.from("blog_post_tags").select("tag_id").eq("post_id", post.id),
    ]);
    return { ...post, categoryIds: (postCategories ?? []).map((x) => x.category_id), tagIds: (postTags ?? []).map((x) => x.tag_id) };
  }));
  return (
    <>
      <p className="eyebrow">CMS</p><h1 className="mt-2 text-4xl font-bold">Blog</h1>
      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p> : null}
      {queryError ? <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-rose-950">Could not load blog data. Apply the CMS migration and configure Supabase.</p> : null}
      <section className="card mt-6 p-6">
        <h2 className="text-2xl font-semibold">New article</h2>
        <form action={createBlogPost} className="mt-4 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2"><label className="field-label">Title<input className="field mt-1" name="title" required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" placeholder="leave blank to use title" /></label></div>
          <label className="field-label">Excerpt<textarea className="field mt-1" name="excerpt" rows={2} /></label>
          <div><p className="field-label">Article content</p><RichTextEditor name="body" media={mediaChoices} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="field-label">Featured image<select className="field mt-1" name="featured_image_id"><option value="">None</option>{(assets ?? []).map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name}</option>)}</select></label>
            <label className="field-label">Status<select className="field mt-1" name="status"><option value="draft">Draft</option><option value="published">Publish now</option></select></label>
            <label className="field-label">SEO title<input className="field mt-1" name="seo_title" /></label><label className="field-label">Meta description<input className="field mt-1" name="meta_description" /></label>
          </div>
          <div className="grid gap-4 md:grid-cols-2"><fieldset><legend className="field-label">Categories</legend>{(categories ?? []).map((category) => <label key={category.id} className="choice mr-2 mt-1 inline-flex gap-2"><input type="checkbox" name="category_ids" value={category.id} />{category.name}</label>)}</fieldset><fieldset><legend className="field-label">Tags</legend>{(tags ?? []).map((tag) => <label key={tag.id} className="choice mr-2 mt-1 inline-flex gap-2"><input type="checkbox" name="tag_ids" value={tag.id} />{tag.name}</label>)}</fieldset></div>
          <button className="btn-primary justify-self-start">Save article</button>
        </form>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <form action={createBlogCategory} className="card grid gap-3 p-5"><h2 className="text-xl font-semibold">Add category</h2><label className="field-label">Name<input className="field mt-1" name="name" required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" /></label><button className="btn-secondary justify-self-start">Add category</button></form>
        <form action={createBlogTag} className="card grid gap-3 p-5"><h2 className="text-xl font-semibold">Add tag</h2><label className="field-label">Name<input className="field mt-1" name="name" required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" /></label><button className="btn-secondary justify-self-start">Add tag</button></form>
      </div>
      <section className="mt-8"><h2 className="text-2xl font-semibold">Articles</h2>
        <div className="mt-4 space-y-5">{postsWithTaxonomy.map((post) => (
          <details key={post.id} className="card p-5">
            <summary className="cursor-pointer"><span className="font-semibold">{post.title}</span><span className="chip ml-3">{post.status}</span><span className="ml-3 text-sm text-ink-muted">/journal/{post.slug}/</span></summary>
            {post.status === "published" ? <a className="link mt-3 inline-block" href={`/journal/${post.slug}/`}>Open published article</a> : null}
            <form action={updateBlogPost} className="mt-4 grid gap-4"><input type="hidden" name="id" value={post.id} />
              <div className="grid gap-4 md:grid-cols-2"><label className="field-label">Title<input className="field mt-1" name="title" defaultValue={post.title} required /></label><label className="field-label">Slug<input className="field mt-1" name="slug" defaultValue={post.slug} required /></label></div>
              <label className="field-label">Excerpt<textarea className="field mt-1" name="excerpt" rows={2} defaultValue={post.excerpt} /></label>
              <div><p className="field-label">Article content</p><RichTextEditor name="body" content={post.body as JSONContent} media={mediaChoices} /></div>
              <div className="grid gap-4 md:grid-cols-2"><label className="field-label">Featured image<select className="field mt-1" name="featured_image_id" defaultValue={post.featured_image_id ?? ""}><option value="">None</option>{(assets ?? []).map((asset) => <option key={asset.id} value={asset.id}>{asset.original_name}</option>)}</select></label><label className="field-label">Status<select className="field mt-1" name="status" defaultValue={post.status}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="field-label">SEO title<input className="field mt-1" name="seo_title" defaultValue={post.seo_title} /></label><label className="field-label">Meta description<input className="field mt-1" name="meta_description" defaultValue={post.meta_description} /></label><label className="field-label md:col-span-2">Canonical URL<input className="field mt-1" name="canonical_url" type="url" defaultValue={post.canonical_url ?? ""} /></label></div>
              <div className="grid gap-4 md:grid-cols-2"><fieldset><legend className="field-label">Categories</legend>{(categories ?? []).map((category) => <label key={category.id} className="choice mr-2 mt-1 inline-flex gap-2"><input type="checkbox" name="category_ids" value={category.id} defaultChecked={post.categoryIds.includes(category.id)} />{category.name}</label>)}</fieldset><fieldset><legend className="field-label">Tags</legend>{(tags ?? []).map((tag) => <label key={tag.id} className="choice mr-2 mt-1 inline-flex gap-2"><input type="checkbox" name="tag_ids" value={tag.id} defaultChecked={post.tagIds.includes(tag.id)} />{tag.name}</label>)}</fieldset></div>
              <button className="btn-primary justify-self-start">Save article</button>
            </form>
          </details>
        ))}</div>
      </section>
    </>
  );
}
