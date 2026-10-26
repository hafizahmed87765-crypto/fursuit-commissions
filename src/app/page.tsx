import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import SectionHeading from "@/components/SectionHeading";
import ServiceCards from "@/components/ServiceCards";
import PortfolioGrid from "@/components/PortfolioGrid";
import CommissionOptions from "@/components/CommissionOptions";
import RepairTeaser from "@/components/RepairTeaser";
import ProcessSteps from "@/components/ProcessSteps";
import Planner from "@/components/Planner";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { portfolio } from "@/content/portfolio";
import { generalFaqs } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Custom Fursuit & Kemono Commissions | FursuitCommissions.com",
  description:
    "Custom fursuits, Kemono and Toony suits handmade to your character: heads, partials, fullsuits, paws and tails. Free quotes, WIP updates and worldwide shipping.",
  path: "/",
});

const featured = portfolio.filter((p) => !p.tags.includes("cosplay") && !p.tags.includes("plush")).slice(0, 8);

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />

      <section aria-labelledby="styles" className="container-x py-16 sm:py-24">
        <SectionHeading id="styles" eyebrow="Choose your style" title="Three ways to bring your character home" lede="Every commission is built from scratch. Start with the style that fits your character, and we'll shape the rest around your reference." />
        <ServiceCards />
      </section>

      <section aria-labelledby="featured" className="bg-mint-wash py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="featured" eyebrow="Featured creations" title="Fresh from the workshop" lede="Finished pieces and works in progress, from tape patterns to final fur." />
            <Link href="/gallery/" className="btn-secondary shrink-0 self-start md:self-auto">
              View full gallery
            </Link>
          </div>
          <div className="mt-10">
            <PortfolioGrid items={featured} />
          </div>
        </div>
      </section>

      <section aria-labelledby="options" className="container-x py-16 sm:py-24">
        <SectionHeading id="options" eyebrow="Commission options" title="From a single tail to a full character" lede="Choose your coverage. Where we list a starting price, it's for a standard build; your final quote depends on your design, markings and extras." />
        <CommissionOptions />
      </section>

      <RepairTeaser />

      <section aria-labelledby="process" className="container-x py-16 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="process" eyebrow="Our commission process" title="Seven clear steps, no surprises" lede="You'll always know what happens next, and you'll see your suit at every major stage." />
          <Link href="/order-process/" className="btn-secondary shrink-0 self-start md:self-auto">
            Full process details
          </Link>
        </div>
        <ProcessSteps compact />
      </section>

      <section aria-labelledby="planner" className="bg-lavender-soft py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading id="planner" eyebrow="Commission planner" title="Not sure what to order?" lede="Answer a few quick questions and we'll point you to the right commission, with your answers carried into the quote form." />
          <div className="mt-10">
            <Planner />
          </div>
        </div>
      </section>

      <section aria-labelledby="why" className="container-x py-16 sm:py-24">
        <SectionHeading id="why" eyebrow="Why commission with us" title="How we work with you" />
        <WhyUs />
      </section>

      <section aria-labelledby="reviews" className="bg-mint-wash py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading id="reviews" eyebrow="From our clients" title="Suits out in the world" />
          <Reviews />
        </div>
      </section>

      <section aria-labelledby="faq" className="container-x py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="faq" eyebrow="FAQ" title="Questions before you commission" lede={<>Can't find your answer? <Link href="/contact-us/" className="link">Send us a message</Link>.</>} />
          <FaqList faqs={generalFaqs} />
        </div>
      </section>

      <FinalCta />
    </>
  );
}
