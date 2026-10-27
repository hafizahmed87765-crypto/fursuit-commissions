import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PortfolioGrid from "@/components/PortfolioGrid";
import WorkShowcase from "@/components/WorkShowcase";
import SectionHeading from "@/components/SectionHeading";
import FinalCta from "@/components/FinalCta";
import { portfolio } from "@/content/portfolio";
import { work } from "@/content/work";
import { pageMeta } from "@/lib/seo";
import { getPlacementItems } from "@/lib/gallery-placements";

export const metadata = pageMeta({
  title: "Fursuit Gallery: Kemono & Toony Fursuits, Custom Furry Costumes",
  description: "Browse custom Kemono and Toony fursuits from our workshop. Swipe through every angle of each character's fursuit head, partial and fullsuit, plus paws, tails and builds in progress.",
  path: "/gallery/",
  image: work[0].photos[0].src,
});

export default async function GalleryPage() {
  const items = (await getPlacementItems("gallery")) ?? portfolio;
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Gallery", path: "/gallery/" }]}
        eyebrow="Gallery"
        title="Our work, from tape pattern to final fur"
        lede={
          <>
            Our fursuit gallery collects the Kemono and Toony fursuits we have built, from tape patterns to final fur, one card per character. Swipe a card for more angles, filter by style, and tap any photo to see it larger. Want to see your character here?{" "}
            <Link href="/get-a-quote/" className="link">
              Request a quote
            </Link>
            .
          </>
        }
      />
      <section aria-labelledby="characters" className="container-x py-10 sm:py-14">
        <h2 id="characters" className="sr-only">Fursuits by character</h2>
        <WorkShowcase products={work} filters />
      </section>
      <section aria-labelledby="parts" className="container-x pb-16 sm:pb-24">
        <SectionHeading id="parts" eyebrow="More from the workshop" title="Paws, tails and builds in progress" mark="in progress" />
        <div className="mt-10">
          <PortfolioGrid items={items} filters />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
