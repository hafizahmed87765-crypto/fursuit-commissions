import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/toony-fursuits/";
const intro =
  "Toony fursuits lean into cartoon energy: big expressive eyes, exaggerated shapes, bright colour blocks and wide smiles. Every Toony suit is made to order around your character, from a single Toony head to a full suit.";

const faqs: Faq[] = [
  {
    q: "What's the difference between Toony and Kemono?",
    a: "Both are cartoon-inspired. Toony suits favour bold, exaggerated shapes like big brows, wide grins and chunky features, while Kemono suits follow anime proportions with a softer, doll-like face.",
  },
  {
    q: "Can you make my character's expression?",
    a: "Yes. Eyebrows, eye shape, smile and markings are all built to your reference so the Toony head reads as your character, not a generic mascot.",
  },
  ...generalFaqs.filter((f) => /prices|reference sheet|production take|ship/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Toony Fursuit Commissions",
  description: "Commission a custom Toony fursuit with big expressive eyes, bold shapes and bright colours. Heads, partials and fullsuits made to your character.",
  path,
  image: "/share-image/S2/",
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Toony Suits"
      service="toony"
      eyebrow="Toony fursuit commissions"
      title="Custom Toony Fursuits"
      intro={intro}
      tint="bg-petal"
      heroSlot="S2"
      hero={{ src: "/media/work/toony-red-streak-wolf-partial-1.webp", width: 1067, height: 1600, alt: "Toony-style charcoal and white wolf fursuit with a red hair streak, red eye markings, red inner ears and matching feet paws, front view", position: "50% 35%" }}
      traitsTitle="Big Toony shapes, bigger personality"
      traits={[
        { title: "Expressive eyes", body: "Large Toony eyes and sculpted brows that read clearly across a convention hall." },
        { title: "Exaggerated features", body: "Chunky cheeks, bold muzzles and playful proportions." },
        { title: "Bright colour blocks", body: "Crisp markings in your palette, cut and sewn to your ref." },
        { title: "Matching parts", body: "Paws and tails styled to match your Toony head's cartoon look." },
      ]}
      portfolioTag="toony"
      faqs={faqs}
      related={[
        { href: "/kemono-fursuits/", label: "Prefer anime style?", body: "Compare with our Kemono suits" },
        { href: "/gallery/", label: "Gallery", body: "Filter finished work by Toony" },
        { href: "/fursuit-parts/", label: "Custom parts", body: "Paws, tails and other pieces to match your Toony suit" },
        { href: "/#planner", label: "Commission planner", body: "Find the right coverage" },
      ]}
    />
  );
}
