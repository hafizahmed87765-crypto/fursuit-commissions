import Image from "next/image";
import { getSiteImages } from "@/lib/site-images";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import { commissionPaymentMethods, depositRules, instalmentFrequencies, paymentFaqs, paymentPlanConfig, paymentTimeline } from "@/content/payments";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Fursuit Payment Plans & Deposits",
  description: "How paying for a custom fursuit works: deposits, remaining balances, payment plans on select orders, accepted payment methods and refund terms.",
  path: "/payment-plans/",
});

const c = paymentPlanConfig;
// Unpublished details fall back to wording that defers to the written quote.
const planDetails = [
  { label: "Number of instalments", value: c.maxInstalments ?? "Set in your written quote" },
  { label: "Instalment schedule", value: c.instalmentInterval ?? "Agreed before you pay" },
  { label: "Processing fee", value: c.processingFee ?? "May apply; stated in your quote" },
  { label: "Eligibility", value: c.minimumOrder ?? "Select orders; ask when you request a quote" },
];

export default async function PaymentPlansPage() {
  const { P3 } = await getSiteImages();
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Payment Plans", path: "/payment-plans/" }]}
        eyebrow="Payment plans"
        title="Paying for your commission, made clear"
        lede="A custom suit is a big purchase, so paying for your commission should be simple. Here's exactly how deposits, balances and weekly or biweekly payment plans work, so there are no surprises between your quote and your doorstep."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/get-a-quote/?paymentPlan=yes" className="btn-primary">
            Request a Custom Quote
          </Link>
          <Link href="#how-it-works" className="btn-secondary">
            See the payment timeline
          </Link>
        </div>
      </PageIntro>

      {/* Deposits */}
      <section aria-labelledby="deposits" className="container-x py-16 sm:py-20">
        <SectionHeading id="deposits" eyebrow="Deposits & balances" title="What you pay to get started" lede="The same simple rule applies to every commission." />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {depositRules.map((r, i) => (
            <li key={r.label} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className={`rounded-blob p-7 ${i ? "bg-forest text-white" : "bg-mint-light"}`}>
              <p className={`font-display text-sm font-semibold uppercase tracking-[0.14em] ${i ? "text-mint" : "text-mint-deep"}`}>{r.label}</p>
              <p className={`mt-2 font-display text-3xl font-bold sm:text-4xl ${i ? "text-white" : "text-forest"}`}>{r.value}</p>
              <p className={`mt-3 ${i ? "text-mint-light" : "text-forest"}`}>{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink-muted">Whatever the order size, full payment must clear before anything ships.</p>
      </section>

      {/* Timeline */}
      <section id="how-it-works" aria-labelledby="timeline" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="timeline" eyebrow="Step by step" title="Your payment timeline" />
          <ol className="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-4">
            <span aria-hidden className="absolute left-5 top-2 h-[calc(100%-1rem)] w-1 rounded-full bg-mint lg:left-0 lg:top-5 lg:h-1 lg:w-full" />
            {paymentTimeline.map((s, i) => (
              <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }} className="relative flex gap-4 lg:flex-col">
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest font-display text-lg font-bold text-white ring-4 ring-mint-wash">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Instalments */}
      <section aria-labelledby="instalments" className="container-x grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHeading
            id="instalments"
            eyebrow="Instalments"
            title="Payment plans on select orders"
            lede="If you'd like to spread the cost of a larger commission, ask for a payment plan when you request your quote. Whether a plan is available depends on the order, and every detail is confirmed in writing before you pay."
          />
          <h3 className="mt-8 text-lg font-semibold">Pay weekly or biweekly</h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {instalmentFrequencies.map((f, i) => (
              <li key={f.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <Link
                  href={`/get-a-quote/?paymentPlan=yes&schedule=${f.title.toLowerCase()}`}
                  className={`group flex h-full flex-col rounded-blob p-6 transition hover:shadow-lift motion-safe:hover:-translate-y-0.5 ${i ? "bg-forest text-white" : "bg-mint-light text-forest"}`}
                >
                  <span className={`text-sm font-semibold uppercase tracking-[0.14em] ${i ? "text-mint" : "text-mint-deep"}`}>{i ? "Every 2 weeks" : "Every week"}</span>
                  <span className={`mt-1 font-display text-3xl font-bold ${i ? "text-white" : "text-forest"}`}>{f.title}</span>
                  <span className={`mt-2 flex-1 text-sm ${i ? "text-mint-light" : "text-forest"}`}>{f.body}</span>
                  <span className="mt-4 font-display text-sm font-semibold">
                    Request a {f.title.toLowerCase()} plan <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2" data-reveal>
            {planDetails.map((d) => (
              <div key={d.label} className="card p-5">
                <dt className="text-sm font-semibold uppercase tracking-wider text-mint-deep">{d.label}</dt>
                <dd className="mt-1 font-display text-lg font-semibold text-forest">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div data-reveal className="card overflow-hidden">
          <Image src={P3.src} alt={P3.alt} width={P3.width} height={P3.height} sizes="(min-width:1024px) 40vw, 100vw" className="w-full" />
          <div className="p-6">
            <h3 className="text-xl font-semibold">How to request a plan</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink-muted">
              <li>
                On the{" "}
                <Link href="/get-a-quote/?paymentPlan=yes" className="link">
                  quote form
                </Link>
                , choose <strong className="text-forest">“Yes”</strong> under “Interested in a payment plan?” and pick weekly or biweekly.
              </li>
              <li>We reply with your quote and, if available, your instalment amounts, due dates and any fee.</li>
              <li>Accept the quote in writing and pay your first payment or deposit to confirm.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section aria-labelledby="methods" className="bg-petal py-16 sm:py-20">
        <div className="container-x grid gap-6">
          <div data-reveal className="card p-7">
            <h2 id="methods" className="text-2xl font-semibold">
              Custom commissions
            </h2>
            <p className="mt-2 text-ink-muted">Deposits, instalments and balances can be paid with:</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {commissionPaymentMethods.map((m) => (
                <li key={m} className="chip px-4 py-2 text-sm">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="pp-faq" className="container-x py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading id="pp-faq" eyebrow="FAQ" title="Deposits, refunds & payments" />
            <ul data-reveal className="mt-8 space-y-3">
              {[
                { href: "/terms-and-conditions/#payments", label: "Payment terms" },
                { href: "/terms-and-conditions/#refunds-and-cancellations", label: "Refunds & cancellations" },
                { href: "/order-process/", label: "Commission process" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link">
                    {l.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <FaqList faqs={paymentFaqs} />
        </div>
      </section>
      <FinalCta />
    </>
  );
}
