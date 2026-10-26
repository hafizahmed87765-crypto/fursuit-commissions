import Image from "next/image";
import { processSteps } from "@/content/site";

export default function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={`mt-10 grid gap-5 ${compact ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {processSteps.map((s, i) => (
        <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 70}ms` }} className="card relative flex flex-col overflow-hidden">
          {!compact && s.image ? (
            <div className="aspect-[3/2] overflow-hidden bg-mint-wash">
              <Image src={s.image} alt="" width={1536} height={1024} sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="h-full w-full object-cover" />
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
