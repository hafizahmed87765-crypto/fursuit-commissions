import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import FinalCta from "@/components/FinalCta";
import { species } from "@/content/species";
import { work } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Fursuits by Species: Custom Animal Fursuits",
  description: "Custom animal fursuits in any species: wolf, fox, dragon, bunny, cat, dog, shark, moth, bat, deer and more. Heads, partials and fullsuits made to your ref sheet.",
  path: "/fursuit-species/",
});

const photoOf = (slug?: string) => (slug ? work.find((w) => w.slug === slug)?.photos[0] : undefined);
const blurb = (d: string) => `${d.split(":")[0]}.`;
// Species with a photo of our own build go first; the rest follow as a compact list.
const all = species.map((s) => ({ s, photo: photoOf(s.hero) }));
const withPhoto = all.filter((x): x is typeof x & { photo: NonNullable<typeof x.photo> } => !!x.photo);
const rest = all.filter((x) => !x.photo);

export default function SpeciesHub() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Fursuits by Species", path: "/fursuit-species/" }]}
        eyebrow="Fursuits by species"
        title="Custom Animal Fursuits by Species"
        lede="Every custom fursuit is built from your ref sheet, in any species. Pick an animal to see what goes into that fursuit, or request a quote for a species not listed here."
      >
        <div className="mt-8">
          <Link href="/get-a-quote/" className="btn-primary">
            Request a Custom Quote
          </Link>
        </div>
      </PageIntro>
      <section aria-label="Species with photos" className="container-x pt-16 sm:pt-20">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {withPhoto.map(({ s, photo }) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}/`} className="card card-hover flex h-full flex-col overflow-hidden">
                <div className="relative aspect-square bg-black">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{s.crumb}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{blurb(s.description)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="more-species" className="container-x py-16 sm:py-20">
        <h2 id="more-species" className="text-2xl font-bold">More species we make</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map(({ s }) => (
            <li key={s.slug}>
              <Link href={`/${s.slug}/`} className="card card-hover block h-full p-5">
                <span className="block font-display text-lg font-semibold text-forest">{s.crumb} →</span>
                <span className="mt-1 block text-sm text-ink-muted">{blurb(s.description)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta />
    </>
  );
}
