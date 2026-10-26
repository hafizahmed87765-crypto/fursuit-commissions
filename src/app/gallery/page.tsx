import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PortfolioGrid from "@/components/PortfolioGrid";
import FinalCta from "@/components/FinalCta";
import { portfolio } from "@/content/portfolio";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Fursuit Gallery: Kemono, Toony, Heads & Fullsuits",
  description: "Browse custom fursuit work from our workshop: Kemono and Toony heads, fullsuits, paws, tails and builds in progress.",
  path: "/gallery/",
});

export default function GalleryPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Gallery", path: "/gallery/" }]}
        eyebrow="Gallery"
        title="Our work, from tape pattern to final fur"
        lede={
          <>
            Finished pieces and work in progress from our workshop. Filter by style or part, and tap any photo to see it larger. Want to see your character here?{" "}
            <Link href="/get-a-quote/" className="link">
              Request a quote
            </Link>
            .
          </>
        }
      />
      <section aria-label="Portfolio" className="container-x py-10 sm:py-14">
        <PortfolioGrid items={portfolio} filters />
      </section>
      <FinalCta />
    </>
  );
}
