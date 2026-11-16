import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs, type Faq } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

// Adult (18+) service page. Copy stays non-explicit; keywords: murrsuit, mursuit, murrsuiter, murrsuiting.
const path = "/murrsuits/";
const intro =
  "Looking for a custom murrsuit or a sexy fursuit? We make murrsuits, also called sexual fursuits, mursuits or mur suits, for adults aged 18 and over. Each suit is built around your character, with the openings, washable liners and tougher seams that murrsuiting needs, and every commission is handled privately.";


const faqs: Faq[] = [
  {
    q: "What is a murrsuit?",
    a: "A murrsuit (also spelled mursuit, mur suit, murr suit or mersuit) is a fursuit made or adapted for adult, intimate wear. A murrsuit looks like any other custom fursuit, but it is built with features such as zippered openings, removable washable liners and reinforced seams.",
  },
  {
    q: "Is a murrsuit the same as a sexual fursuit?",
    a: "Yes. Sexual fursuit, sexy fursuit and sexy fur suit are other names for a murrsuit: a fursuit made for adult wear. If you would like a sexy furry costume that looks attractive but is not built for adult use, we make that as a standard fursuit commission.",
  },
  {
    q: "What's a murrsuiter?",
    a: "A murrsuiter (or mursuiter) is an adult who wears a murrsuit. Murrsuiting, also written mursuiting or murr suiting, is the act of wearing one. Murrsuiters want the same character and quality as a regular fursuit, with practical changes for adult use.",
  },
  {
    q: "Who can commission a murrsuit?",
    a: "Murrsuit commissions are only for adults aged 18 or over. We may ask you to confirm your age before we accept your order.",
  },
  {
    q: "Do you make gay mursuits and femboy murrsuits?",
    a: "Yes. We build murr suits for adult murrsuiters of every gender and orientation, including gay mursuits. For a femboy murrsuit we can shape a slimmer, softer bodysuit, add longer hair and use the markings and colours from your reference.",
  },
  {
    q: "Is my murrsuit commission kept private?",
    a: "Yes. We discuss your design one-to-one and never post a murrsuit in our gallery or on social media without your clear permission.",
  },
  {
    q: "How do I clean a murrsuit?",
    a: "We build murrsuits with removable, machine-washable liners where possible, and send care instructions with your suit. The fur itself is hand washed in cool water and air dried, like any fursuit.",
    link: { href: "/guides/fursuit-care-and-cleaning/", label: "Read our fursuit care guide" },
  },
  ...generalFaqs.filter((f) => /prices|production take|payment/.test(f.q)),
];

export const metadata = pageMeta({
  title: "Custom Murrsuits & Sexy Fursuit Commissions (18+)",
  description: "Custom murrsuits and sexy fursuits for adult murrsuiters, 18+ only. Private sexual fursuit commissions with washable liners, zippered openings and reinforced seams, built to your character.",
  path,
  image: "/share-image/S1/",
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Murrsuits"
      service="custom"
      eyebrow="Murrsuit commissions · 18+ only"
      title="Custom Murrsuits & Sexy Fursuit Commissions"
      intro={intro}
      tint="bg-lavender-soft"
      hero={{ src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-1.webp", width: 900, height: 1600, alt: "Custom white and sky-blue dragon fullsuit with a digitigrade bodysuit, full-body front view", position: "50% 20%" }}
      traitsTitle="What makes our murrsuits different"
      traits={[
        { title: "Built for murrsuiting", body: "Zippered openings and flexible panels are planned into the pattern, not cut in afterwards." },
        { title: "Washable murrsuit liners", body: "Removable, machine-washable liners keep your murrsuit fresh and the fur protected." },
        { title: "Reinforced seams", body: "Stronger stitching and backing where murr suits take the most wear." },
        { title: "Any character, any style", body: "Female and girl fursuit characters, gay mursuits or femboy murrsuits, Toony or Kemono: all designed from your ref sheet." },
      ]}
      workTitle="Our portfolio"
      faqs={faqs}
      related={[
        { href: "/fursuit-commission/", label: "Custom fursuits", body: "Standard fursuit commissions" },
        { href: "/furry-ref-sheet-commissions/", label: "Reference sheets", body: "Get your character drawn first" },
        { href: "/payment-plans/", label: "Payment plans", body: "Weekly or biweekly instalments" },
        { href: "/fursuit-prices/", label: "Fursuit prices", body: "Starting prices by coverage" },
      ]}
    />
  );
}
