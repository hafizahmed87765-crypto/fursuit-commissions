import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/toony-fursuits/";
const intro =
  "Toony suits lean into cartoon energy: big expressive eyes, exaggerated shapes, bright colour blocks and wide smiles. Made to order around your character, from a single head to a full suit.";

const faqs: Faq[] = [
  {
    q: "What's the difference between Toony and Kemono?",
    a: "Both are cartoon-inspired. Toony suits favour bold, exaggerated shapes like big brows, wide grins and chunky features, while Kemono suits follow anime proportions with a softer, doll-like face.",
  },
  {
    q: "Can you make my character's expression?",
    a: "Yes. Eyebrows, eye shape, smile and markings are all built to your reference so the head reads as your character, not a generic mascot.",
  },
  ...generalFaqs.filter((f) => /prices|reference sheet|production take|ship/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Toony Fursuit Commissions",
  description: "Commission a custom Toony fursuit with big expressive eyes, bold shapes and bright colours. Heads, partials and fullsuits made to your character.",
  path,
  image: "/media/gallery/o1cn01pcmuzy1cnocobexva-4611686018427385509-0-am-7fa10f.webp",
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
      hero={{ src: "/media/gallery/o1cn01pcmuzy1cnocobexva-4611686018427385509-0-am-7fa10f.webp", width: 1200, height: 1600, alt: "Toony purple and turquoise horned dragon fursuit head with expressive brows", position: "50% 35%" }}
      traitsTitle="Big shapes, bigger personality"
      traits={[
        { title: "Expressive eyes", body: "Large eyes and sculpted brows that read clearly across a convention hall." },
        { title: "Exaggerated features", body: "Chunky cheeks, bold muzzles and playful proportions." },
        { title: "Bright colour blocks", body: "Crisp markings in your palette, cut and sewn to your ref." },
        { title: "Matching parts", body: "Paws and tails styled to match the head's cartoon look." },
      ]}
      portfolioTag="toony"
      examplesNote="Ready-made heads from our shop, to show the style. Your commission is built to your own design."
      examples={[
        { title: "Grey & White Wolf Head", href: "/product/cute-wolf-fursuit-head-grey-white-furry-mascot-cosplay-head/", src: "/media/products/hhlllkogqqme4yepjyr-tg-2k-a0ef2a.webp", width: 896, height: 1200, alt: "Toony grey and white wolf fursuit head with blue eyes" },
        { title: "Orange Fox Head", href: "/product/japanese-style-animal-fursuit-plush-headgear-cute-cosplay-costume/", src: "/media/products/use-the-uploaded-image-as-reference-gene-h6tjski-ccd9f4.webp", width: 1024, height: 1024, alt: "Toony orange fox fursuit head with a wide smile" },
        { title: "Pink Fox Head", href: "/product/japanese-style-animal-fursuit-plush-headgear-cute-cosplay-costume-copy/", src: "/media/products/use-the-uploaded-image-as-reference-gene-hnvgkhy-c34f6f.webp", width: 1024, height: 1024, alt: "Toony pink and white fox fursuit head" },
        { title: "Black Husky Head", href: "/product/japanese-style-animal-fursuit-plush-headgear-cute-cosplay-costume-black/", src: "/media/products/use-the-uploaded-image-as-reference-gene-z1-nb4x-8acefd.webp", width: 1024, height: 1024, alt: "Toony black and white husky fursuit head" },
      ]}
      faqs={faqs}
      related={[
        { href: "/kemono-fursuits/", label: "Prefer anime style?", body: "Compare with our Kemono suits" },
        { href: "/gallery/", label: "Gallery", body: "Filter finished work by Toony" },
        { href: "/shop/", label: "Shop paws & tails", body: "Ready-made parts and accessories" },
        { href: "/#planner", label: "Commission planner", body: "Find the right coverage" },
      ]}
    />
  );
}
