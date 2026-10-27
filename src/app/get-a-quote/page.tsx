import { Suspense } from "react";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import QuoteForm from "@/components/forms/QuoteForm";
import { policies } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import CmsFormForPage from "@/components/cms/CmsFormForPage";

export const metadata = pageMeta({
  title: "Get a Free Custom Fursuit Quote",
  description: "Request a free, no-obligation quote for a custom fursuit, Kemono or Toony suit, partial, head or parts. Upload your reference sheet and we'll reply with pricing and a timeline.",
  path: "/get-a-quote/",
});

export default function QuotePage() {
  return (
    <>
      <PageIntro
        crumbs={[{ name: "Get a Quote", path: "/get-a-quote/" }]}
        eyebrow="Free quote"
        title="Start your commission"
        lede="Request your free fursuit quote: tell us about your character and what you'd like made. It takes about five minutes, your answers are kept as you move between steps, and nothing is booked until you accept your quote."
      />
      <div className="container-x grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_320px]">
        <Suspense fallback={<div className="card h-96 animate-pulse" aria-label="Loading form" />}>
          <QuoteForm />
        </Suspense>
        <aside className="space-y-5 text-sm">
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Good to know</h2>
            <ul className="mt-3 space-y-2 text-ink-muted">
              <li>• Quotes are free and you're under no obligation.</li>
              <li>• A clear reference sheet is required before production. We can draw one for you.</li>
              <li>• Typical production time is {policies.typicalProduction}; your quote includes an estimate.</li>
              <li>• Clients must be {policies.minimumAge}+ (or have guardian approval).</li>
              <li>
                • Over $500? Start with an upfront payment;{" "}
                <Link href="/payment-plans/" className="link font-normal">
                  payment plans
                </Link>{" "}
                may be available.
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold">Not sure what to choose?</h2>
            <p className="mt-2 text-ink-muted">
              Try the{" "}
              <Link href="/#planner" className="link">
                commission planner
              </Link>{" "}
              or browse the{" "}
              <Link href="/gallery/" className="link">
                gallery
              </Link>
              .
            </p>
            <p className="mt-2 text-ink-muted">
              Need a repair?{" "}
              <Link href="/fursuit-repairs/#repair-form" className="link">
                Request an assessment
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
      <CmsFormForPage pagePath="/get-a-quote/" />
    </>
  );
}
