import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const modules = [
  { title: "Pages", href: "/admin/pages/", table: "cms_pages", description: "Edit managed page copy, sections and SEO." },
  { title: "Blog", href: "/admin/blog/", table: "blog_posts", description: "Write drafts and publish articles." },
  { title: "Forms", href: "/admin/forms/", table: "cms_forms", description: "Configure inquiry forms and fields." },
  { title: "Inquiries", href: "/admin/submissions/", table: "form_submissions", description: "Review customer submissions and notes." },
  { title: "Media", href: "/admin/media/", table: "media_assets", description: "Browse reusable public and private uploads." },
  { title: "Galleries", href: "/admin/galleries/", table: "galleries", description: "Organize images into public galleries." },
  { title: "Commissions", href: "/admin/commissions/", table: "commission_types", description: "Manage commission types and descriptions." },
];

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();
  const counts = await Promise.all(modules.map(async (item) => {
    const { count } = await supabase.from(item.table).select("id", { count: "exact", head: true });
    return count ?? 0;
  }));
  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 text-4xl font-bold">Website content</h1>
      <p className="mt-3 lede">Manage pages, inquiries and the media that supports your commission work.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((item, i) => (
          <li key={item.href}>
            <Link href={item.href} className="card block h-full p-5 transition hover:shadow-lift">
              <span className="eyebrow">{counts[i]} records</span>
              <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
