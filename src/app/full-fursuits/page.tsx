import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { planFrom } from "@/content/pricing";
import { pageMeta } from "@/lib/seo";

// Keywords (volume/KD): full fursuit 590/24, full body fursuit 260/25, fursuit full body 170/28,
// full fursuits for sale 110/13, how much does a full fursuit cost 70/3, fursuit full suit 50/23,
// digitigrade full fursuit, custom full fursuit, kemono fursuit full body.
const path = "/full-fursuits/";
const from = `$${planFrom.fullsuit.toLocaleString("en-US")}`;
const intro = `A full fursuit covers your character from head to tail: fursuit head, full body fursuit, hand paws, feet paws and tail, all made to your measurements. Our full fursuits start from ${from}, with plantigrade or digitigrade legs.`;

const faqs: Faq[] = [
  {
    q: "How much does a full fursuit cost?",
    a: `A full fursuit starts from ${from} for a standard build. Markings, digitigrade legs, hair and extras change the price of a full body fursuit, and your quote confirms everything before you pay.`,
    link: { href: "/fursuit-prices/", label: "See all fursuit prices" },
  },
  {
    q: "What's included in a full body fursuit?",
    a: "A full fursuit includes the fursuit head, a full body fursuit (bodysuit) made to measure, hand paws, feet paws and a tail, all built together as one character.",
  },
  {
    q: "Do you have full fursuits for sale?",
    a: "Every full fursuit for sale here is a custom full fursuit commission, patterned on your measurements and made from your character, not a premade full body fursuit.",
    link: { href: "/get-a-quote/?coverage=fullsuit", label: "Request a full fursuit quote" },
  },
  {
    q: "Can I get a Kemono or Toony full body fursuit?",
    a: "Yes. We make Kemono full body fursuits with anime eyes and soft features, and Toony full fursuits with bold shapes and colours, in any species: wolf, fox, dragon, cat and more.",
  },
  ...generalFaqs.filter((f) => /digitigrade|production take|payment arrangements/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Full Fursuits & Full Body Fursuits",
  description: `Custom full fursuit commissions from ${from}: fursuit head, full body fursuit, paws and tail made to your measurements, plantigrade or digitigrade.`,
  path,
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Full Fursuits"
      service="custom"
      coverage="fullsuit"
      eyebrow="Fullsuit commissions"
      title="Custom Full Fursuits & Full Body Fursuits"
      intro={intro}
      tint="bg-petal"
      hero={{ src: "/media/work/toony-neon-wolf-fullsuit-2.webp", width: 718, height: 1032, alt: "Custom Toony wolf full fursuit in purple, lime green and yellow with blue paws, full-body pose", position: "50% 30%" }}
      traitsTitle="What makes a full fursuit"
      traits={[
        { title: "Full body fursuit", body: "A bodysuit patterned on a duct-tape dummy built to your measurements." },
        { title: "Plantigrade or digitigrade", body: "Straight legs, or a digitigrade full fursuit with animal-shaped legs." },
        { title: "Markings that line up", body: "Every stripe and spot is drawn onto the pattern so markings match across the seams." },
        { title: "Head to tail match", body: "Fursuit head, paws and tail built together as one full fursuit." },
      ]}
      faqs={faqs}
      related={[
        { href: "/partial-fursuits/", label: "Partial fursuits", body: "No bodysuit, lower price" },
        { href: "/fursuit-heads/", label: "Fursuit heads", body: "Start with the head" },
        { href: "/guides/how-to-measure-for-a-fursuit/", label: "Measuring guide", body: "How to measure for a fullsuit" },
        { href: "/payment-plans/", label: "Payment plans", body: "Weekly or biweekly instalments" },
      ]}
    />
  );
}
