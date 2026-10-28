import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/fursuit-commission/";
const intro =
  "Heads, partials and fullsuits made from scratch around your reference sheet, in any species and style: a custom furry costume of your own character. You get a personal quote, WIP photos at every stage and worldwide shipping.";

export const metadata = pageMeta({
  title: "Custom Fursuit Commissions: Fullsuits, Partials & Heads",
  description: "Commission a custom fursuit head, partial or fullsuit built from your reference sheet. Free quotes, WIP updates at every stage and worldwide shipping.",
  path,
});

export default function Page() {
  return (
    <ServiceLanding
      path={path}
      crumb="Custom Fursuits"
      service="custom"
      eyebrow="Custom fursuit commissions"
      title="Custom Fursuit Commissions"
      intro={intro}
      tint="bg-mint-wash"
      heroSlot="S3"
      hero={{ src: "/media/work/kemono-crowned-fox-fullsuit-1.webp", width: 1200, height: 1600, alt: "Kemono-style crimson and grey fox fursuit with a teal crown marking, blue anime eyes and red-striped paws, head, hand paws and feet paws in the workshop", position: "50% 12%" }}
      traitsTitle="Built around your character, not a template"
      traits={[
        { title: "Any species", body: "Canines, felines, dragons, hybrids and original species. If it's on your ref sheet, we pattern it." },
        { title: "Your markings", body: "Fur colours, patterns and markings are cut and sewn to match your reference." },
        { title: "Any style", body: "Kemono, Toony or somewhere in between. Tell us the look you want." },
        { title: "Made to fit", body: "Bodysuits and paws are sized to your measurements." },
      ]}
      faqs={generalFaqs.slice(0, 8)}
      related={[
        { href: "/fursuit-prices/", label: "Fursuit prices", body: "What affects the cost of a custom fursuit" },
        { href: "/kemono-fursuits/", label: "Kemono suits", body: "Anime-inspired faces with big glossy eyes" },
        { href: "/toony-fursuits/", label: "Toony suits", body: "Bold, expressive cartoon characters" },
        { href: "/furry-ref-sheet-commissions/", label: "Need a reference sheet?", body: "Our artists can draw one before your build" },
        { href: "/#planner", label: "Commission planner", body: "Not sure what to order? Answer a few questions" },
      ]}
    />
  );
}
