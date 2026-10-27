import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import SectionHeading from "./SectionHeading";
import PortfolioGrid from "./PortfolioGrid";
import WorkShowcase from "./WorkShowcase";
import { characters, featuredWork } from "@/lib/work";
import CommissionOptions from "./CommissionOptions";
import ProcessSteps from "./ProcessSteps";
import FaqList from "./FaqList";
import FinalCta from "./FinalCta";
import JsonLd from "./JsonLd";
import { portfolio, type PortfolioTag } from "@/content/portfolio";
import type { Faq } from "@/content/faqs";
import { serviceLd } from "@/lib/seo";
import { getPlacementItems } from "@/lib/gallery-placements";
import { getSiteImages, type SlotId } from "@/lib/site-images";
import CmsFormForPage from "@/components/cms/CmsFormForPage";

export type ServiceLandingProps = {
  path: string;
  crumb: string;
  service: "custom" | "kemono" | "toony";
  eyebrow: string;
  title: string;
  intro: string;
  hero: { src: string; width: number; height: number; alt: string; position?: string };
  /** Admin > Site images slot that can replace the hero photo. */
  heroSlot?: SlotId;
  tint: string;
  traits: { title: string; body: string }[];
  traitsTitle: string;
  portfolioTag?: PortfolioTag;
  faqs: Faq[];
  related: { href: string; label: string; body: string }[];
};

export default async function ServiceLanding(p: ServiceLandingProps) {
  const hero = p.heroSlot ? { ...(await getSiteImages())[p.heroSlot], position: p.hero.position } : p.hero;
  // An admin gallery assigned to this style's page wins over the built-in portfolio.
  const work = await getPlacementItems(p.service);
  const tag = p.portfolioTag;
  const showcase = tag === "kemono" || tag === "toony" ? characters.filter((c) => c.style === tag).slice(0, 8) : featuredWork(8);
  const quote = `/get-a-quote/?service=${p.service}`;

  return (
    <>
      <section className={`${p.tint} relative overflow-hidden`}>
        <div className="bg-paws absolute inset-0 opacity-50" aria-hidden />
        <div className="container-x relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:py-16">
          <div className="animate-rise">
            <Breadcrumbs items={[{ name: p.crumb, path: p.path }]} />
            <p className="eyebrow mt-6">{p.eyebrow}</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{p.title}</h1>
            <p className="lede mt-5 max-w-xl text-ink">{p.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={quote} className="btn-primary">
                Get a {p.crumb.replace(/s$/, "")} Quote
              </Link>
              <Link href="#work" className="btn-secondary">
                See examples
              </Link>
            </div>
          </div>
          <div className="animate-reveal overflow-hidden rounded-blob bg-black shadow-lift">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover" style={{ objectPosition: hero.position ?? "50% 30%" }} />
          </div>
        </div>
      </section>

      <section aria-labelledby="traits" className="container-x py-16 sm:py-20">
        <SectionHeading id="traits" eyebrow="The style" title={p.traitsTitle} />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.traits.map((t, i) => (
            <li key={t.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="card p-6">
              <h3 className="text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-ink-muted">{t.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="work-title" id="work" className="container-x py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="work-title" eyebrow="From the workshop" title={`Recent ${p.crumb}`} />
          <Link href="/gallery/" className="btn-secondary shrink-0 self-start">
            Full gallery
          </Link>
        </div>
        <div className="mt-10">
          {work ? <PortfolioGrid items={work.slice(0, 8)} /> : tag && tag !== "kemono" && tag !== "toony" ? <PortfolioGrid items={portfolio.filter((i) => i.tags.includes(tag)).slice(0, 8)} /> : <WorkShowcase products={showcase} />}
        </div>
      </section>

      <section aria-labelledby="coverage" className="bg-petal py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="coverage" eyebrow="Coverage" title="Choose what we build" lede="Pick a head, partial, fullsuit or individual parts. Starting prices are listed where we publish them; everything else is quoted to your design." />
          <CommissionOptions />
          <p className="mt-8 text-ink-muted">
            Spreading the cost?{" "}
            <Link href="/payment-plans/" className="link">
              See deposits and payment plans
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="how" className="container-x py-16 sm:py-20">
        <SectionHeading id="how" eyebrow="How it works" title="From reference sheet to doorstep" />
        <ProcessSteps compact />
        <p className="mt-8">
          <Link href="/order-process/" className="link">
            Read the full commission process, payments and shipping
          </Link>
        </p>
      </section>

      <section aria-labelledby="faq" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading id="faq" eyebrow="FAQ" title={`${p.crumb}: good to know`} />
            <nav aria-label="Related pages" className="mt-8 space-y-3" data-reveal>
              {p.related.map((r) => (
                <Link key={r.href} href={r.href} className="card card-hover block rounded-2xl p-4">
                  <span className="block font-display font-semibold text-forest">{r.label} →</span>
                  <span className="block text-sm text-ink-muted">{r.body}</span>
                </Link>
              ))}
            </nav>
          </div>
          <FaqList faqs={p.faqs} />
        </div>
      </section>

      <FinalCta />
      <CmsFormForPage pagePath={p.path} />
      <JsonLd data={serviceLd(p.title, p.intro, p.path)} />
    </>
  );
}
