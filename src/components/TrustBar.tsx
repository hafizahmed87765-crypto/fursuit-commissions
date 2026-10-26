import { policies } from "@/content/site";

// Only facts the studio already publishes in its About page and Terms.
const items = [
  { title: "Handmade to order", body: "Patterned from your reference sheet" },
  { title: "WIP photos", body: "At every major build stage" },
  { title: `${policies.warrantyMonths}-month warranty`, body: "Limited, on commissions" },
  { title: "Ships worldwide", body: "Tracked delivery to your door" },
  { title: "Clear payment terms", body: "Deposits & plans on select orders" },
];

export default function TrustBar() {
  return (
    <section aria-label="Why commission with us" className="border-y border-forest/10 bg-white">
      <ul className="container-x grid grid-cols-2 gap-x-6 gap-y-5 py-7 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((it, i) => (
          <li key={it.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="flex items-start gap-3">
            <span aria-hidden className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint text-forest">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5"><path fill="currentColor" d="M7.6 13.2 4.4 10l-1.4 1.4 4.6 4.6 9.4-9.4L15.6 5z" /></svg>
            </span>
            <span>
              <span className="block font-display font-semibold text-forest">{it.title}</span>
              <span className="block text-sm text-ink-muted">{it.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
