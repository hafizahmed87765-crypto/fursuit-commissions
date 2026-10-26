import Breadcrumbs from "./Breadcrumbs";
import type { Crumb } from "@/lib/seo";

export default function PageIntro({ crumbs, eyebrow, title, lede, tint = "bg-mint-wash", children }: { crumbs: Crumb[]; eyebrow?: string; title: string; lede?: React.ReactNode; tint?: string; children?: React.ReactNode }) {
  return (
    <section className={`${tint} relative overflow-hidden`}>
      <div className="bg-paws absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative py-10 sm:py-14">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 max-w-3xl animate-rise">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          {lede ? <p className="lede mt-4 text-ink">{lede}</p> : null}
          {children}
        </div>
      </div>
    </section>
  );
}
