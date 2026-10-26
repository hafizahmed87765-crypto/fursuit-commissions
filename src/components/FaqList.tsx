import Link from "next/link";
import type { Faq } from "@/content/faqs";
import { faqLd } from "@/lib/seo";
import JsonLd from "./JsonLd";

export default function FaqList({ faqs, schema = true }: { faqs: Faq[]; schema?: boolean }) {
  return (
    <>
      <div className="divide-y divide-forest/10 toon px-5 sm:px-8">
        {faqs.map((f) => (
          <details key={f.q} className="faq group py-1">
            <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-lg font-semibold text-forest">
              {f.q}
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-forest bg-mint-light text-forest transition-transform duration-300 group-open:rotate-45">
                <svg viewBox="0 0 20 20" className="h-4 w-4"><path fill="currentColor" d="M9 4h2v5h5v2h-5v5H9v-5H4V9h5z" /></svg>
              </span>
            </summary>
            <div className="pb-5 pr-10 text-ink-muted">
              <p>{f.a}</p>
              {f.link ? (
                <p className="mt-2">
                  <Link href={f.link.href} className="link">
                    {f.link.label}
                  </Link>
                </p>
              ) : null}
            </div>
          </details>
        ))}
      </div>
      {schema ? <JsonLd data={faqLd(faqs)} /> : null}
    </>
  );
}
