import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import Paw, { PawTrail } from "./Paw";
import { getSiteImages } from "@/lib/site-images";

const statusLabel = { open: "Commissions open!", closed: "Commissions closed", waitlist: "Waitlist open" } as const;

// Ref-sheet notes describe the H1 photo (neon wolf fullsuit). Update them if H1 is replaced.
const notes = ["Mismatched X and ! eyes", "Neon belly and leg swirls", "Clawed blue paws"];
const palette = [
  { name: "Violet", hex: "#6A2FC2" },
  { name: "Lime", hex: "#5FE04A" },
  { name: "Sunshine", hex: "#F6D23A" },
  { name: "Royal blue", hex: "#1E5BD8" },
  { name: "Eye red", hex: "#D8323C" },
];

export default async function Hero() {
  const { H1, H2, H3 } = await getSiteImages();
  const a = site.announcement;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-mint-wash">
      <div className="bg-paws absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-14 pb-24 pt-12 sm:pt-16 lg:grid-cols-[1fr_1.02fr] lg:gap-12 lg:pb-28 lg:pt-20">
        <div>
          {a.enabled ? (
            <div className="animate-rise">
            <p className="sticker -rotate-2">
              <span aria-hidden className={`h-2.5 w-2.5 rounded-full motion-safe:animate-soft-pulse ${a.status === "closed" ? "bg-forest/40" : "bg-mint-deep"}`} />
              {statusLabel[a.status]}
            </p>
            </div>
          ) : null}
          <p className="eyebrow mt-6 animate-rise [animation-delay:60ms]">Fursuit commissions · Custom furry costumes</p>
          <h1 id="hero-title" className="mt-3 animate-rise text-[2.8rem] font-bold leading-[1.02] tracking-tight [animation-delay:120ms] sm:text-6xl lg:text-[5rem]">
            Your character, <span className="marker whitespace-nowrap">brought to life.</span>
          </h1>
          <p className="lede mt-6 max-w-xl animate-rise text-ink [animation-delay:200ms]">
            Custom fursuits and furry costumes crafted around your character, your style and your vision. Heads, partials and fullsuits from a handmade fursuit maker, plus repairs for the suits you already love.
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-4 [animation-delay:280ms] sm:flex-row">
            <Link href="/get-a-quote/" className="btn-primary px-7 py-3 text-[1.05rem]">
              Start Your Commission <span aria-hidden>→</span>
            </Link>
            <Link href="/gallery/" className="btn-secondary px-7 py-3 text-[1.05rem]">
              Explore Our Work
            </Link>
          </div>
          <p className="mt-5 flex animate-rise items-center gap-2 text-sm text-ink-muted [animation-delay:340ms]">
            <Paw className="h-4 w-4 text-mint-deep" />
            Free quotes · No commitment until you approve your quote
          </p>
        </div>

        {/* Character reference sheet */}
        <div className="relative mx-auto w-full max-w-xl animate-reveal [animation-delay:200ms]">
          <span className="sticker absolute -left-3 -top-5 z-20 -rotate-6 bg-lavender motion-safe:animate-wiggle sm:-left-8">Made from YOUR ref sheet</span>
          <figure className="toon relative p-4 sm:p-5 lg:rotate-[1.5deg]">
            <figcaption className="flex items-center justify-between gap-3 border-b-[3px] border-dashed border-forest/25 pb-3">
              <span className="font-display text-lg font-bold uppercase tracking-[0.18em] text-forest">Ref sheet</span>
              <span className="flex gap-1.5">
                <span className="chip bg-lavender-soft">Toony</span>
                <span className="chip">Fullsuit</span>
              </span>
            </figcaption>
            <div className="mt-4 grid gap-4 sm:grid-cols-[1.35fr_1fr]">
              <div className="group relative overflow-hidden rounded-2xl border-[3px] border-forest bg-black">
                <Image
                  src={H1.src}
                  alt={H1.alt}
                  width={H1.width}
                  height={H1.height}
                  priority
                  sizes="(min-width: 1024px) 320px, 55vw"
                  className="img-zoom aspect-[4/5] h-full w-full object-cover object-[50%_20%]"
                />
                <span className="absolute bottom-2 left-2 rounded-full border-2 border-forest bg-white px-2.5 py-0.5 font-display text-xs font-bold text-forest">Neon wolf fullsuit</span>
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-mint-deep">Notes</p>
                  <ul className="mt-2 space-y-1.5">
                    {notes.map((n) => (
                      <li key={n} className="flex items-start gap-1.5 font-display text-[0.95rem] font-semibold leading-tight text-forest">
                        <Paw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint-deep" />
                        {n}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-mint-deep">Palette</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {palette.map((c) => (
                      <li key={c.hex} title={c.name} className="h-7 w-7 rounded-full border-[3px] border-forest" style={{ backgroundColor: c.hex }}>
                        <span className="sr-only">{c.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-mint-deep">More sonas</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Image src={H2.src} alt={H2.alt} width={H2.width} height={H2.height} sizes="90px" className="aspect-square rounded-xl border-2 border-forest object-cover object-[50%_20%]" />
                    <Image src={H3.src} alt={H3.alt} width={H3.width} height={H3.height} sizes="90px" className="aspect-square rounded-xl border-2 border-forest object-cover object-[50%_35%]" />
                  </div>
                </div>
              </div>
            </div>
            <Link href="/get-a-quote/" className="group mt-4 flex items-center justify-between rounded-2xl bg-mint-light px-4 py-3 font-display font-bold text-forest transition hover:bg-mint">
              Your character could be next
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </figure>
        </div>
      </div>
      <PawTrail className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-forest/20 md:flex" count={11} />
    </section>
  );
}
