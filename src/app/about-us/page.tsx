import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import WhyUs from "@/components/WhyUs";
import FinalCta from "@/components/FinalCta";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Our Fursuit Studio",
  description: "FursuitCommissions.com is a maker studio for custom fursuits, Kemono and Toony suits, fursuit parts and repairs, built from scratch and made to order.",
  path: "/about-us/",
});

// Copy adapted from the studio's own About page (spam-free sections only).
const crafts = [
  { title: "Custom fursuits", body: "Fullsuits, partials and fursuit heads, foam-carved and hand-sewn to your reference.", href: "/fursuit-commission/" },
  { title: "Kemono & Toony", body: "Anime-inspired Kemono faces or bold, expressive Toony characters, built around your design.", href: "/kemono-fursuits/" },
  { title: "Parts & repairs", body: "Paws, tails and finishing touches, plus repair assessments for suits that need some love.", href: "/fursuit-parts/" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "About", path: "/about-us/" }]}
        eyebrow="About us"
        title="We don't just make suits. We bring characters to life."
        lede="FursuitCommissions.com is a maker studio specialising in custom fursuits: built from scratch, made to order and crafted with real care."
      />
      <section aria-labelledby="story" className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div data-reveal>
          <SectionHeading id="story" eyebrow="The studio behind every stitch" title="A studio that actually listens" />
          <div className="mt-5 space-y-4 text-lg text-ink-muted">
            <p>We started because we believed the furry community deserved a maker studio that takes your reference seriously, keeps you updated through every stage, and delivers something you're genuinely proud to wear or display.</p>
            <p>Every piece that leaves our workshop is handmade by our team. Your order gets individual attention from first quote to final delivery.</p>
          </div>
        </div>
        <div data-reveal className="grid grid-cols-2 gap-3">
          <Image src="/media/gallery/o1cn01lptcuc1cnobh57si4-4611686018427385509-0-am-6ca55d.webp" alt="Orange tiger bodysuit in progress on a dress form" width={1200} height={1600} sizes="(min-width:1024px) 25vw, 50vw" className="aspect-[3/4] rounded-blob object-cover" />
          <Image src="/media/gallery/o1cn01dgqmih1cnoblos5ug-4611686018427385509-0-am-9ac3b9.webp" alt="Faux fur pieces cut from a pattern on the workbench" width={1200} height={1600} sizes="(min-width:1024px) 25vw, 50vw" className="mt-10 aspect-[3/4] rounded-blob object-cover" />
        </div>
      </section>

      <section aria-labelledby="crafts" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="crafts" eyebrow="What we make" title="Everything for your fursuit, one studio" />
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {crafts.map((c) => (
              <li key={c.title} data-reveal>
                <Link href={c.href} className="card card-hover block h-full p-6">
                  <h3 className="text-2xl font-semibold">{c.title}</h3>
                  <p className="mt-2 text-ink-muted">{c.body}</p>
                  <span className="mt-4 inline-block font-display font-semibold text-forest">Learn more →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="why" className="container-x py-16 sm:py-20">
        <SectionHeading id="why" eyebrow="What makes us different" title="How we work with you" />
        <WhyUs />
      </section>
      <FinalCta />
    </>
  );
}
