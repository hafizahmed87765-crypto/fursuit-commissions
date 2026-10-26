import SimpleService from "@/components/SimpleService";
import { portfolio } from "@/content/portfolio";
import { pageMeta } from "@/lib/seo";

const path = "/cosplay-suit-commission/";
const lede = "Handmade cosplay costumes tailored to your character and your measurements, built convention-ready with the same care as our fursuit work.";

export const metadata = pageMeta({ title: "Custom Cosplay Suit Commissions", description: lede, path });

export default function Page() {
  return (
    <SimpleService
      path={path}
      crumb="Cosplay Suits"
      eyebrow="Cosplay commissions"
      title="Custom Cosplay Suit Commissions"
      lede={lede}
      quoteHref="/get-a-quote/?service=cosplay"
      points={[
        { title: "Fully customised", body: "Built to your design and measurements, from armour details to fabric choices." },
        { title: "Comfort & durability", body: "Quality fabrics and careful construction for long convention days." },
        { title: "Regular updates", body: "Clear communication and progress photos while your costume is made." },
        { title: "Original characters", body: "OCs are our favourite. We can't accept copies of copyrighted designs without licensing." },
      ]}
      work={portfolio.filter((p) => p.tags.includes("cosplay"))}
    />
  );
}
