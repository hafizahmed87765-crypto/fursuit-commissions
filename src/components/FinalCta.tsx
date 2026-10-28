import Image from "next/image";
import Link from "next/link";
import Paw from "./Paw";

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="container-x pb-16 pt-24 sm:pb-24 sm:pt-32">
      <div data-reveal className="toon relative bg-mint px-6 py-12 sm:px-12 sm:py-16">
        <div className="bg-paws absolute inset-0 rounded-[1.8rem]" aria-hidden />
        {/* Studio mascot standing in the empty right side of the panel, popping out of the top edge.
            Only on large screens, where the text column leaves room for it. Lazy-loaded (below the fold). */}
        <div aria-hidden className="pointer-events-none absolute -top-20 right-4 hidden items-start gap-1 lg:flex xl:right-12">
          <span className="sticker mt-20 hidden rounded-2xl rounded-br-none bg-white text-base motion-safe:animate-wiggle xl:inline-flex">Can&apos;t wait to meet your sona!</span>
          <Image
            src="/brand/mascot.webp"
            alt=""
            width={583}
            height={900}
            sizes="(min-width: 1280px) 288px, 208px"
            className="h-auto w-52 xl:w-72 drop-shadow-[5px_5px_0_rgba(33,70,63,0.35)] motion-safe:[.is-visible_&]:animate-float"
          />
        </div>
        <div className="relative max-w-2xl lg:max-w-[34rem] xl:max-w-2xl">
          <p className="eyebrow !text-forest">
            <Paw className="h-4 w-4" />
            Your turn
          </p>
          <h2 id="final-cta" className="h-section mt-2">
            Ready to meet your character <span className="marker !bg-[linear-gradient(transparent_56%,#fff_56%,#fff_90%,transparent_90%)]">in fur?</span>
          </h2>
          <p className="mt-4 max-w-xl text-lg text-forest">
            Tell us about your design and get a free, no-obligation quote. Already own a suit that needs some love? Send photos for a repair assessment.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/get-a-quote/" className="btn-primary">
              Start Your Commission
            </Link>
            <Link href="/fursuit-repairs/#repair-form" className="btn-secondary">
              Request a Repair Assessment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
