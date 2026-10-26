import Image from "next/image";
import Link from "next/link";
import { repairServices } from "@/content/site";

export default function RepairTeaser() {
  return (
    <section aria-labelledby="repairs-title" className="bg-forest text-white">
      <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div data-reveal className="grid grid-cols-2 gap-3 sm:gap-4">
          <Image src="/media/gallery/o1cn016idzzr1cnobaqlqwi-4611686018427385509-0-am-f82eb1.webp" alt="Tape pattern over a foam fursuit head base" width={1600} height={1600} sizes="(min-width:1024px) 25vw, 50vw" className="aspect-square rounded-blob object-cover" />
          <Image src="/media/gallery/o1cn01dgqmih1cnoblos5ug-4611686018427385509-0-am-9ac3b9.webp" alt="Faux fur pieces cut from a pattern on the workbench" width={1200} height={1600} sizes="(min-width:1024px) 25vw, 50vw" className="mt-8 aspect-square rounded-blob object-cover" />
        </div>
        <div data-reveal>
          <p className="eyebrow !text-mint">Repairs &amp; refurbishment</p>
          <h2 id="repairs-title" className="h-section mt-2 !text-white">
            Give a well-loved suit its bounce back
          </h2>
          <p className="mt-4 text-lg text-mint-light">
            Send us photos of the damage and we'll assess what can be done, by the same hands that pattern and sew our commissions. Every request starts with an honest assessment, not a promise.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {repairServices.map((r) => (
              <li key={r.title} className="rounded-2xl bg-white/10 p-4">
                <span className="block font-display font-semibold text-white">{r.title}</span>
                <span className="block text-sm text-mint-light">{r.body}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/fursuit-repairs/#repair-form" className="btn bg-mint text-forest hover:bg-mint-light">
              Request a Repair Assessment
            </Link>
            <Link href="/fursuit-repairs/" className="btn border-2 border-white/40 text-white hover:bg-white/10">
              How repairs work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
