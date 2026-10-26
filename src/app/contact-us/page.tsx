import { Suspense } from "react";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import ContactForm from "@/components/forms/ContactForm";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Questions about a fursuit commission, an order or a repair? Send FursuitCommissions.com a message.",
  path: "/contact-us/",
});

export default function ContactPage() {
  return (
    <>
      <PageIntro crumbs={[{ name: "Contact", path: "/contact-us/" }]} eyebrow="Contact" title="Say hello" lede="Questions about an order, a product or how commissions work? Send us a message and we'll reply by email." />
      <div className="container-x grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.5fr_1fr]">
        <Suspense fallback={<div className="card h-96 animate-pulse" />}>
          <ContactForm />
        </Suspense>
        <aside className="space-y-5">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Looking for a quote?</h2>
            <p className="mt-2 text-ink-muted">The quote form collects everything we need to price your suit, including reference uploads.</p>
            <Link href="/get-a-quote/" className="btn-primary btn-sm mt-4">
              Get a quote
            </Link>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Find us online</h2>
            {site.email ? (
              <p className="mt-2">
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            ) : null}
            <ul className="mt-3 flex flex-wrap gap-2">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener" className="btn-soft btn-sm">
                    {s.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
