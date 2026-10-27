import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import FinalCta from "@/components/FinalCta";
import Paw from "@/components/Paw";
import CmsFormForPage from "@/components/cms/CmsFormForPage";
import { pricingFaqs } from "@/content/faqs";
import { commissionOptions, policies, site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

const path = "/fursuit-prices/";

export const metadata = pageMeta({
  title: "Fursuit Commission Prices & Custom Fursuit Cost",
  description:
    "How much does a custom fursuit cost? What affects fursuit and furry costume prices, our published starting prices, deposits, payment plans and timelines.",
  path,
});

const formatPrice = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

// Only prices the studio publishes (site.ts). Heads, partials and fullsuits are quoted.
const rows = commissionOptions.map((o) => ({ title: o.title, blurb: o.blurb, price: o.from ? `From ${formatPrice(o.from)}` : "Quoted to your design", href: "href" in o ? o.href : `/get-a-quote/?coverage=${o.key}` }));

const factors = [
  { title: "Coverage", body: "A head, a partial (head, hand paws and tail) or a fullsuit. More pieces means more patterning and sewing." },
  { title: "Style", body: "Kemono and Toony heads are built differently, from eye style to face shape." },
  { title: "Markings & colours", body: "Every extra marking is patterned, cut and sewn in. Complex patterns take longer than solid colours." },
  { title: "Leg style", body: "Digitigrade bodysuits add padding for an animal leg shape; plantigrade suits follow human legs." },
  { title: "Hair & extras", body: "Wigs, hair, horns, accessories and other extras are priced into your quote." },
  { title: "Reference sheet", body: "A clear ref sheet is required. If you need one drawn, that's quoted separately." },
];

export default function FursuitPricesPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Fursuit Prices", path }]}
        eyebrow="Fursuit commission prices"
        title="How much does a custom fursuit cost?"
        lede="Every fursuit and furry costume is quoted to your character, so the honest answer is: it depends on what you're building. Here's exactly what affects the price, plus the starting prices we publish."
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/get-a-quote/" className="btn-primary">
            Get a free quote
          </Link>
          <Link href="/payment-plans/" className="btn-secondary">
            Payment plans
          </Link>
        </div>
      </PageIntro>

      <section aria-labelledby="factors" className="container-x py-16 sm:py-20">
        <SectionHeading id="factors" eyebrow="What affects your quote" title="What goes into a fursuit price" mark="fursuit price" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {factors.map((f, i) => (
            <li key={f.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }} className="toon p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Paw className="h-5 w-5 text-mint-deep" />
                {f.title}
              </h3>
              <p className="mt-2 text-ink-muted">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="prices" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading
            id="prices"
            eyebrow="Published prices"
            title="Fursuit prices by commission type"
            lede="Starting prices are for a standard build. Heads, partials and fullsuits vary too much between characters to list a fair fixed price, so they're quoted individually."
          />
          <div className="mt-10 overflow-x-auto" data-reveal>
            <table className="toon w-full min-w-[560px] border-separate border-spacing-0 overflow-hidden text-left">
              <thead>
                <tr className="bg-mint">
                  <th scope="col" className="p-4 font-display text-lg">Commission</th>
                  <th scope="col" className="p-4 font-display text-lg">What&apos;s included</th>
                  <th scope="col" className="p-4 font-display text-lg">Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.title} className="odd:bg-white even:bg-mint-wash">
                    <th scope="row" className="p-4 font-display font-semibold">
                      <Link href={r.href} className="hover:underline">{r.title}</Link>
                    </th>
                    <td className="p-4 text-ink-muted">{r.blurb}</td>
                    <td className="whitespace-nowrap p-4 font-display font-bold">{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-ink-muted" data-reveal>Prices in USD. Your final quote confirms the price before you pay anything.</p>
        </div>
      </section>

      <section aria-labelledby="paying" className="container-x grid gap-8 py-16 sm:py-20 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SectionHeading id="paying" eyebrow="Paying for your fursuit" title="Deposits, plans and timing" />
        </div>
        <dl className="grid gap-5 sm:grid-cols-2 lg:col-span-2" data-reveal>
          <div className="toon p-6"><dt className="font-display text-xl font-bold">Deposits</dt><dd className="mt-2 text-ink-muted">{policies.deposit}</dd></div>
          <div className="toon p-6"><dt className="font-display text-xl font-bold">Payment plans</dt><dd className="mt-2 text-ink-muted">{policies.paymentPlans} <Link href="/payment-plans/" className="link">How plans work</Link></dd></div>
          <div className="toon p-6"><dt className="font-display text-xl font-bold">Timeline</dt><dd className="mt-2 text-ink-muted">Production takes {policies.typicalProduction}, depending on complexity. Your quote includes an estimate.</dd></div>
          <div className="toon p-6"><dt className="font-display text-xl font-bold">Payment methods</dt><dd className="mt-2 text-ink-muted">Commission invoices are paid via {site.paymentMethods.join(" or ")}. Shipping and insurance are included in your final quote.</dd></div>
        </dl>
      </section>

      <section aria-labelledby="faq" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading id="faq" eyebrow="FAQ" title="Fursuit pricing questions" />
            <p className="mt-6" data-reveal>
              Ready for a number? <Link href="/get-a-quote/" className="link">Request your custom fursuit quote</Link> or read{" "}
              <Link href="/order-process/" className="link">how the commission process works</Link>.
            </p>
          </div>
          <FaqList faqs={pricingFaqs} />
        </div>
      </section>

      <FinalCta />
      <CmsFormForPage pagePath={path} />
    </>
  );
}
