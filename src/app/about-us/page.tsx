import Image from "next/image";
import { getSiteImages } from "@/lib/site-images";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import WhyUs from "@/components/WhyUs";
import FinalCta from "@/components/FinalCta";
import { pageMeta } from "@/lib/seo";
import Paw from "@/components/Paw";
import { policies } from "@/content/site";
import { characters } from "@/lib/work";

const studio = [
  { src: "/media/work/fursuit-studio-1.webp", w: 1079, h: 1447, alt: "Our fursuit studio shelves with finished fursuit heads and 3D-printed head bases", caption: "Head bases & finished heads" },
  { src: "/media/work/fursuit-workshop-1.webp", w: 1080, h: 1440, alt: "Fursuit workshop with sewing machines and shelves of faux fur", caption: "The sewing room" },
  { src: "/media/work/fursuit-studio-2.webp", w: 1079, h: 1431, alt: "Rolls of faux fur in every colour stacked in our fursuit studio", caption: "Faux fur in every colour" },
  { src: "/media/work/fursuit-studio-4.webp", w: 1079, h: 1448, alt: "3D printers in our studio that make fursuit head bases", caption: "3D-printed head bases" },
  { src: "/media/work/fursuit-head-base-patterning-1.webp", w: 1600, h: 1600, alt: "Fursuit head base wrapped in film with seam lines drawn on for patterning", caption: "Patterning every head" },
  { src: "/media/work/fursuit-studio-3.webp", w: 1079, h: 1446, alt: "Faux fur cabinet in our fursuit studio", caption: "The fur cabinet" },
];

const facts = [
  { value: `${characters.length}+`, label: "characters in our gallery" },
  { value: "6 to 12", label: "weeks average production" },
  { value: `${policies.warrantyMonths} months`, label: "limited warranty" },
  { value: "12 hours", label: "support reply time" },
];

const howWeWork = [
  { title: "Made to order", body: "Nothing is mass-produced. Every head is patterned from your ref sheet and every bodysuit is sized to your measurements." },
  { title: "In-house head bases", body: "We shape and 3D print head bases in the studio, so face shape, eyes and expression match your character." },
  { title: "WIP at every stage", body: "You see photos of the head base, patterns and furring, and can ask for changes before we move on." },
  { title: "Shipped worldwide", body: "Finished suits are packed carefully and shipped to your door, wherever you are." },
];

export const metadata = pageMeta({
  title: "About Our Fursuit Maker Studio",
  description: "FursuitCommissions.com is a maker studio for custom fursuits, Kemono and Toony suits, fursuit parts and repairs, built from scratch and made to order.",
  path: "/about-us/",
});

// Copy adapted from the studio's own About page (spam-free sections only).
const crafts = [
  { title: "Custom fursuits", body: "Fullsuits, partials and fursuit heads, foam-carved and hand-sewn to your reference.", href: "/fursuit-commission/" },
  { title: "Kemono & Toony", body: "Anime-inspired Kemono faces or bold, expressive Toony characters, built around your design.", href: "/kemono-fursuits/" },
  { title: "Parts & repairs", body: "Paws, tails and finishing touches, plus repair assessments for suits that need some love.", href: "/fursuit-parts/" },
];

export default async function AboutPage() {
  const { S7, S8 } = await getSiteImages();
  return (
    <>
      <PageIntro
        crumbs={[{ name: "About", path: "/about-us/" }]}
        eyebrow="About us"
        title="We don't just make suits. We bring characters to life."
        lede="FursuitCommissions.com is a fursuit maker studio specialising in custom fursuits. We don't just make suits to a template: we bring your character to life, built from scratch, made to order and crafted with real care."
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
          <Image src={S7.src} alt={S7.alt} width={S7.width} height={S7.height} sizes="(min-width:1024px) 25vw, 50vw" className="aspect-[3/4] rounded-blob object-cover" />
          <Image src={S8.src} alt={S8.alt} width={S8.width} height={S8.height} sizes="(min-width:1024px) 25vw, 50vw" className="mt-10 aspect-[3/4] rounded-blob object-cover" />
        </div>
      </section>

      <section aria-label="Studio at a glance" className="container-x pb-16 sm:pb-20">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <li key={f.label} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="toon p-6 text-center">
              <span className="block font-display text-4xl font-bold text-forest">{f.value}</span>
              <span className="mt-1 block text-ink-muted">{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="inside-studio" className="bg-lavender-soft py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="inside-studio" eyebrow="Inside the studio" title="Where your fursuit is made" mark="fursuit" lede="From racks of faux fur to the 3D printers that make our head bases, this is where every commission is patterned, sewn and finished by hand." />
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {studio.map((s, i) => (
              <li key={s.src} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }}>
                <figure className="toon overflow-hidden p-2">
                  <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 768px) 30vw, 50vw" className="aspect-[4/5] w-full rounded-xl object-cover" />
                  <figcaption className="px-1 pb-1 pt-2 font-display text-sm font-bold text-forest sm:text-base">{s.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-we-make" className="container-x py-16 sm:py-20">
        <SectionHeading id="how-we-make" eyebrow="How we make them" title="Handmade fursuits, start to finish" mark="start to finish" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howWeWork.map((h, i) => (
            <li key={h.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="card p-6">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Paw className="h-5 w-5 text-mint-deep" />
                {h.title}
              </h3>
              <p className="mt-2 text-ink-muted">{h.body}</p>
            </li>
          ))}
        </ul>
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
