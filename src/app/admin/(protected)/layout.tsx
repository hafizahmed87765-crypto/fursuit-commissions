import Link from "next/link";
import { requireCmsAdmin } from "@/lib/supabase/auth";
import { signOutOfAdmin } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const links = [
  ["Overview", "/admin/"], ["Pages", "/admin/pages/"], ["Blog", "/admin/blog/"],
  ["Forms", "/admin/forms/"], ["Inquiries", "/admin/submissions/"],
  ["Media", "/admin/media/"], ["Galleries", "/admin/galleries/"], ["Site images", "/admin/site-images/"], ["Commissions", "/admin/commissions/"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireCmsAdmin();
  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[220px_1fr] lg:py-12">
      <aside>
        <p className="eyebrow">Content management</p>
        <p className="mt-1 font-display text-xl font-semibold">{admin.displayName || admin.user.email}</p>
        <nav aria-label="Admin navigation" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
          {links.map(([label, href]) => <Link key={href} href={href} className="rounded-xl px-4 py-3 font-semibold text-forest hover:bg-mint-wash">{label}</Link>)}
        </nav>
        <form action={signOutOfAdmin} className="mt-4">
          <button className="btn-secondary w-full" type="submit">Sign out</button>
        </form>
        <Link href="/" className="link mt-4 inline-block">View website</Link>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
