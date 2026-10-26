import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import RepairForm from "@/components/forms/RepairForm";
import { repairServices } from "@/content/site";
import { repairFaqs } from "@/content/faqs";
import { pageMeta, serviceLd } from "@/lib/seo";
import CmsFormForPage from "@/components/cms/CmsFormForPage";

const path = "/fursuit-repairs/";

export const metadata = pageMeta({
  title: "Fursuit Repairs & Refurbishment",
  description: "Request a fursuit repair assessment: seam repairs, fur replacement, head refurbishment and alterations. Send photos and we'll tell you honestly what can be fixed.",
  path,
});

const steps = [
  { title: "Describe the issue", body: "Tell us what's damaged, the original maker if known, and what you'd like fixed." },
  { title: "Upload photos", body: "Add clear photos of each piece plus close-ups of every problem area." },
  { title: "Request assessment", body: "Submit the form. This asks for an assessment; it doesn't commit you to anything." },
  { title: "Receive a quote", body: "We tell you honestly whether we can fix it well, and send a quote and shipping instructions if we can." },
  { title: "Confirm the repair", body: "Accept the quote, then ship the suit. Don't send anything before we confirm." },
];

export default function RepairsPage() {
  return (
    <>
      <section className="bg-forest text-white">
        <div className="container-x grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise">
            <div className="[&_a]:text-mint-light [&_li]:text-mint-light [&_span[aria-current]]:text-white">
              <Breadcrumbs items={[{ name: "Repairs & Refurbishment", path }]} />
            </div>
            <p className="eyebrow mt-6 !text-mint">Repairs &amp; refurbishment</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight !text-white sm:text-5xl">Fursuit repairs, starting with an honest assessment</h1>
            <p className="mt-5 max-w-xl text-lg text-mint-light">
              Split seams, tired fur or a head that's lost its shape? Send photos and we'll tell you what can realistically be done before you ship anything.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#repair-form" className="btn bg-mint text-forest hover:bg-mint-light">
                Request a Repair Assessment
              </Link>
              <Link href="#repair-faq" className="btn border-2 border-white/40 text-white hover:bg-white/10">
                Repair FAQ
              </Link>
            </div>
          </div>
          <div className="grid animate-reveal grid-cols-2 gap-3">
            <Image src="/media/gallery/o1cn01w9dus01cnocoqzhzm-4611686018427385509-0-am-4bf73a.webp" alt="Black canine fursuit head mid-way through furring on the workbench" width={1200} height={1600} priority sizes="(min-width:1024px) 22vw, 50vw" className="aspect-[3/4] rounded-blob object-cover" />
            <Image src="/media/gallery/o1cn01bvcrw61cnoaqqcpah-4611686018427385509-0-am-afe8ea.webp" alt="Bare resin fursuit head base before fur is applied" width={1205} height={1600} sizes="(min-width:1024px) 22vw, 50vw" className="mt-10 aspect-[3/4] rounded-blob object-cover" />
          </div>
        </div>
      </section>

      <section aria-labelledby="services" className="container-x py-16 sm:py-20">
        <SectionHeading id="services" eyebrow="What we can look at" title="Common repair requests" lede="Every suit is different, so these are starting points. We'll confirm what's possible for yours after seeing photos." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {repairServices.map((r) => (
            <li key={r.title} data-reveal className="card p-6">
              <h3 className="text-xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-ink-muted">{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink-muted">
          We can't guarantee every suit can be repaired. Some materials, adhesives or earlier repairs make a good fix impractical, and we'll say so rather than take the job.
        </p>
      </section>

      <section aria-labelledby="repair-steps" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading id="repair-steps" eyebrow="How it works" title="From photos to a refreshed suit" />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal className="card flex gap-4 p-5 lg:flex-col">
                <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="repair-form-title" id="repair-form" className="container-x py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading id="repair-form-title" eyebrow="Repair intake" title="Request a repair assessment" />
            <div data-reveal className="mt-6 space-y-3 text-ink-muted">
              <p className="font-semibold text-forest">Photos that help us assess quickly:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>The whole piece, front and back, in good light</li>
                <li>Close-ups of each damaged area</li>
                <li>Inside the head (foam, lining, eyes) if relevant</li>
                <li>Any maker tag or label</li>
              </ul>
              <p>
                Covered by our warranty? Mention your order in the notes. See the{" "}
                <Link href="/terms-and-conditions/" className="link">
                  warranty terms
                </Link>
                .
              </p>
            </div>
          </div>
          <RepairForm />
        </div>
      </section>

      <section aria-labelledby="repair-faq-title" id="repair-faq" className="bg-mint-wash py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading id="repair-faq-title" eyebrow="FAQ" title="Repair questions" lede={<>Planning a new suit instead? <Link href="/get-a-quote/" className="link">Get a commission quote</Link>.</>} />
          <FaqList faqs={repairFaqs} />
        </div>
      </section>
      <CmsFormForPage pagePath={path} />
      <JsonLd data={serviceLd("Fursuit Repairs & Refurbishment", "Repair assessments for fursuits: seam repairs, fur replacement, head refurbishment and alterations.", path)} />
    </>
  );
}
