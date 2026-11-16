import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { planFrom } from "@/content/pricing";
import { pageMeta } from "@/lib/seo";

// Keywords (volume/KD): fursuit head 4400/8, fursuit heads 720/4, fursuit head commissions 390/1,
// fursuit head for sale 480/9, premade fursuit head 210/12, custom fursuit head 140/13, kemono fursuit head 390/25.
const path = "/fursuit-heads/";
const from = `$${planFrom.head.toLocaleString("en-US")}`;
const intro = `A fursuit head is the face of your character, so every custom fursuit head we make starts from your reference sheet. Each fursuit head is carved on a foam or resin head base, then finished with eyes, expression and fur. Fursuit heads start from ${from}, quoted to your design.`;

const faqs: Faq[] = [
  {
    q: "How much does a fursuit head cost?",
    a: `Our fursuit heads start from ${from}. The final fursuit head price depends on style, markings, hair and extras, and your written quote confirms it before you pay anything.`,
    link: { href: "/fursuit-prices/", label: "See all fursuit prices" },
  },
  {
    q: "Do you have fursuit heads for sale?",
    a: "Every fursuit head for sale here is a custom fursuit head commission, made to order from your character rather than a premade fursuit head. That way your fursuit head is never a copy of someone else's.",
    link: { href: "/get-a-quote/?coverage=head", label: "Request a fursuit head quote" },
  },
  {
    q: "What is a fursuit head base?",
    a: "The fursuit head base is the structure under the fur. We hand-carve a foam fursuit head base or build on a resin base, shaped to your character and sized to your head, so the fursuit head fits and holds its shape.",
  },
  {
    q: "Can you make a Kemono fursuit head?",
    a: "Yes. A Kemono fursuit head has large anime eyes, a small muzzle and a soft, rounded face. We also make Toony fursuit heads with bolder, more expressive features.",
    link: { href: "/kemono-fursuits/", label: "See Kemono fursuits" },
  },
  {
    q: "Which animals can you make a fursuit head for?",
    a: "Any species on your ref sheet: fox fursuit heads, cat and feline fursuit heads, wolf, dog and canine fursuit heads, dragon fursuit heads, bunny and rabbit fursuit heads, deer and more.",
  },
  {
    q: "Do you make realistic fursuit heads?",
    a: "Our fursuit heads are Kemono or Toony style rather than fully realistic. If you'd like a more realistic fursuit head, send your reference and we'll tell you honestly whether it suits our work.",
  },
  {
    q: "Is there a cheap fursuit head option?",
    a: `Our fursuit head prices start at ${from} for a standard build. Simpler markings keep a fursuit head more affordable, and larger orders can be spread over a payment plan.`,
    link: { href: "/payment-plans/", label: "How payment plans work" },
  },
  ...generalFaqs.filter((f) => /production take|reference sheet/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Fursuit Heads | Fursuit Head Commissions",
  description: `Custom fursuit head commissions from ${from}. Kemono and Toony fursuit heads on foam or resin head bases, made to order from your reference sheet.`,
  path,
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Fursuit Heads"
      service="custom"
      coverage="head"
      eyebrow="Fursuit head commissions"
      title="Custom Fursuit Head Commissions"
      intro={intro}
      tint="bg-mint-wash"
      hero={{ src: "/media/work/toony-navy-fox-glasses-fursuit-head-1.webp", width: 1067, height: 1600, alt: "Custom Toony fox fursuit head in navy and white with orange inner ears, magenta eyes and black glasses, front view", position: "50% 35%" }}
      traitsTitle="What goes into every fursuit head"
      traits={[
        { title: "Foam or resin head base", body: "Each fursuit head base is hand-carved from foam or built on resin, shaped to your character and sized to you." },
        { title: "Eyes and expression", body: "Kemono anime eyes or Toony expressive eyes, with brows and markings matched to your ref sheet." },
        { title: "Fur, cut and shaved", body: "Fur is patterned, sewn and shaved so your fursuit head looks like the art from every angle." },
        { title: "Padded, breathable lining", body: "A padded, breathable lining keeps your fursuit head comfortable to wear." },
      ]}
      faqs={faqs}
      related={[
        { href: "/partial-fursuits/", label: "Partial fursuits", body: "Add hand paws and a tail" },
        { href: "/full-fursuits/", label: "Full fursuits", body: "Your character, head to tail" },
        { href: "/fursuit-parts/", label: "Fursuit paws & tails", body: "Parts to match your head" },
        { href: "/fursuit-prices/", label: "Fursuit prices", body: "Starting prices by coverage" },
      ]}
    />
  );
}
