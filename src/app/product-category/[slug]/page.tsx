import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ProductCard from "@/components/ProductCard";
import ShopNav from "@/components/ShopNav";
import { categories, categoryName, products } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = categoryName(slug);
  return pageMeta({ title: `${name} | Shop`, description: `Shop ${name.toLowerCase()} from FursuitCommissions.com. Worldwide shipping, or commission a custom piece.`, path: `/product-category/${slug}/` });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const items = products.filter((p) => p.categories.some((c) => c.slug === slug));
  if (!items.length) notFound();
  const name = categoryName(slug);
  return (
    <>
      <PageIntro crumbs={[{ name: "Shop", path: "/shop/" }, { name, path: `/product-category/${slug}/` }]} eyebrow="Shop" title={name} />
      <section aria-label={`${name} products`} className="container-x py-10 sm:py-14">
        <ShopNav active={slug} />
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
