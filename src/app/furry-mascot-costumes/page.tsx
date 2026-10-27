import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import JsonLd from "@/components/JsonLd";
import Paw from "@/components/Paw";
import CmsFormForPage from "@/components/cms/CmsFormForPage";
import { mascotFaqs } from "@/content/faqs";
import { pageMeta, serviceLd } from "@/lib/seo";
import { getSiteImages } from "@/lib/site-images";

const path = "/furry-mascot-costumes/";
const lede =
  "A furry mascot costume is a character you can wear: a custom head, paws, tail and bodysuit built from your design. We make them by hand, the same way we make our fursuits.";

export const metadata = pageMeta({
  title: "Custom Furry Mascot Costumes",
  description:
    "Commission a custom furry mascot costume: a handmade animal mascot head, paws, tail and bodysuit built from your character design. Free quotes, shipped worldwide.",
  path,
  image: "/share-image/S4/",
});

// CONFIRM: brand/team/event mascot work is described as "reviewed per quote"
// until the owner confirms it is offered (docs/CONTENT-TODO.md).
const uses = [
  { title: "Your fursona as your mascot", body: "Wear your own character to conventions, meet-ups and photoshoots." },
  { title: "Streamer and creator mascots", body: "Bring the character from your channel or art into the real world." },
  { title: "Club and community mascots", body: "A costumed character for a group, meet or community event, quoted to your design." },
];

const compare = [
  { label: "Built from", fursuit: "Your personal character", mascot: "A character that represents you, a group or a project" },
  { label: "Fit", fursuit: "Sized to the wearer's measurements", mascot: "Sized to the main wearer's measurements" },
  { label: "Construction", fursuit: "Foam or resin head, hand-sewn faux fur", mascot: "The same handmade build" },
];

export default async function FurryMascotPage() {
  const { S4 } = await getSiteImages();
  return (
    <>
      <PageIntro crumbs={[{ name: "Furry Mascot Costumes", path }]} eyebrow="Furry mascot costumes" title="Custom furry mascot costumes" lede={lede}>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/get-a-quote/" className="btn-primary">
            Request a mascot quote
          </Link>
          <Link href="/furry-costumes/" className="btn-secondary">
            Custom furry costumes
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="what" className="container-x grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            id="what"
            eyebrow="What we make"
            title="A handmade animal mascot, built around one character"
            mark="one character"
            lede="Every furry mascot costume starts from a reference sheet. We pattern the head, carve or shape it, and sew the fur so the finished mascot matches the design, not a stock costume."
          />
          <ul className="mt-8 space-y-3" data-reveal>
            {["Mascot head with your choice of eyes and expression", "Hand paws, feet paws and tail to match", "Full-body mascot suit in a plantigrade or digitigrade leg style", "WIP photos at every major stage"].map((t) => (
              <li key={t} className="flex items-start gap-2 font-display text-lg font-semibold text-forest">
                <Paw className="mt-1 h-4 w-4 shrink-0 text-mint-deep" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="toon overflow-hidden bg-black p-0 lg:rotate-1">
          <Image
            src={S4.src}
            alt={S4.alt}
            width={S4.width}
            height={S4.height}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-square w-full rounded-[1.8rem] object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="uses" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="uses" eyebrow="Who it's for" title="Furry mascots for people, creators and communities" mark="Furry mascots" />
          <ul className="mt-10 grid gap-7 md:grid-cols-3">
            {uses.map((u, i) => (
              <li key={u.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="toon p-6">
                <h3 className="text-2xl font-bold">{u.title}</h3>
                <p className="mt-2 text-ink-muted">{u.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-ink-muted" data-reveal>
            Need a mascot for a brand, team or business event? Describe the character and how it will be worn in your{" "}
            <Link href="/get-a-quote/" className="link">quote request</Link>. We review mascot projects individually and will tell you honestly whether our handmade process is the right fit.
          </p>
        </div>
      </section>

      <section aria-labelledby="compare" className="container-x py-16 sm:py-20">
        <SectionHeading id="compare" eyebrow="Mascot vs fursuit" title="Furry mascot costume or fursuit?" lede="The names overlap. The difference is mostly who the character represents; we build both by hand." />
        <div className="mt-10 overflow-x-auto" data-reveal>
          <table className="toon w-full min-w-[560px] border-separate border-spacing-0 overflow-hidden text-left">
            <thead>
              <tr className="bg-mint">
                <th scope="col" className="p-4 font-display">&nbsp;</th>
                <th scope="col" className="p-4 font-display text-lg">Fursuit</th>
                <th scope="col" className="p-4 font-display text-lg">Furry mascot costume</th>
              </tr>
            </thead>
            <tbody>
              {compare.map((r) => (
                <tr key={r.label} className="odd:bg-white even:bg-mint-wash">
                  <th scope="row" className="p-4 font-display font-semibold">{r.label}</th>
                  <td className="p-4 text-ink-muted">{r.fursuit}</td>
                  <td className="p-4 text-ink-muted">{r.mascot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8" data-reveal>
          Compare <Link href="/kemono-fursuits/" className="link">Kemono</Link> and <Link href="/toony-fursuits/" className="link">Toony</Link> styles, or{" "}
          <Link href="/fursuit-prices/" className="link">see how mascot and fursuit prices are quoted</Link>.
        </p>
      </section>

      <section aria-labelledby="faq" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="faq" eyebrow="FAQ" title="Furry mascot questions" />
          <FaqList faqs={mascotFaqs} />
        </div>
      </section>

      <FinalCta />
      <CmsFormForPage pagePath={path} />
      <JsonLd data={serviceLd("Custom furry mascot costumes", lede, path)} />
    </>
  );
}
