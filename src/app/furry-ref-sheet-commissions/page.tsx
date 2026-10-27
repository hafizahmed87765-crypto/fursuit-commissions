import SimpleService from "@/components/SimpleService";
import { getSiteImages } from "@/lib/site-images";
import { pageMeta } from "@/lib/seo";

const path = "/furry-ref-sheet-commissions/";
const lede = "No reference sheet yet? Our artists draw clear, fursuit-accurate fursona reference sheets so your character can be built exactly as you imagine.";

export const metadata = pageMeta({ title: "Fursona Reference Sheet Commissions", description: lede, path });

export default async function Page() {
  const { P7 } = await getSiteImages();
  return (
    <SimpleService
      path={path}
      crumb="Reference Sheets"
      eyebrow="Reference sheets"
      title="Fursona Reference Sheet Commissions"
      lede={lede}
      quoteHref="/get-a-quote/?service=refsheet"
      points={[
        { title: "Fursuit accuracy", body: "Drawn with markings, colours and proportions a maker can build from." },
        { title: "From any starting point", body: "Descriptions, sketches, old art or inspiration photos all work." },
        { title: "Required for production", body: "A clear ref sheet is needed before any fursuit build begins." },
        { title: "Use it everywhere", body: "Great for future art commissions and parts orders too." },
      ]}
      details={{
        eyebrow: "Why commission a reference sheet?",
        title: "One clear guide to your character",
        lede: "A thoughtfully organized reference makes it easier to share your character's design with makers and artists, and gives you a consistent visual guide for future projects.",
        points: [
          { title: "Keep details consistent", body: "Bring colours, markings, proportions and distinctive features together in one place." },
          { title: "Make your design easier to follow", body: "Clear views and notes help communicate details that can be hard to explain in words alone." },
          { title: "Start with what you have", body: "Share descriptions, sketches, older art or inspiration images when you request a quote. You don't need a finished sheet to get started." },
        ],
      }}
      illustration={P7.src}
    />
  );
}
