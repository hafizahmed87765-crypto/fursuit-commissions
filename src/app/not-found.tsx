import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid items-center gap-10 py-20 md:grid-cols-[1fr_1.4fr]">
      <Image src="/brand/icon-src.png" alt="" width={320} height={320} className="mx-auto w-48 -rotate-6 md:w-64" />
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">This page wandered off</h1>
        <p className="lede mt-4">It may have moved when we rebuilt the site. Try one of these instead:</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Home
          </Link>
          <Link href="/gallery/" className="btn-secondary">
            Gallery
          </Link>
          <Link href="/fursuit-parts/" className="btn-secondary">
            Fursuit parts
          </Link>
          <Link href="/get-a-quote/" className="btn-secondary">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
