import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Paw from "@/components/Paw";
import { getGuide, guides } from "@/content/guides";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ slug: g.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return pageMeta({ title: g.metaTitle, description: g.description, path: `/guides/${g.slug}/`, image: g.image.src });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}/`;
  const others = guides.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": g.kind === "Blog" ? "BlogPosting" : "Article",
          headline: g.title,
          description: g.description,
          image: `${site.url}${g.image.src}`,
          datePublished: g.published,
          dateModified: g.published,
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/logo.png` } },
          mainEntityOfPage: `${site.url}${path}`,
        }}
      />
      <article>
        <header className="relative overflow-hidden bg-mint-wash">
          <div className="bg-paws absolute inset-0 opacity-50" aria-hidden />
          <div className="container-x relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.3fr_1fr]">
            <div className="animate-rise">
              <Breadcrumbs items={[{ name: "Guides & Blog", path: "/guides/" }, { name: g.title, path }]} />
              <p className="eyebrow mt-6">{g.kind === "Blog" ? "From the studio" : "Fursuit guide"}</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{g.title}</h1>
              <p className="lede mt-4 text-ink">{g.intro}</p>
              <p className="mt-4 text-sm text-ink-muted">
                {new Date(g.published).toLocaleDateString("en-US", { dateStyle: "long" })} · {g.readMinutes} min read
              </p>
            </div>
            <Image src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height} priority sizes="(min-width: 1024px) 40vw, 100vw" className="toon aspect-[4/3] w-full object-cover lg:aspect-square" />
          </div>
        </header>

        <div className="container-x grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_18rem]">
          <div className="max-w-3xl space-y-12">
            {g.sections.map((s) => (
              <section key={s.heading} data-reveal>
                <h2 className="text-3xl font-bold">{s.heading}</h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="mt-4 text-lg text-ink-muted">{p}</p>
                ))}
                {s.list ? (
                  <ul className="mt-4 space-y-2 text-lg text-ink-muted">
                    {s.list.map((x) => (
                      <li key={x} className="flex gap-2.5">
                        <Paw className="mt-1.5 h-4 w-4 shrink-0 text-mint-deep" />
                        {x}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {s.steps ? (
                  <ol className="mt-5 grid gap-4 sm:grid-cols-2">
                    {s.steps.map((st, i) => (
                      <li key={st.title} className="card flex gap-3 p-5">
                        <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-display font-bold text-white">{i + 1}</span>
                        <span>
                          <span className="block font-display text-lg font-semibold text-forest">{st.title}</span>
                          <span className="mt-1 block text-ink-muted">{st.body}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>
            ))}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="toon p-6">
              <p className="font-display text-xl font-bold">Ready for your own suit?</p>
              <p className="mt-2 text-sm text-ink-muted">Free quote, replies within 12 hours, and weekly or biweekly instalment plans.</p>
              <Link href="/get-a-quote/" className="btn-primary btn-sm mt-4">Get a free quote</Link>
            </div>
            <nav aria-label="Related pages" className="card p-6">
              <p className="font-display font-bold text-forest">Related</p>
              <ul className="mt-3 space-y-2">
                {g.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="link">{r.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </article>

      <section aria-labelledby="guide-faq" className="bg-mint-wash py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="guide-faq" eyebrow="FAQ" title="Common questions" />
          <FaqList faqs={g.faqs} />
        </div>
      </section>

      <section aria-labelledby="more-guides" className="container-x py-14 sm:py-20">
        <SectionHeading id="more-guides" eyebrow="Keep reading" title="More fursuit guides" />
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/guides/${o.slug}/`} className="card card-hover block h-full p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-mint-deep">{o.kind}</span>
                <span className="mt-1 block font-display text-xl font-bold text-forest">{o.title}</span>
                <span className="mt-2 block text-sm text-ink-muted">{o.readMinutes} min read →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
