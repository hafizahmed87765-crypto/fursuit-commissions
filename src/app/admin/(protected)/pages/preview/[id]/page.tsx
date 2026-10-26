import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function CmsPagePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createSupabaseAdminClient();
  const [{ data: page }, { data: sections }] = await Promise.all([
    db.from("cms_pages").select("id,slug,title,description,status").eq("id", id).maybeSingle(),
    db.from("page_sections").select("id,section_type,heading,body,position").eq("page_id", id).order("position"),
  ]);
  if (!page) notFound();
  return <main className="container-x max-w-4xl py-12">
    <Link className="link" href="/admin/pages/">← Back to pages</Link>
    <p className="eyebrow mt-8">Preview · {page.status}</p><h1 className="mt-2 text-4xl font-bold">{page.title}</h1>{page.description ? <p className="lede mt-4">{page.description}</p> : null}
    <div className="mt-10 space-y-10">{(sections ?? []).map((section) => {
      const body = section.body as { text?: string; paragraphs?: string[]; items?: { title?: string; text?: string }[] };
      return <section key={section.id} className="border-t border-forest/10 pt-6">{section.heading ? <h2 className="text-3xl font-semibold">{section.heading}</h2> : null}{body.text ? <p className="mt-4 whitespace-pre-line leading-relaxed">{body.text}</p> : null}{body.paragraphs?.map((paragraph, i) => <p key={i} className="mt-4 whitespace-pre-line leading-relaxed">{paragraph}</p>)}{body.items?.length ? <ul className="mt-5 grid gap-4 sm:grid-cols-2">{body.items.map((item, i) => <li key={i} className="card p-5"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-2 text-ink-muted">{item.text}</p></li>)}</ul> : null}</section>;
    })}</div>
  </main>;
}
