import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pricePlans } from "@/content/pricing";
import { pageMeta } from "@/lib/seo";

// Keywords (volume/KD): partial fursuit 880/19, fursuit partial 480/26, fursuit partials 260/25,
// mini partial fursuit 260/25, fursuit mini partial 210/24, fursuit partial for sale 170/4,
// full partial fursuit 110/2, premade partial fursuit 70/4, partial fursuit commissions 50/11.
const path = "/partial-fursuits/";
const usd = (key: string) => `$${pricePlans.find((p) => p.key === key)!.from.toLocaleString("en-US")}`;
const mini = usd("mini-partial");
const full = usd("partial");
const intro = `A partial fursuit gives you a full character look without the bodysuit. Choose a mini partial fursuit (head, hand paws and tail) from ${mini}, or a full partial fursuit with feet paws added from ${full}. Every fursuit partial is custom made from your reference sheet.`;

const faqs: Faq[] = [
  {
    q: "What is a partial fursuit?",
    a: "A partial fursuit, or fursuit partial, is a fursuit head, hand paws and tail, often with feet paws, worn with your own clothes instead of a full bodysuit.",
  },
  {
    q: "What's the difference between a mini partial and a full partial fursuit?",
    a: "A mini partial fursuit is the head, hand paws and tail. A full partial fursuit adds feet paws. Both partial fursuits are made to order and matched to your character.",
  },
  {
    q: "How much does a partial fursuit cost?",
    a: `A mini partial fursuit starts from ${mini} and a full partial fursuit from ${full}. Markings, hair and extras change the price, and your quote confirms it before you pay.`,
    link: { href: "/fursuit-prices/", label: "See all fursuit prices" },
  },
  {
    q: "Do you have fursuit partials for sale?",
    a: "Every fursuit partial for sale here is a custom partial fursuit commission made from your character, rather than a premade partial fursuit. Your partial is never a copy of someone else's.",
    link: { href: "/get-a-quote/?coverage=partial", label: "Request a partial fursuit quote" },
  },
  {
    q: "Is there a cheap partial fursuit option?",
    a: `A mini partial from ${mini} is our most affordable partial fursuit, and payment plans let you spread the cost of any fursuit partial.`,
    link: { href: "/payment-plans/", label: "How payment plans work" },
  },
  ...generalFaqs.filter((f) => /production take|reference sheet/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Partial Fursuits & Mini Partials",
  description: `Custom partial fursuit commissions: mini partial fursuits from ${mini} and full partial fursuits with feet paws from ${full}. Made to order from your ref sheet.`,
  path,
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Partial Fursuits"
      service="custom"
      coverage="partial"
      eyebrow="Fursuit partial commissions"
      title="Custom Partial Fursuits & Mini Partials"
      intro={intro}
      tint="bg-lavender-soft"
      hero={{ src: "/media/work/kemono-grey-horned-dragon-partial-1.webp", width: 1255, height: 1600, alt: "Custom Kemono dragon partial fursuit in grey and white with coral ears, red-tipped horns, hand paws and feet paws, front view", position: "50% 25%" }}
      traitsTitle="Choose your fursuit partial"
      traits={[
        { title: "Mini partial", body: `Fursuit head, hand paws and tail from ${mini}: the classic mini partial fursuit.` },
        { title: "Full partial", body: `A mini partial plus feet paws from ${full}. Our most popular fursuit partial.` },
        { title: "Wear your own clothes", body: "Partial fursuits pair with your own outfit, so they're cooler and easier to pack than a fullsuit." },
        { title: "Add parts later", body: "Start with a mini partial and add feet paws or more parts later, matched to your character." },
      ]}
      faqs={faqs}
      related={[
        { href: "/fursuit-heads/", label: "Fursuit heads", body: "Start with the head" },
        { href: "/full-fursuits/", label: "Full fursuits", body: "Add a full body fursuit" },
        { href: "/fursuit-parts/", label: "Fursuit paws & tails", body: "Parts for your partial" },
        { href: "/payment-plans/", label: "Payment plans", body: "Weekly or biweekly instalments" },
      ]}
    />
  );
}
