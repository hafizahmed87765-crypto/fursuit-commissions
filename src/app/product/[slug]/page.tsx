import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import BuyBox from "@/components/BuyBox";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { site } from "@/content/site";
import { categoryName, getProduct, hasPrice, products, relatedProducts } from "@/lib/products";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const plain = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const desc = plain(p.shortDescription || p.description).slice(0, 155) || `${p.name} from FursuitCommissions.com.`;
  return pageMeta({ title: p.name.split(" – ")[0], description: desc, path: `/product/${p.slug}/`, image: p.images[0]?.src });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = p.categories.find((c) => c.slug !== "uncategorized");
  const related = relatedProducts(p);
  const isHeadish = p.categories.some((c) => ["heads-and-partials", "masks", "partials"].includes(c.slug));

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => `${site.url}${i.src}`),
    description: plain(p.shortDescription || p.description).slice(0, 500),
    brand: { "@type": "Brand", name: site.name },
    ...(hasPrice(p) && !p.quoteOnly
      ? {
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: p.currency,
            availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${site.url}/product/${p.slug}/`,
          },
        }
      : {}),
  };

  return (
    <>
      <div className="container-x py-6">
        <Breadcrumbs items={[{ name: "Shop", path: "/shop/" }, ...(cat ? [{ name: categoryName(cat.slug), path: `/product-category/${cat.slug}/` }] : []), { name: p.name.split(" – ")[0], path: `/product/${p.slug}/` }]} />
      </div>
      <section className="container-x grid grid-cols-1 gap-10 pb-16 lg:grid-cols-2 [&>*]:min-w-0">
        <ProductGallery images={p.images} name={p.name} />
        <div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{p.name}</h1>
          {p.shortDescription ? <div className="prose-content mt-4 text-ink-muted" dangerouslySetInnerHTML={{ __html: p.shortDescription }} /> : null}
          <div className="mt-6">
            <BuyBox p={p} />
          </div>
          <div className="mt-8 rounded-2xl bg-lavender-soft p-5">
            <p className="font-display font-semibold text-forest">Want it in your character's colours?</p>
            <p className="mt-1 text-sm text-ink-muted">
              We build custom {isHeadish ? "heads, partials and fullsuits" : "paws, tails and parts"} to match your reference sheet.{" "}
              <Link href={isHeadish ? "/fursuit-commission/" : "/get-a-quote/?coverage=parts"} className="link">
                {isHeadish ? "Explore custom commissions" : "Request a custom quote"}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {p.description ? (
        <section aria-labelledby="desc" className="bg-mint-wash py-14">
          <div className="container-x max-w-3xl">
            <h2 id="desc" className="text-2xl font-semibold">
              Description
            </h2>
            <div className="prose-content mt-4 text-ink" dangerouslySetInnerHTML={{ __html: p.description }} />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section aria-labelledby="related" className="container-x py-14">
          <h2 id="related" className="text-2xl font-semibold">
            {isHeadish ? "Complete the look" : "You might also like"}
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <ProductCard p={r} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <JsonLd data={productLd} />
    </>
  );
}
