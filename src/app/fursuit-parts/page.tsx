import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import CommissionOptions from "@/components/CommissionOptions";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { pageMeta } from "@/lib/seo";
import type { Faq } from "@/content/faqs";
import CmsFormForPage from "@/components/cms/CmsFormForPage";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getPlacementItems } from "@/lib/gallery-placements";
import { commissionOptions } from "@/content/site";

// Keywords (volume/KD): fursuit paws 1300/27, fursuit hand paws 720/4, feet paws fursuit 480/25,
// fursuit feet paws 320/22, fursuit paw 210/25, fursuit tail 720/26, tails fursuit 480/16, fursuit tails 170/25.
const price = (key: string) => `$${commissionOptions.find((o) => o.key === key)!.from}`;
const hands = price("hand-paws"), feet = price("feet-paws"), tail = price("tail");

export const metadata = pageMeta({
  title: "Custom Fursuit Paws, Feet Paws & Fursuit Tails",
  description: `Custom fursuit paws and fursuit tails made to order: fursuit hand paws from ${hands}, feet paws from ${feet} and fursuit tails from ${tail}, matched to your character.`,
  path: "/fursuit-parts/",
});

const faqs: Faq[] = [
  {
    q: "What fursuit paws can you make?",
    a: "Fursuit hand paws and fursuit feet paws in your character's colours, from slim fursuit paws to chunky Toony paws, with paw pads and claws to match your ref sheet. Black, white, brown or bright yellow fursuit paws: we match the art.",
  },
  {
    q: "What's the difference between fursuit hand paws and feet paws?",
    a: `Fursuit hand paws are worn like gloves and start from ${hands}. Fursuit feet paws go over your feet with indoor or outdoor soles and start from ${feet}. Order both for a matching set of fursuit paws.`,
  },
  {
    q: "What fursuit tails do you make?",
    a: `Any fursuit tail on your ref sheet, from ${tail}: cat tails, dragon tails, shark tails, bunny tails and short nub tails, each fursuit tail with a belt loop or clip attachment.`,
  },
  {
    q: "Can I commission just one part?",
    a: "Yes. You can ask for an individual head, paws, feet paws, tail or another character-matched part.",
  },
  {
    q: "Can you match parts to a suit I already own?",
    a: "Send photos of your suit and your reference sheet with a quote request and we'll let you know what we can match.",
    link: { href: "/get-a-quote/?coverage=parts", label: "Request a parts quote" },
  },
  {
    q: "Can I use a payment plan for parts?",
    a: "Orders under $500 are paid in full upfront, so most single parts are paid in one go. Larger part bundles over $500 start with an upfront payment, with the balance due before shipping.",
    link: { href: "/payment-plans/", label: "How payments work" },
  },
];

export default async function PartsPage() {
  // Shown only when an admin gallery is assigned to the Parts page.
  const recentParts = await getPlacementItems("parts");
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Fursuit Parts", path: "/fursuit-parts/" }]}
        eyebrow="Fursuit parts"
        title="Custom Fursuit Paws & Fursuit Tails"
        lede={`Custom fursuit paws and fursuit tails made to match your character: fursuit hand paws from ${hands}, fursuit feet paws from ${feet} and fursuit tails from ${tail}. Complete a partial, refresh an older suit or start small with fursuit parts.`}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/get-a-quote/?coverage=parts" className="btn-primary">
            Request a Custom Quote
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="mto" className="container-x py-16 sm:py-20">
        <SectionHeading id="mto" eyebrow="Made to order" title="Custom parts for your character" lede="Any starting prices shown are confirmed in your quote before you pay." />
        <CommissionOptions keys={["hand-paws", "feet-paws", "tail", "head", "neon"]} />
      </section>

      <section aria-labelledby="paws-tails" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="paws-tails" className="text-3xl font-bold">Fursuit paws</h2>
            <p className="mt-4 text-lg text-ink-muted">
              Every pair of fursuit paws is made to order. Fursuit hand paws come with paw pads and optional claws, and fursuit feet paws are sized to your feet with
              indoor or outdoor soles. Add fursuit paws to a fursuit head for a quick character look, or match new paws to a suit you already own.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Fursuit tails</h2>
            <p className="mt-4 text-lg text-ink-muted">
              A fursuit tail finishes the character. We make fursuit tails in any shape, length and marking, from fluffy fox and cat tails to dragon, shark and nub
              tails, each with a belt loop or clip attachment.
            </p>
          </div>
        </div>
      </section>

      {recentParts ? (
        <section aria-labelledby="recent-parts" className="bg-mint-wash py-16 sm:py-20">
          <div className="container-x">
            <SectionHeading id="recent-parts" eyebrow="From the workshop" title="Recent parts" mark="Recent" />
            <div className="mt-10">
              <PortfolioGrid items={recentParts} />
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="parts-faq" className="container-x py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="parts-faq" eyebrow="FAQ" title="About parts" />
          <FaqList faqs={faqs} />
        </div>
      </section>
      <CmsFormForPage pagePath="/fursuit-parts/" />
      <FinalCta />
    </>
  );
}
