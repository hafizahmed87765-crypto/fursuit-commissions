import Image from "next/image";
import Link from "next/link";

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta" className="container-x py-16 sm:py-24">
      <div data-reveal className="relative overflow-hidden rounded-blob bg-mint px-6 py-12 sm:px-12 sm:py-16">
        <div className="bg-paws absolute inset-0" aria-hidden />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="final-cta" className="h-section">
              Ready to meet your character in fur?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-forest">
              Tell us about your design and get a free, no-obligation quote. Already own a suit that needs some love? Send photos for a repair assessment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/get-a-quote/" className="btn-primary">
                Start Your Commission
              </Link>
              <Link href="/fursuit-repairs/#repair-form" className="btn-secondary">
                Request a Repair Assessment
              </Link>
            </div>
          </div>
          <Image
            src="/brand/logo.webp"
            alt=""
            width={426}
            height={399}
            sizes="(min-width: 1024px) 320px, 0px"
            className="hidden w-full max-w-xs justify-self-center drop-shadow-xl lg:block"
          />
        </div>
      </div>
    </section>
  );
}
