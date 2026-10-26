import Image from "next/image";
import Link from "next/link";
import PageIntro from "./PageIntro";
import SectionHeading from "./SectionHeading";
import PortfolioGrid from "./PortfolioGrid";
import JsonLd from "./JsonLd";
import type { PortfolioItem } from "@/content/portfolio";
import { serviceLd } from "@/lib/seo";

/** Lightweight page for secondary services such as reference sheets. */
export default function SimpleService({
  path,
  crumb,
  eyebrow,
  title,
  lede,
  quoteHref,
  points,
  work,
  illustration,
}: {
  path: string;
  crumb: string;
  eyebrow: string;
  title: string;
  lede: string;
  quoteHref: string;
  points: { title: string; body: string }[];
  work?: PortfolioItem[];
  illustration?: string;
}) {
  return (
    <>
      <PageIntro crumbs={[{ name: crumb, path }]} eyebrow={eyebrow} title={title} lede={lede}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={quoteHref} className="btn-primary">
            Get a quote
          </Link>
          <Link href="/order-process/" className="btn-secondary">
            How ordering works
          </Link>
        </div>
      </PageIntro>
      <section aria-labelledby="offer" className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading id="offer" eyebrow="What you get" title="Made to your reference" />
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p.title} data-reveal className="border-l-4 border-mint pl-5">
                <h3 className="text-xl font-semibold">{p.title}</h3>
                <p className="mt-1 text-ink-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
        {illustration ? <Image data-reveal src={illustration} alt="" width={1536} height={1024} sizes="(min-width:1024px) 35vw, 100vw" className="rounded-blob" /> : null}
      </section>
      {work?.length ? (
        <section id="gallery" aria-labelledby="work" className="bg-mint-wash py-16 sm:py-20">
          <div className="container-x">
            <SectionHeading id="work" eyebrow="Gallery" title="Recent pieces" />
            <div className="mt-10">
              <PortfolioGrid items={work} />
            </div>
          </div>
        </section>
      ) : null}
      <JsonLd data={serviceLd(title, lede, path)} />
    </>
  );
}
