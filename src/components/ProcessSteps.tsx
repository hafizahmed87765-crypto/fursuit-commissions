import Image from "next/image";
import { processSteps } from "@/content/site";

export default function ProcessSteps({ compact = false }: { compact?: boolean }) {
  if (compact) {
    // Numbered timeline: a line joins the circles on wide screens.
    return (
      <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-7 lg:gap-4">
        <span aria-hidden className="absolute left-[7%] right-[7%] top-7 hidden border-t-[3px] border-dashed border-forest/30 lg:block" />
        {processSteps.map((s, i) => (
          <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }} className="group relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
            <span aria-hidden className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-forest font-display text-xl font-bold shadow-toon-sm transition duration-300 ease-smooth group-hover:-translate-y-1 ${["bg-mint", "bg-lavender", "bg-blush", "bg-white"][i % 4]} text-forest`}>
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold leading-snug lg:mt-2">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {processSteps.map((s, i) => (
        <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 70}ms` }} className="group card card-hover relative flex flex-col overflow-hidden">
          {s.image ? (
            <div className="aspect-[3/2] overflow-hidden bg-mint-wash">
              <Image src={s.image} alt="" width={1536} height={1024} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="img-zoom h-full w-full object-cover" />
            </div>
          ) : null}
          <div className="flex flex-1 gap-4 p-5">
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest font-display text-lg font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{s.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
