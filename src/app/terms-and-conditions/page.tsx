import PageIntro from "@/components/PageIntro";
import { site } from "@/content/site";
import { terms, termsUpdated } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Terms of Service",
  description: "Terms for commissions and orders at FursuitCommissions.com: eligibility, payments and deposits, refunds, shipping, warranty and intellectual property.",
  path: "/terms-and-conditions/",
});

export default function TermsPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Terms of Service", path: "/terms-and-conditions/" }]}
        title="Terms of Service"
        lede={`Last updated ${termsUpdated}. By submitting a commission inquiry, placing an order, or using any of our services at FursuitCommissions.com, you agree to the following Terms of Service.`}
      />
      <article className="container-x max-w-3xl py-12">
        <nav aria-label="On this page" className="card mb-10 p-6">
          <h2 className="text-lg font-semibold">On this page</h2>
          <ol className="mt-3 grid gap-1 sm:grid-cols-2">
            {terms.map((t) => (
              <li key={t.heading}>
                <a href={`#${t.heading.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="link font-normal">
                  {t.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {terms.map((t) => (
          <section key={t.heading} id={t.heading.toLowerCase().replace(/[^a-z]+/g, "-")} className="mb-10">
            <h2 className="text-2xl font-semibold">{t.heading}</h2>
            {t.items ? (
              <ul className="mt-3 list-disc space-y-2 pl-6 text-ink">
                {t.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-ink">{t.text}</p>
            )}
          </section>
        ))}
        <p className="text-ink">
          Questions about these terms?{" "}
          {site.email ? (
            <a href={`mailto:${site.email}`} className="link">
              {site.email}
            </a>
          ) : null}
        </p>
      </article>
    </>
  );
}
