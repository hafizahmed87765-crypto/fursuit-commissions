import Image from "next/image";
import Link from "next/link";
import { commissionOptions } from "@/content/site";
import { getSiteImages, optionSlots } from "@/lib/site-images";
const formatPrice = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

export default async function CommissionOptions({ limit, keys }: { limit?: number; keys?: string[] }) {
  const images = await getSiteImages();
  const picked = keys ? keys.map((k) => commissionOptions.find((o) => o.key === k)).filter((o) => o !== undefined) : [...commissionOptions];
  const list = limit ? picked.slice(0, limit) : picked;
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((o, i) => {
        const href = "href" in o ? o.href : `/get-a-quote/?coverage=${o.key === "fullsuit" || o.key === "partial" || o.key === "head" ? o.key : "parts"}`;
        return (
          <li key={o.key} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}>
            <Link href={href} className="group flex h-full gap-4 rounded-blob bg-white p-4 shadow-card ring-1 ring-forest/5 transition hover:shadow-lift motion-safe:hover:-translate-y-0.5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black sm:h-28 sm:w-28">
                <Image src={images[optionSlots[o.key]]?.src ?? o.image} alt="" fill sizes="112px" className="img-zoom object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="text-xl font-semibold">{o.title}</h3>
                <p className="mt-1 flex-1 text-sm text-ink-muted">{o.blurb}</p>
                <p className="mt-2 text-sm font-semibold text-forest">
                  {o.from ? (
                    <>
                      From {formatPrice(o.from)} <span className="font-normal text-ink-muted">· final quote depends on design</span>
                    </>
                  ) : (
                    <>Request a quote →</>
                  )}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
