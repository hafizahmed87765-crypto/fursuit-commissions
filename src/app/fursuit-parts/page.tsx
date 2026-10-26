import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import CommissionOptions from "@/components/CommissionOptions";
import ProductCard from "@/components/ProductCard";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { categoryName, hasPrice, shopProducts } from "@/lib/products";
import { pageMeta } from "@/lib/seo";
import type { Faq } from "@/content/faqs";

export const metadata = pageMeta({
  title: "Fursuit Parts: Paws, Tails, Heads & Ears",
  description: "Custom made-to-order fursuit hand paws, feet paws and tails, plus ready-made heads, partial sets, paws, ears and tails from our shop.",
  path: "/fursuit-parts/",
});

const PART_CATEGORIES = ["heads-and-partials", "partials", "hand-and-feet-paws", "ear-and-tails"];

const faqs: Faq[] = [
  {
    q: "What's the difference between made-to-order and ready-made parts?",
    a: "Made-to-order parts are built from your reference sheet in your character's colours and quoted before you pay. Ready-made parts are finished designs you can buy straight from the shop.",
  },
  {
    q: "Can you match parts to a suit I already own?",
    a: "Send photos of your suit and your reference sheet with a quote request and we'll let you know what we can match.",
    link: { href: "/get-a-quote/?coverage=parts", label: "Request a parts quote" },
  },
  {
    q: "Can I use a payment plan for parts?",
    a: "Orders under $500 are paid in full upfront, so most single parts are paid in one go. Larger part bundles over $500 follow the 50% deposit rule.",
    link: { href: "/payment-plans/", label: "How payments work" },
  },
];

export default function PartsPage() {
  const groups = PART_CATEGORIES.map((slug) => ({ slug, items: shopProducts.filter((p) => hasPrice(p) && p.categories.some((c) => c.slug === slug)) })).filter((g) => g.items.length);
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Fursuit Parts", path: "/fursuit-parts/" }]}
        eyebrow="Fursuit parts"
        title="Paws, tails & finishing touches"
        lede="Complete a partial, refresh an older suit or start small. Commission parts made to your character, or pick a ready-made piece from the shop."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/get-a-quote/?coverage=parts" className="btn-primary">
            Request a Custom Quote
          </Link>
          <Link href="#ready-made" className="btn-secondary">
            Shop ready-made parts
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="mto" className="container-x py-16 sm:py-20">
        <SectionHeading id="mto" eyebrow="Made to order" title="Custom parts for your character" lede="Starting prices are from our current listings; your final price is confirmed in your quote before you pay." />
        <CommissionOptions keys={["hand-paws", "feet-paws", "tail", "head", "neon"]} />
      </section>

      <section id="ready-made" aria-labelledby="rm" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="rm" eyebrow="Ready-made" title="Order today from the shop" />
          {groups.map((g) => (
            <div key={g.slug} className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <h3 className="text-2xl font-semibold">{categoryName(g.slug)}</h3>
                <Link href={`/product-category/${g.slug}/`} className="link shrink-0 text-sm">
                  View all
                </Link>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.slice(0, 4).map((p) => (
                  <li key={p.id}>
                    <ProductCard p={p} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="parts-faq" className="container-x py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="parts-faq" eyebrow="FAQ" title="About parts" />
          <FaqList faqs={faqs} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
