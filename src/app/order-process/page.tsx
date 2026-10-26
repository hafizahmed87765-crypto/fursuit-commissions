import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import ProcessSteps from "@/components/ProcessSteps";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { policies, site } from "@/content/site";
import { generalFaqs } from "@/content/faqs";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Our Fursuit Commission Process",
  description: "How a custom fursuit commission works: references, quote, deposit, measurements, WIP updates, final approval, shipping and aftercare.",
  path: "/order-process/",
});

const details: { title: string; body: string; link?: { href: string; label: string } }[] = [
  {
    title: "Communication",
    body: "We talk with you one-on-one by email (and Discord, Telegram or WhatsApp if you prefer) from your first inquiry until delivery.",
  },
  {
    title: "Payments",
    body: `${policies.deposit} ${policies.paymentPlans} Commission payments are accepted via ${site.paymentMethods.join(" and ")}.`,
    link: { href: "/payment-plans/", label: "Deposits & payment plans" },
  },
  {
    title: "Approvals & revisions",
    body: "Work begins only after you approve the design. You'll see WIP photos at every major stage, and revisions are welcome while we build.",
  },
  {
    title: "Timeline",
    body: `Production takes ${policies.typicalProduction}, depending on complexity. Your quote includes an estimated timeline for your specific build.`,
  },
  {
    title: "Shipping",
    body: "We ship worldwide. Shipping and insurance are included in your final quote; import duties and taxes are paid by the buyer.",
  },
  {
    title: "Aftercare & warranty",
    body: `Commissions include a ${policies.warrantyMonths}-month limited warranty against manufacturing defects such as seam failures or structural foam issues.`,
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Our Process", path: "/order-process/" }]}
        eyebrow="Our process"
        title="How a commission works"
        lede="From your first message to unboxing day, here's exactly what happens and what we need from you at each step."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/get-a-quote/" className="btn-primary">
            Start Your Commission
          </Link>
          <Link href="/payment-plans/" className="btn-secondary">
            Payment plans
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="steps" className="container-x py-16 sm:py-20">
        <SectionHeading id="steps" eyebrow="Step by step" title="Seven steps to your suit" />
        <ProcessSteps />
      </section>

      <section aria-labelledby="details" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="details" eyebrow="The details" title="Payments, timing and shipping" />
          <dl className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.title} data-reveal className="card p-6">
                <dt className="font-display text-xl font-semibold text-forest">{d.title}</dt>
                <dd className="mt-2 text-ink-muted">{d.body}</dd>
                {d.link ? (
                  <dd className="mt-3">
                    <Link href={d.link.href} className="link">
                      {d.link.label} →
                    </Link>
                  </dd>
                ) : null}
              </div>
            ))}
          </dl>
          <p className="mt-8 text-ink-muted">
            Choosing a style? Compare{" "}
            <Link href="/kemono-fursuits/" className="link">
              Kemono
            </Link>
            ,{" "}
            <Link href="/toony-fursuits/" className="link">
              Toony
            </Link>{" "}
            and{" "}
            <Link href="/fursuit-commission/" className="link">
              custom fursuits
            </Link>
            .
          </p>
        </div>
      </section>

      <section aria-labelledby="faq" className="container-x py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="faq" eyebrow="FAQ" title="Process questions" />
          <FaqList faqs={generalFaqs.filter((f) => /reference|prices|production|payment|after I submit|ship/.test(f.q))} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
