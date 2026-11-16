import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { planFrom } from "@/content/pricing";
import { getSpecies, species, type Species } from "@/content/species";
import { work } from "@/content/work";
import { characters } from "@/lib/work";
import { pageMeta } from "@/lib/seo";

// One page per animal, e.g. /wolf-fursuits/. Unknown root paths still 404.
export const dynamicParams = false;
export const generateStaticParams = () => species.map((s) => ({ species: s.slug }));

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
const fallbackHero = work.find((w) => w.slug === "fursuit-head-base-patterning")!.photos[0];

export async function generateMetadata({ params }: { params: Promise<{ species: string }> }): Promise<Metadata> {
  const s = getSpecies((await params).species);
  return s ? pageMeta({ title: s.title, description: s.description, path: `/${s.slug}/` }) : {};
}

function sharedFaqs({ name: n }: Species): Faq[] {
  return [
    {
      q: `How much does a ${n} fursuit cost?`,
      a: `A ${n} fursuit head starts from ${usd(planFrom.head)}, a ${n} partial from ${usd(planFrom.partial)} and a full ${n} fursuit from ${usd(planFrom.fullsuit)}. Markings, horns, wings and extras change the price, and your written quote confirms every ${n} fursuit before you pay.`,
      link: { href: "/fursuit-prices/", label: "See all fursuit prices" },
    },
    {
      q: `Do you have ${n} fursuits for sale?`,
      a: `Every ${n} fursuit for sale here is a custom commission made to order from your ref sheet, not a premade ${n} fursuit, so your character is never a copy of someone else's.`,
      link: { href: "/get-a-quote/", label: `Request a ${n} fursuit quote` },
    },
    {
      q: `Can you make a realistic ${n} fursuit?`,
      a: `Our ${n} fursuits are Kemono or Toony style rather than fully realistic. A Kemono ${n} fursuit has big anime eyes and a soft face; a Toony ${n} fursuit has bold shapes and colours. Send your reference and we'll tell you honestly what suits your ${n} character.`,
      link: { href: "/kemono-fursuits/", label: "Kemono fursuits" },
    },
    {
      q: `Can I order just a ${n} fursuit head?`,
      a: `Yes. Order a ${n} fursuit head on its own, a ${n} partial with the head, hand paws and tail, or a full ${n} fursuit with a bodysuit made to your measurements.`,
      link: { href: "/fursuit-heads/", label: "Fursuit heads" },
    },
    ...generalFaqs.filter((f) => /production take/.test(f.q)),
  ];
}

export default async function SpeciesPage({ params }: { params: Promise<{ species: string }> }) {
  const s = getSpecies((await params).species);
  if (!s) notFound();
  const path = `/${s.slug}/`;
  const photo = (s.hero && work.find((w) => w.slug === s.hero)?.photos[0]) || fallbackHero;
  const showcase = s.photos ? characters.filter((c) => s.photos!.test(c.slug)) : [];
  const related = s.related.map((slug) => getSpecies(slug)!);
  return (
    <ServiceLanding
      path={path}
      crumb={s.crumb}
      parent={{ name: "Fursuits by Species", path: "/fursuit-species/" }}
      service="custom"
      eyebrow={`${s.name.replace(/^./, (c) => c.toUpperCase())} fursuit commissions`}
      title={s.h1}
      intro={s.intro}
      tint="bg-mint-wash"
      hero={{ ...photo, position: "50% 30%" }}
      traitsTitle={`What makes a ${s.name} fursuit`}
      traits={s.traits}
      showcase={showcase}
      workTitle={showcase.length ? undefined : "Our portfolio"}
      faqs={[...s.faqs, ...sharedFaqs(s)]}
      related={[
        ...related.map((r) => ({ href: `/${r.slug}/`, label: r.crumb, body: `Custom ${r.name} fursuits` })),
        { href: "/fursuit-species/", label: "All species", body: "Every animal we make" },
      ]}
    />
  );
}
