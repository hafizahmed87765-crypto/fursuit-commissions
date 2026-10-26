import ServiceLanding from "@/components/ServiceLanding";
import { generalFaqs } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

const path = "/fursuit-commission/";
const intro =
  "Heads, partials and fullsuits made from scratch around your reference sheet, in any species and style. You get a personal quote, WIP photos at every stage and worldwide shipping.";

export const metadata = pageMeta({
  title: "Custom Fursuit Commissions: Heads, Partials & Fullsuits",
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
      hero={{ src: "/media/gallery/o1cn01tyheih1cnocozjamh-4611686018427385509-0-am-66696d.webp", width: 1200, height: 1600, alt: "White fursuit bodysuit with pink and blue markings on a stand in the workshop", position: "50% 25%" }}
      traitsTitle="Built around your character, not a template"
      traits={[
        { title: "Any species", body: "Canines, felines, dragons, hybrids and original species. If it's on your ref sheet, we pattern it." },
        { title: "Your markings", body: "Fur colours, patterns and markings are cut and sewn to match your reference." },
        { title: "Any style", body: "Kemono, Toony or somewhere in between. Tell us the look you want." },
        { title: "Made to fit", body: "Bodysuits and paws are sized to your measurements." },
      ]}
      faqs={generalFaqs.slice(0, 8)}
      related={[
        { href: "/kemono-fursuits/", label: "Kemono suits", body: "Anime-inspired faces with big glossy eyes" },
        { href: "/toony-fursuits/", label: "Toony suits", body: "Bold, expressive cartoon characters" },
        { href: "/furry-ref-sheet-commissions/", label: "Need a reference sheet?", body: "Our artists can draw one before your build" },
        { href: "/#planner", label: "Commission planner", body: "Not sure what to order? Answer a few questions" },
      ]}
    />
  );
}
