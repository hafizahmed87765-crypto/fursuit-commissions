import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-mint-wash">
      <div className="bg-paws absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
        <div className="animate-rise">
          <p className="eyebrow">Custom fursuits · Kemono · Toony · Repairs</p>
          <h1 id="hero-title" className="mt-3 text-[2.6rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Your character, <span className="relative whitespace-nowrap text-forest">brought to life.</span>
          </h1>
          <p className="lede mt-5 max-w-xl text-ink">
            Custom fursuits crafted around your character, your style and your vision. Heads, partials and fullsuits, with repair and refurbishment for the suits you already love.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-a-quote/" className="btn-primary">
              Start Your Commission
            </Link>
            <Link href="/gallery/" className="btn-secondary">
              Explore Our Work
            </Link>
          </div>
          <p className="mt-5 text-sm text-ink-muted">Free quotes · No commitment until you approve your quote</p>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl grid-cols-5 grid-rows-6 gap-3 sm:gap-4" style={{ aspectRatio: "1 / 1" }}>
          <figure className="col-span-3 row-span-6 overflow-hidden rounded-blob bg-black shadow-lift animate-reveal">
            <Image
              src="/media/products/whatsapp-image-2025-12-14-at-12-27-58-pm-f42ae7.webp"
              alt="Kemono-style calico cat fursuit head with large blue anime eyes"
              width={1280}
              height={1262}
              priority
              sizes="(min-width: 1024px) 340px, 60vw"
              className="h-full w-full object-cover object-[50%_30%]"
            />
          </figure>
          <figure className="col-span-2 row-span-3 overflow-hidden rounded-blob bg-black shadow-card animate-reveal [animation-delay:120ms]">
            <Image
              src="/media/products/lfe5pajuqfcifzotlhynlq-2k-bc84e0.webp"
              alt="Mint and pastel pink Kemono bunny suit with big green eyes"
              width={1024}
              height={1024}
              sizes="(min-width: 1024px) 220px, 38vw"
              className="h-full w-full object-cover object-[50%_20%]"
            />
          </figure>
          <figure className="col-span-2 row-span-3 overflow-hidden rounded-blob bg-black shadow-card animate-reveal [animation-delay:240ms]">
            <Image
              src="/media/gallery/o1cn01pcmuzy1cnocobexva-4611686018427385509-0-am-7fa10f.webp"
              alt="Toony purple and turquoise horned dragon fursuit head on a stand"
              width={1200}
              height={1600}
              sizes="(min-width: 1024px) 220px, 38vw"
              className="h-full w-full object-cover object-[50%_35%]"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
