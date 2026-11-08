import Image from "next/image";
import Link from "next/link";
import Paw from "./Paw";
import { coverageLabels, instalmentSteps, pricePlans, supportPromises } from "@/content/pricing";

const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** Price plans as cards with a coverage figure: what each package covers and its starting price. */
export function PricePlanTable() {
  return (
    <>
      <ul className="mt-12 grid gap-6 pt-3 sm:grid-cols-2 xl:grid-cols-4">
        {pricePlans.map((p, i) => {
          const featured = p.badge === "Most popular";
          return (
            <li key={p.key} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="h-full">
              <article className={`group relative flex h-full flex-col overflow-hidden rounded-blob border-[3px] bg-white transition duration-300 ease-smooth motion-safe:hover:-translate-y-1 ${featured ? "border-forest shadow-toon" : "border-forest/15 shadow-card hover:border-forest/40"}`}>
                <div className={`relative px-6 pb-5 pt-10 ${featured ? "bg-mint-light" : "bg-mint-wash"}`}>
                  <Image src={`/brand/coverage-${p.key}.webp`} alt={`${p.title} coverage: ${p.parts.map((x) => coverageLabels[x].toLowerCase()).join(", ")} filled in`} width={376} height={640} sizes="(min-width: 640px) 150px, 140px" className="mx-auto h-56 w-auto transition-transform duration-500 ease-smooth group-hover:scale-105" />
                  {p.badge ? (
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${featured ? "bg-forest text-white" : "border-2 border-forest/20 bg-white text-forest"}`}>{p.badge}</span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-bold text-forest">{p.title}</h3>
                  <p className="mt-1 text-ink-muted">{p.tagline}</p>
                  <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold uppercase tracking-wider text-ink-muted">From</span>
                    <span className="font-display text-4xl font-bold text-forest">{usd(p.from)}</span>
                  </p>
                  <ul className="mt-5 space-y-2 border-t-2 border-dashed border-forest/15 pt-5 text-[0.95rem] text-ink">
                    {p.includes.map((x) => (
                      <li key={x} className="flex items-start gap-2.5">
                        <Paw className="mt-0.5 h-4 w-4 shrink-0 text-mint-deep" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link href={`/get-a-quote/?coverage=${p.coverage}`} className={`btn-sm w-full justify-center ${featured ? "btn-primary" : "btn-secondary"}`}>
                      Get a {p.title.toLowerCase()} quote
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink-muted" data-reveal>
        Prices in USD for a standard build. Extra markings, hair, horns and digitigrade padding are added in your free quote, which confirms the final price before you pay anything.
      </p>
    </>
  );
}

/** 12-hour support, fast quote and instalment promises. */
export function SupportPromise({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-3 ${className}`}>
      {supportPromises.map((s, i) => (
        <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="flex gap-3 rounded-2xl border-[3px] border-forest bg-white p-5 shadow-toon-sm">
          <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint font-display text-lg font-bold text-forest">{i + 1}</span>
          <span>
            <span className="block font-display text-lg font-bold text-forest">{s.title}</span>
            <span className="mt-1 block text-sm text-ink-muted">{s.body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** How an instalment plan works, step by step. */
export function InstalmentStructure() {
  return (
    <ol className="mt-8 grid gap-5 md:grid-cols-3">
      {instalmentSteps.map((s, i) => (
        <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="toon relative p-6">
          <span className="sticker absolute -top-4 left-5 bg-lavender text-sm">Step {i + 1}</span>
          <h3 className="mt-2 font-display text-xl font-bold">{s.title}</h3>
          <p className="mt-2 text-ink-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
