import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Journal", description: "Updates and stories from FursuitCommissions.com." };

export default async function JournalPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <main className="container-x py-16"><h1 className="text-4xl font-bold">Journal</h1><p className="mt-4 text-ink-muted">No articles are available yet.</p></main>;
  }
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase.from("blog_posts").select("slug,title,excerpt,published_at").eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
  return (
    <main className="container-x py-12 sm:py-16">
      <p className="eyebrow">From the studio</p><h1 className="mt-2 text-4xl font-bold sm:text-5xl">Journal</h1>
      <ul className="mt-8 grid gap-5 md:grid-cols-2">{(posts ?? []).map((post) => <li key={post.slug} className="card p-6"><p className="eyebrow">{post.published_at ? new Date(post.published_at).toLocaleDateString("en", { dateStyle: "medium" }) : ""}</p><h2 className="mt-2 text-2xl font-semibold"><Link className="hover:underline" href={`/journal/${post.slug}/`}>{post.title}</Link></h2><p className="mt-2 text-ink-muted">{post.excerpt}</p><Link className="link mt-4 inline-block" href={`/journal/${post.slug}/`}>Read article</Link></li>)}</ul>
      {!posts?.length ? <p className="mt-8 text-ink-muted">No articles have been published yet.</p> : null}
    </main>
  );
}
