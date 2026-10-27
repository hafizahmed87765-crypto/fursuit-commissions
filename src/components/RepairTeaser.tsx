import Image from "next/image";
import Link from "next/link";
import { repairServices } from "@/content/site";
import { getSiteImages } from "@/lib/site-images";

export default async function RepairTeaser() {
  const { H7, H8 } = await getSiteImages();
  return (
    <section aria-labelledby="repairs-title" className="bg-forest text-white">
      <div className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div data-reveal className="grid grid-cols-2 gap-3 sm:gap-4">
          <Image src={H7.src} alt={H7.alt} width={H7.width} height={H7.height} sizes="(min-width:1024px) 25vw, 50vw" className="aspect-square rounded-blob border-[3px] border-mint object-cover" />
          <Image src={H8.src} alt={H8.alt} width={H8.width} height={H8.height} sizes="(min-width:1024px) 25vw, 50vw" className="mt-8 aspect-square rotate-2 rounded-blob border-[3px] border-mint object-cover" />
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
            <Link href="/fursuit-repairs/#repair-form" className="btn border-mint bg-mint text-forest hover:bg-mint-light">
              Request a Repair Assessment
            </Link>
            <Link href="/fursuit-repairs/" className="btn border-white/50 text-white hover:bg-white/10">
              How repairs work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
