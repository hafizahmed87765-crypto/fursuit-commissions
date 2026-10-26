import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/kemono-fursuits/";
const intro =
  "Kemono suits take their look from anime and Japanese character design: large glossy eyes, small muzzles and soft, rounded faces. We build them custom around your character, from heads to full Kig-style costumes.";

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
    link: { href: "/product/premium-furry-kig-series-animal-costume-custom-made/", label: "See the Kig series listing" },
  },
  ...generalFaqs.filter((f) => /prices|reference sheet|production take|payment/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Kemono Fursuits & Kig Commissions",
  description: "Commission a custom Kemono fursuit with anime-style eyes, soft rounded features and optional hair. Heads, partials and full Kig-style suits, quoted to your design.",
  path,
  image: "/media/products/whatsapp-image-2025-12-14-at-12-27-58-pm-f42ae7.webp",
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
      hero={{ src: "/media/products/whatsapp-image-2025-12-14-at-12-27-58-pm-f42ae7.webp", width: 1280, height: 1262, alt: "Kemono calico cat fursuit head with large blue anime eyes", position: "50% 30%" }}
      traitsTitle="What gives Kemono its charm"
      traits={[
        { title: "Anime eyes", body: "Large, glossy eyes in your character's colours are the heart of the look." },
        { title: "Soft, rounded face", body: "A short muzzle and full cheeks for that cute, doll-like expression." },
        { title: "Hair & wigs", body: "Long hair, braids and fringes styled to match your reference." },
        { title: "Full character sets", body: "Pair the head with paws, tail and outfit for a complete Kig-style look." },
      ]}
      portfolioTag="kemono"
      examplesNote="Ready-made Kemono pieces from our shop, to show the style. Your commission is built to your own design."
      examples={[
        { title: "Mint & Pastel Pink Bunny", href: "/product/mint-pastel-pink-anime-bunny-fursuit-fluffy-cosplay-costume-with-big-green-eyes/", src: "/media/products/lfe5pajuqfcifzotlhynlq-2k-bc84e0.webp", width: 1024, height: 1024, alt: "Mint and pastel pink Kemono bunny with long hair and green eyes" },
        { title: "White & Pink Bunny", href: "/product/white-pink-anime-bunny-fursuit-cute-plush-cosplay-costume-with-big-blue-eyes/", src: "/media/products/d4rgsjpqqlgpcmy7fobjpa-2k-da7833.webp", width: 1024, height: 1024, alt: "White and pink Kemono bunny with big blue eyes" },
        { title: "Black & Orange Cat", href: "/product/black-orange-anime-cat-fursuit-expressive-cosplay-costume-with-fluffy-ears/", src: "/media/products/4nz1zoenrzm5ms8kymwmpa-2k-1b8dca.webp", width: 1024, height: 1024, alt: "Black Kemono cat with long orange hair" },
        { title: "Pastel Blue Bunny", href: "/product/pastel-blue-anime-bunny-fursuit-plush-cosplay-costume-with-big-eyes-paws/", src: "/media/products/ggurqdibsk2okpfyicw5zg-2k-f541ce.webp", width: 1024, height: 1024, alt: "Pale blue Kemono bunny with long hair and paws" },
      ]}
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
