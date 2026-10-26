import Link from "next/link";
import { categories, categoryName } from "@/lib/products";

export default function ShopNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Product categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      <Link href="/shop/" aria-current={!active ? "page" : undefined} className={`btn-sm btn shrink-0 border-2 ${!active ? "border-forest bg-forest text-white" : "border-forest/15 bg-white text-forest hover:border-forest/40"}`}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/product-category/${c.slug}/`}
          aria-current={active === c.slug ? "page" : undefined}
          className={`btn-sm btn shrink-0 border-2 ${active === c.slug ? "border-forest bg-forest text-white" : "border-forest/15 bg-white text-forest hover:border-forest/40"}`}
        >
          {categoryName(c.slug)}
        </Link>
      ))}
    </nav>
  );
}
