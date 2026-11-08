import Image from "next/image";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import FinalCta from "@/components/FinalCta";
import { guides } from "@/content/guides";
import { pageMeta } from "@/lib/seo";

const path = "/guides/";

export const metadata = pageMeta({
  title: "Fursuit Guides & Blog: Measuring, Care, Styles & Builds",
  description: "Free fursuit guides and studio blog: how to measure for a fursuit, how to clean and care for your suit, Kemono vs Toony styles, and real ref-sheet-to-fursuit builds.",
  path,
});

export default function GuidesPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Guides & Blog", path }]}
        eyebrow="Guides & blog"
        title="Fursuit guides and stories from the studio"
        lede="Practical fursuit guides for owners and future owners, plus real builds from our workshop. Measure yourself, care for your suit, pick a style and see how a ref sheet becomes a fursuit."
      />
      <section aria-label="Guides and articles" className="container-x py-12 sm:py-16">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((g, i) => (
            <li key={g.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
              <Link href={`/guides/${g.slug}/`} className="toon toon-hover group flex h-full flex-col overflow-hidden">
                <span className="relative block overflow-hidden">
                  <Image src={g.image.src} alt={g.image.alt} width={g.image.width} height={g.image.height} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover transition duration-700 ease-smooth group-hover:scale-105" />
                  <span className={`absolute left-3 top-3 rounded-full border-2 border-forest px-2.5 py-0.5 text-xs font-bold text-forest ${g.kind === "Blog" ? "bg-lavender" : "bg-mint"}`}>{g.kind}</span>
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span className="font-display text-xl font-bold leading-snug text-forest">{g.title}</span>
                  <span className="mt-2 text-sm text-ink-muted">{g.description}</span>
                  <span className="mt-auto pt-4 text-sm font-semibold text-forest">{g.readMinutes} min read →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-ink-muted" data-reveal>
          Looking for studio news? Visit the <Link href="/journal/" className="link">journal</Link>.
        </p>
      </section>
      <FinalCta />
    </>
  );
}
