import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import CommissionOptions from "@/components/CommissionOptions";
import PortfolioGrid from "@/components/PortfolioGrid";
import WorkShowcase from "@/components/WorkShowcase";
import { featuredWork } from "@/lib/work";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Paw from "@/components/Paw";
import CmsFormForPage from "@/components/cms/CmsFormForPage";
import { costumeFaqs } from "@/content/faqs";
import { pageMeta, serviceLd } from "@/lib/seo";
import { getPlacementItems } from "@/lib/gallery-placements";

const path = "/furry-costumes/";
const lede =
  "Handmade furry costumes built around your own character: heads, partials and full-body suits patterned from your reference sheet, in Kemono, Toony or any style in between.";

export const metadata = pageMeta({
  title: "Custom Furry Costumes: Handmade Fursuits",
  description:
    "Commission a custom furry costume made from your reference sheet: handmade fursuit heads, partials and full furry costumes in Kemono or Toony style, shipped worldwide.",
  path,
});

const styles = [
  { href: "/kemono-fursuits/", title: "Kemono furry costumes", body: "Anime-inspired faces, big glossy eyes and soft, doll-like features." },
  { href: "/toony-fursuits/", title: "Toony furry costumes", body: "Bold cartoon shapes, expressive eyes and bright colour blocks." },
  { href: "/fursuit-commission/", title: "Any species, any style", body: "Canines, felines, dragons, hybrids and original species from your ref." },
];

const steps = [
  { title: "Your character first", body: "We start from your reference sheet, not a catalogue, so the costume matches your markings and colours." },
  { title: "Patterned and hand-sewn", body: "Heads are foam-carved or resin-based; fur is patterned, cut and sewn by hand." },
  { title: "Sized to your measurements", body: "Bodysuits and paws are made to fit you, in a plantigrade or digitigrade leg style." },
  { title: "WIP photos as we build", body: "You see the costume at every major stage and can ask for changes before we move on." },
];

export default async function FurryCostumesPage() {
  const work = (await getPlacementItems("gallery"))?.filter((i) => !i.tags.includes("wip")).slice(0, 8);
  return (
    <>
      <PageIntro crumbs={[{ name: "Furry Costumes", path }]} eyebrow="Custom furry costumes" title="Custom furry costumes, made for your character" lede={lede}>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/get-a-quote/" className="btn-primary">
            Get a furry costume quote
          </Link>
          <Link href="/gallery/" className="btn-secondary">
            See finished costumes
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="what" className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <SectionHeading
          id="what"
          eyebrow="Furry costume or fursuit?"
          title="The same thing, made to order"
          mark="made to order"
          lede="In the furry community a custom furry costume is called a fursuit. It turns an animal or anthropomorphic character into something you can wear to conventions, meet-ups, photoshoots and streams."
        />
        <div data-reveal className="toon space-y-4 bg-mint-wash p-7 text-lg">
          <p>
            Unlike a mass-produced animal costume, every piece we make is built from scratch around one character. You choose the coverage, from a single{" "}
            <Link href="/fursuit-parts/" className="link">fursuit head or set of paws</Link> to a{" "}
            <Link href="/fursuit-commission/" className="link">full furry costume</Link>, and we quote it to your design.
          </p>
          <p>
            Not sure what your character looks like yet? Start with a{" "}
            <Link href="/furry-ref-sheet-commissions/" className="link">reference sheet commission</Link> and we&apos;ll build the costume from that.
          </p>
        </div>
      </section>

      <section aria-labelledby="coverage" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            id="coverage"
            eyebrow="Coverage"
            title="From a fursuit head to a full furry costume"
            mark="full furry costume"
            lede="Pick how much of your character you want to wear. Starting prices are shown where we publish them; everything else is quoted to your design."
          />
          <CommissionOptions keys={["fullsuit", "partial", "head", "hand-paws", "feet-paws", "tail"]} />
          <p className="mt-8 text-ink-muted" data-reveal>
            Wondering about cost?{" "}
            <Link href="/fursuit-prices/" className="link">See how fursuit prices are worked out</Link>.
          </p>
        </div>
      </section>

      <section aria-labelledby="styles" className="container-x py-16 sm:py-20">
        <SectionHeading id="styles" eyebrow="Styles" title="Choose your costume style" mark="costume style" />
        <ul className="mt-10 grid gap-7 md:grid-cols-3">
          {styles.map((s, i) => (
            <li key={s.href} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
              <Link href={s.href} className="group toon toon-hover flex h-full flex-col p-6">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-ink-muted">{s.body}</p>
                <span className="mt-5 flex items-center gap-1.5 font-display font-bold text-forest">
                  <Paw className="h-4 w-4 text-mint-deep" /> Explore <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="bg-lavender-soft py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="how" eyebrow="How it's made" title="How a custom furry costume is built" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="toon p-6">
                <span aria-hidden className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-forest bg-mint font-display text-lg font-bold">{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8" data-reveal>
            <Link href="/order-process/" className="link">Read the full fursuit commission process</Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="work" className="container-x py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="work" eyebrow="Gallery" title="Furry costumes from our workshop" mark="workshop" />
          <Link href="/gallery/" className="btn-secondary shrink-0 self-start">Full fursuit gallery</Link>
        </div>
        <div className="mt-10">
          {work ? <PortfolioGrid items={work} /> : <WorkShowcase products={featuredWork(8)} />}
        </div>
      </section>

      <section aria-labelledby="faq" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading id="faq" eyebrow="FAQ" title="Furry costume questions" />
            <p className="mt-6" data-reveal>
              Looking for a costume to represent a club, stream or event?{" "}
              <Link href="/furry-mascot-costumes/" className="link">See furry mascot costumes</Link>.
            </p>
          </div>
          <FaqList faqs={costumeFaqs} />
        </div>
      </section>

      <FinalCta />
      <CmsFormForPage pagePath={path} />
      <JsonLd data={serviceLd("Custom furry costumes", lede, path)} />
    </>
  );
}
