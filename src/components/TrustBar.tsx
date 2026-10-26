import { policies } from "@/content/site";
import Paw from "./Paw";

// Only facts the studio already publishes in its About page and Terms.
const items = ["Handmade to order", "WIP photos at every stage", `${policies.warrantyMonths}-month limited warranty`, "Ships worldwide", "Kemono & Toony styles", "Repair assessments", "Deposits & payment plans"];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 items-center gap-8 pr-8 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2 ${hidden ? "motion-reduce:hidden" : ""}`}>
      {items.map((it) => (
        <li key={it} className="flex items-center gap-8 whitespace-nowrap">
          {it}
          <Paw className="h-5 w-5 text-mint" />
        </li>
      ))}
    </ul>
  );
}

/** Tilted sticker band of selling points; scrolls, pauses on hover, wraps under reduced motion. */
export default function TrustBar() {
  return (
    <div className="relative z-10 -mt-6 overflow-hidden py-5">
      <section aria-label="Why commission with us" className="-mx-4 -rotate-[1.5deg] border-y-[3px] border-forest bg-forest py-3.5 font-display text-lg font-bold text-mint-light shadow-toon sm:text-xl">
        <div className="marquee-track">
          <Row />
          <Row hidden />
        </div>
      </section>
    </div>
  );
}
