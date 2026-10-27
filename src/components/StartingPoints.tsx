import Image from "next/image";
import Link from "next/link";
import { commissionOptions } from "@/content/site";
import Paw from "./Paw";
import { getSiteImages, optionSlots } from "@/lib/site-images";

const formatPrice = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
const byKey = (k: string) => commissionOptions.find((o) => o.key === k)!;

// Parts are summarised from the published "from" prices, so they stay in sync with site.ts.
const parts = commissionOptions.filter((o) => o.from !== null);
const partsFrom = Math.min(...parts.map((o) => o.from as number));

const cards = [
  { ...byKey("head"), title: "Fursuit head", href: "/get-a-quote/?coverage=head", tint: "bg-mint-wash", price: "Quoted to your design", cta: "Get a quote" },
  { ...byKey("partial"), title: "Partial", href: "/get-a-quote/?coverage=partial", tint: "bg-lavender-soft", price: "Quoted to your design", cta: "Get a quote" },
  { ...byKey("fullsuit"), title: "Fullsuit", href: "/get-a-quote/?coverage=fullsuit", tint: "bg-petal", price: "Quoted to your design", cta: "Get a quote" },
  {
    ...byKey("hand-paws"),
    title: "Parts",
    blurb: `${parts.slice(0, 3).map((p) => `${p.title.toLowerCase()} from ${formatPrice(p.from as number)}`).join(", ")}.`.replace(/^./, (c) => c.toUpperCase()),
    href: "/fursuit-parts/",
    tint: "bg-mint-light",
    price: `From ${formatPrice(partsFrom)}`,
    cta: "See all parts",
  },
];

/** "Pick a starting point" coverage cards: the four ways to commission. */
export default async function StartingPoints() {
  const images = await getSiteImages();
  return (
    <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <li key={c.key} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
          <Link href={c.href} className={`group toon toon-hover relative flex h-full flex-col p-3 ${c.tint}`}>
            <span className={`sticker absolute -right-3 -top-4 z-10 text-xs ${i % 2 ? "rotate-6" : "-rotate-6"}`}>{c.price}</span>
            <div className="relative aspect-square overflow-hidden rounded-[1.4rem] border-[3px] border-forest bg-black">
              <Image src={images[optionSlots[c.key]]?.src ?? c.image} alt="" fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw" className="img-zoom object-cover" />
            </div>
            <div className="flex flex-1 flex-col px-2.5 pb-2 pt-4">
              <h3 className="text-2xl font-bold">{c.title}</h3>
              <p className="mt-1.5 flex-1 text-[0.95rem] leading-relaxed text-ink-muted">{c.blurb}</p>
              <p className="mt-4 flex items-center justify-between font-display font-bold text-forest">
                <span className="flex items-center gap-1.5">
                  <Paw className="h-4 w-4 text-mint-deep" />
                  {c.cta}
                </span>
                <span aria-hidden className="transition-transform duration-300 ease-smooth group-hover:translate-x-1.5">→</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
