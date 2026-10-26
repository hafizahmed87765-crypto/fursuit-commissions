import Image from "next/image";
import Link from "next/link";
import { formatPrice, hasPrice, type Product } from "@/lib/products";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const img = p.images[0];
  const variable = p.variations.length > 0;
  return (
    <Link href={`/product/${p.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-blob bg-white shadow-card ring-1 ring-forest/5 transition hover:shadow-lift motion-safe:hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-black">
        {img ? (
          <Image src={img.src} alt={img.alt || p.name} width={img.width} height={img.height} priority={priority} sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : null}
        {p.quoteOnly ? <span className="chip absolute left-3 top-3">Made to order</span> : null}
        {!p.inStock ? <span className="chip absolute left-3 top-3 bg-blush">Out of stock</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-forest">{p.name}</h3>
        <p className="mt-auto pt-2 font-semibold text-forest">
          {hasPrice(p) ? (
            <>
              {p.quoteOnly || variable ? <span className="font-normal text-ink-muted">From </span> : null}
              {formatPrice(p.price, p.currency)}
            </>
          ) : (
            <span className="text-ink-muted">Ask for price</span>
          )}
        </p>
      </div>
    </Link>
  );
}
