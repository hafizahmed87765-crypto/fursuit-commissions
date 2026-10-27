import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/kemono-fursuits/";
const intro =
  "Kemono suits take their look from anime and Japanese character design: large glossy eyes, small muzzles and soft, rounded faces. We build Kemono fursuits around your character, from a single Kemono head to a full Kig-style costume.";

const faqs: Faq[] = [
  {
    q: "What makes a fursuit “Kemono”?",
    a: "Kemono (Japanese for “beast”) suits use anime-style proportions: oversized, often glossy eyes, a short muzzle, rounded cheeks and a cute, doll-like expression. Many have long hair or wigs.",
  },
  {
    q: "Can my Kemono suit have hair?",
    a: "Yes. Long hair, braids and fringes are common on Kemono characters, and several of our pieces include them. Show us the hairstyle on your reference and we'll include it in your quote.",
  },
  {
    q: "What is a Kig?",
    a: "Kig (from kigurumi) usually means a full-face character head with a doll-like face, often paired with a bodysuit. Our Premium Kig series is made to order and quoted to your design.",
    link: { href: "/get-a-quote/?service=kemono", label: "Request a Kemono quote" },
  },
  ...generalFaqs.filter((f) => /prices|reference sheet|production take|payment/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Kemono Fursuits & Kig Commissions",
  description: "Commission a custom Kemono fursuit with anime-style eyes, soft rounded features and optional hair. Heads, partials and full Kig-style suits, quoted to your design.",
  path,
  image: "/share-image/S1/",
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Kemono Suits"
      service="kemono"
      eyebrow="Kemono fursuit commissions"
      title="Custom Kemono Fursuits"
      intro={intro}
      tint="bg-lavender-soft"
      heroSlot="S1"
      hero={{ src: "/media/work/kemono-grey-horned-dragon-partial-2.webp", width: 1257, height: 1600, alt: "Kemono-style grey and white horned dragon fursuit with coral ears, red-tipped horns, golden anime eyes and a paw-print bandana, three-quarter view", position: "50% 30%" }}
      traitsTitle="What gives Kemono its charm"
      traits={[
        { title: "Anime eyes", body: "Large, glossy eyes in your character's colours are the heart of the Kemono look." },
        { title: "Soft, rounded face", body: "A short muzzle and full cheeks for that cute, doll-like expression." },
        { title: "Hair & wigs", body: "Long hair, braids and fringes, a Kemono favourite, styled to match your reference." },
        { title: "Full character sets", body: "Pair your Kemono head with paws, tail and outfit for a complete Kig-style look." },
      ]}
      portfolioTag="kemono"
      faqs={faqs}
      related={[
        { href: "/toony-fursuits/", label: "Prefer bolder features?", body: "Compare with our Toony style" },
        { href: "/gallery/", label: "Gallery", body: "Filter finished work by Kemono" },
        { href: "/furry-ref-sheet-commissions/", label: "Reference sheets", body: "Get your character drawn first" },
        { href: "/#planner", label: "Commission planner", body: "Find the right coverage" },
      ]}
    />
  );
}
