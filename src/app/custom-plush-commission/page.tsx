import SimpleService from "@/components/SimpleService";
import { portfolio } from "@/content/portfolio";
import { pageMeta } from "@/lib/seo";

const path = "/custom-plush-commission/";
const lede = "Turn your character into a cuddly plush. Every plushie is designed from your reference and sewn by hand, for gifting or displaying.";

export const metadata = pageMeta({ title: "Custom Plush Commissions", description: lede, path });

export default function Page() {
  return (
    <SimpleService
      path={path}
      crumb="Custom Plush"
      eyebrow="Plush commissions"
      title="Custom Plush Commissions"
      lede={lede}
      quoteHref="/get-a-quote/?service=plush"
      points={[
        { title: "Custom sizes & styles", body: "From mini plushies to larger huggable creations, tailored to your vision." },
        { title: "Soft, durable materials", body: "Made to be squeezed, loved and kept for years." },
        { title: "Any character", body: "Your fursona or OC, translated into plush form." },
        { title: "Personal service", body: "One-on-one communication and updates while it's sewn." },
      ]}
      work={portfolio.filter((p) => p.tags.includes("plush"))}
      illustration="/media/gallery/assets-task-01k079dyv3ecr8j7yfrt4evn4r-175259154-ad8448.webp"
    />
  );
}
