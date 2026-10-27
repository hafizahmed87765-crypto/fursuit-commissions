import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import SectionHeading from "@/components/SectionHeading";
import StartingPoints from "@/components/StartingPoints";
import ServiceCards from "@/components/ServiceCards";
import PortfolioGrid from "@/components/PortfolioGrid";
import WorkShowcase from "@/components/WorkShowcase";
import { featuredWork } from "@/lib/work";
import RepairTeaser from "@/components/RepairTeaser";
import ProcessSteps from "@/components/ProcessSteps";
import Planner from "@/components/Planner";
import Reviews from "@/components/Reviews";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { commissionReasons, policies } from "@/content/site";
import { generalFaqs } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";
import { getPlacementItems } from "@/lib/gallery-placements";
import { getSiteImages } from "@/lib/site-images";
import CmsFormForPage from "@/components/cms/CmsFormForPage";

export const metadata = pageMeta({
  // The layout's title template doesn't apply to the root page, so the brand is included here.
  title: "Fursuit Commissions: Custom Fursuits & Furry Costumes | FursuitCommissions.com",
  description:
    "Custom fursuit commissions from a handmade fursuit maker: furry costumes, Kemono and Toony suits and furry mascot costumes. Free quotes and worldwide shipping.",
  path: "/",
});


// Each promise is a practice from the studio's own About page and Terms.
const promises = [
  {
    title: "WIP photos at every stage",
    body: "Tape pattern, foam base, fur and finishing. You see it before we move on, and revisions are welcome while we build.",
    tint: "bg-mint-light",
    icon: <><rect x="3" y="6" width="18" height="14" rx="3" /><circle cx="12" cy="13" r="3.5" /><path d="M8 6l1.5-2h5L16 6" /></>,
  },
  {
    title: `${policies.warrantyMonths}-month limited warranty`,
    body: "Seam failures and structural foam issues on commissions are covered, so you can wear your suit with confidence.",
    tint: "bg-lavender-soft",
    icon: <><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  },
  {
    title: "Ships worldwide",
    body: "We ship to the furry community wherever you are, with tracking details and care guidance.",
    tint: "bg-petal",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></>,
  },
];

const helpLinks = [
  { href: "/order-process/", label: "How a commission works" },
  { href: "/payment-plans/", label: "Deposits & payment plans" },
  { href: "/fursuit-repairs/", label: "Repairs & refurbishment" },
  { href: "/contact-us/", label: "Contact us" },
];

