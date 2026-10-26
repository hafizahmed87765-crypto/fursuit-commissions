import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import CommissionOptions from "@/components/CommissionOptions";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { pageMeta } from "@/lib/seo";
import type { Faq } from "@/content/faqs";
import CmsFormForPage from "@/components/cms/CmsFormForPage";

export const metadata = pageMeta({
  title: "Fursuit Parts: Paws, Tails, Heads & Ears",
  description: "Custom made-to-order fursuit hand paws, feet paws, tails and other parts, built to match your character.",
  path: "/fursuit-parts/",
});

const faqs: Faq[] = [
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

export default function PartsPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Fursuit Parts", path: "/fursuit-parts/" }]}
        eyebrow="Fursuit parts"
        title="Paws, tails & finishing touches"
        lede="Complete a partial, refresh an older suit or start small with custom parts made to match your character."
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
