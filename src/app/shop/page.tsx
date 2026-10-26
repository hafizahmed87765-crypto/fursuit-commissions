import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import ProductCard from "@/components/ProductCard";
import ShopNav from "@/components/ShopNav";
import SectionHeading from "@/components/SectionHeading";
import { madeToOrder, shopProducts } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shop Fursuit Heads, Paws, Ears & Tails",
  description: "Shop ready-made fursuit heads, partial sets, paws, ears and tails, plus made-to-order custom paws, tails and neon signs. Worldwide shipping.",
  path: "/shop/",
});

export default function ShopPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Shop", path: "/shop/" }]}
        eyebrow="Shop"
        title="Heads, paws, ears & tails"
        lede={
          <>
            Ready-made pieces you can order today. Want something built around your own character?{" "}
            <Link href="/get-a-quote/" className="link">
              Request a custom quote
            </Link>
            .
          </>
        }
      />
      <section aria-label="Products" className="container-x py-10 sm:py-14">
        <ShopNav />
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shopProducts.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="mto" className="bg-mint-wash py-14">
        <div className="container-x">
          <SectionHeading id="mto" eyebrow="Made to order" title="Custom parts, quoted to your character" lede="These pieces are made to your design. Prices are starting points; we confirm your final price before you pay." />
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {madeToOrder.map((p) => (
              <li key={p.id}>
                <ProductCard p={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