export default async function HomePage() {
  const siteImages = await getSiteImages();
  // An admin-assigned homepage gallery wins; otherwise show the character sliders.
  const featured = (await getPlacementItems("home"))?.slice(0, 12);
  return (
    <>
      <Hero />
      <TrustBar />

      <section aria-labelledby="start" className="container-x py-16 sm:py-24">
        <SectionHeading
          id="start"
          align="center"
          eyebrow="Pick a starting point"
          title="From a single tail to a full character"
          mark="full character"
          lede="Choose your fursuit coverage and we'll build the rest around your reference. Where we list a starting price it's for a standard build; everything else is quoted to your design."
        />
        <StartingPoints />
        <p className="mt-8 text-center text-ink-muted" data-reveal>
          Spreading the cost?{" "}
          <Link href="/payment-plans/" className="link">
            See deposits and payment plans
          </Link>
        </p>
      </section>

      <section aria-labelledby="styles" className="relative overflow-hidden bg-mint-wash py-16 sm:py-24">
        <div className="bg-paws absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="styles" eyebrow="Pick your style badge" title="Three ways to bring your character home" mark="character home" />
            <p className="lede max-w-md" data-reveal>
              Every fursuit commission is built from scratch. Start with the style that fits your character, and we&apos;ll shape the rest around your reference.
            </p>
          </div>
          <ServiceCards images={{ kemono: siteImages.H4, toony: siteImages.H5, custom: siteImages.H6 }} />
        </div>
      </section>

      <section aria-labelledby="explore" className="container-x pt-16 sm:pt-24">
        <SectionHeading id="explore" eyebrow="Looking for something specific?" title="Fursuits, furry costumes & mascots" mark="furry costumes" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { href: "/furry-costumes/", title: "Custom furry costumes", body: "What a custom furry costume is, how it's made and the styles you can choose." },
            { href: "/furry-mascot-costumes/", title: "Furry mascot costumes", body: "Handmade mascot heads, paws and suits for your character, stream or community." },
            { href: "/fursuit-prices/", title: "Fursuit commission prices", body: "What affects the cost of a custom fursuit, with our published starting prices." },
          ].map((l, i) => (
            <li key={l.href} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
              <Link href={l.href} className="group toon toon-hover flex h-full flex-col p-6">
                <h3 className="text-2xl font-bold">{l.title}</h3>
                <p className="mt-2 flex-1 text-ink-muted">{l.body}</p>
                <span className="mt-4 font-display font-bold text-forest">
                  Learn more <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Ways to start your commission" className="container-x grid gap-8 pt-16 sm:pt-24 lg:grid-cols-2">
        <div data-reveal className="toon bg-forest p-8 text-white sm:p-11 lg:-rotate-1">
          <p className="eyebrow !text-mint">Know what you want?</p>
          <h2 className="mt-2 text-3xl font-bold !text-white sm:text-4xl">Request a custom fursuit quote</h2>
          <p className="mt-3 max-w-md text-lg text-mint-light">Upload your reference sheet and tell us what you&apos;d like made. It takes about five minutes, and nothing is booked until you accept.</p>
          <Link href="/get-a-quote/" className="btn mt-7 border-mint bg-mint text-forest hover:bg-mint-light motion-safe:hover:-translate-y-0.5">
            Get a free quote <span aria-hidden>→</span>
          </Link>
        </div>
        <div data-reveal style={{ ["--reveal-delay" as string]: "90ms" }} className="toon bg-lavender-soft p-8 sm:p-11 lg:rotate-1">
          <p className="eyebrow">Not sure yet?</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Try the commission planner</h2>
          <p className="mt-3 max-w-md text-lg text-ink-muted">Answer a few quick questions and we&apos;ll point you to the right fursuit commission, with your answers carried into the quote form.</p>
          <Link href="#planner" className="btn-primary mt-7">
            Start the planner <span aria-hidden>↓</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="featured" className="container-x py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="featured" eyebrow="The badge wall" title="Fresh from the workshop" mark="workshop" lede="Kemono and Toony fursuits we have made for real characters. Swipe each card for more angles, or tap to see it larger." />
          <Link href="/gallery/" className="btn-secondary shrink-0 self-start md:self-auto">
            View full gallery
          </Link>
        </div>
        <div className="mt-10">
          {featured ? <PortfolioGrid items={featured} filters /> : <WorkShowcase products={featuredWork(8)} />}
        </div>
      </section>

      <section aria-labelledby="process" className="relative overflow-hidden bg-mint-wash py-16 sm:py-24">
        <div className="bg-paws absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <SectionHeading id="process" align="center" eyebrow="From ref sheet to con floor" title="Seven clear steps, no surprises" mark="no surprises" lede="You'll always know what happens next, and you'll see your suit at every major stage." />
          <ProcessSteps compact />
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row" data-reveal>
            <Link href="/order-process/" className="btn-primary">
              Full process details
            </Link>
            <Link href="/payment-plans/" className="btn-secondary">
              How payments work
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="why-custom" className="container-x py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center">
          <SectionHeading
            id="why-custom"
            eyebrow="Why commission a fursuit?"
            title="A wearable version of your character"
            mark="wearable"
            lede="A custom fursuit commission brings your character from reference sheet to something you can wear, photograph and take to events. The design starts with you."
          />
          <ul className="grid gap-4">
            {commissionReasons.map((reason, i) => (
              <li key={reason.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className={`toon toon-hover flex gap-5 p-6 ${["bg-white", "bg-petal", "bg-mint-wash"][i % 3]}`}>
                <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] border-forest bg-mint-light font-display text-xl font-bold text-forest">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{reason.title}</h3>
                  <p className="mt-1 text-ink-muted">{reason.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <RepairTeaser />

      <section aria-labelledby="planner" className="bg-lavender-soft py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading id="planner" eyebrow="Commission planner" title="Not sure what to order?" mark="what to order?" lede="Answer a few quick questions and we'll point you to the right commission, with your answers carried into the quote form." />
          <div className="mt-10">
            <Planner />
          </div>
        </div>
      </section>

      <section aria-labelledby="promises" className="container-x py-16 sm:py-24">
        <SectionHeading id="promises" eyebrow="Our promises" title="How we work with you" mark="with you" />
        <ul className="mt-12 grid gap-7 md:grid-cols-3">
          {promises.map((p, i) => (
            <li key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }} className={`toon toon-hover p-7 sm:p-8 ${p.tint}`}>
              <svg aria-hidden viewBox="0 0 24 24" className="h-14 w-14 rounded-2xl border-[3px] border-forest bg-white p-2 text-forest" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {p.icon}
              </svg>
              <h3 className="mt-5 text-2xl font-bold">{p.title}</h3>
              <p className="mt-2 text-forest/90">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8" data-reveal>
          <Link href="/about-us/" className="link">
            More about how we work
          </Link>
        </p>
      </section>

      <section aria-labelledby="reviews" className="bg-mint-wash py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading id="reviews" eyebrow="From our clients" title="Suits out in the world" mark="in the world" />
          <Reviews />
        </div>
      </section>

      <section aria-labelledby="faq" className="container-x py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          <div data-reveal className="toon relative self-start bg-mint p-8 sm:p-10">
            <div className="bg-paws absolute inset-0 rounded-[1.8rem]" aria-hidden />
            <div className="relative">
              <h2 id="faq" className="h-section">
                Questions about fursuit commissions?
              </h2>
              <p className="mt-3 text-lg text-forest">Everything about ordering, payments and shipping. Can&apos;t find your answer? Send us a message.</p>
              <ul className="mt-6 grid gap-2.5">
                {helpLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group flex min-h-[52px] items-center justify-between rounded-2xl border-[3px] border-forest bg-white px-5 font-display font-bold text-forest shadow-toon-sm transition duration-300 ease-smooth hover:bg-mint-light motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0.5 active:shadow-none">
                      {l.label}
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <FaqList faqs={generalFaqs} />
        </div>
      </section>

      <CmsFormForPage pagePath="/" />
      <FinalCta />
    </>
  );
}
