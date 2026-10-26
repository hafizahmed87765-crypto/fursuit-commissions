"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { filterLabels, type PortfolioItem, type PortfolioTag } from "@/content/portfolio";

/**
 * Portfolio grid with optional tag filters and an accessible <dialog>
 * lightbox. Filters are derived from the items, so a category only appears
 * when real work exists for it.
 */
export default function PortfolioGrid({ items, filters = false, initial }: { items: PortfolioItem[]; filters?: boolean; initial?: PortfolioTag }) {
  const available = useMemo(() => {
    const tags = new Set(items.flatMap((i) => i.tags));
    return (Object.keys(filterLabels) as PortfolioTag[]).filter((t) => tags.has(t));
  }, [items]);
  const [tag, setTag] = useState<PortfolioTag | "all">(initial && available.includes(initial) ? initial : "all");
  const shown = tag === "all" ? items : items.filter((i) => i.tags.includes(tag));

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : shown[index];

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + shown.length) % shown.length));

  return (
    <div>
      {filters && available.length > 1 ? (
        <div role="group" aria-label="Filter gallery" className="-mx-4 mb-10 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(["all", ...available] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tag === t}
              onClick={() => setTag(t)}
              className={`btn-sm btn shrink-0 ${tag === t ? "bg-forest text-white shadow-toon-sm" : "bg-white text-forest hover:bg-mint-light"}`}
            >
              {t === "all" ? "All work" : filterLabels[t]}
              <span className={`text-xs ${tag === t ? "text-mint-light" : "text-ink-muted"}`}>{t === "all" ? items.length : items.filter((i) => i.tags.includes(t)).length}</span>
            </button>
          ))}
        </div>
      ) : null}

      <ul className="columns-2 gap-4 sm:gap-6 md:columns-3 lg:columns-4">
        {shown.map((it, i) => (
          <li key={it.id} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 8) * 50}ms` }} className="mb-5 break-inside-avoid pt-2 sm:mb-7">
            {/* Polaroid-style frame, alternately tilted; straightens on hover. */}
            <button
              type="button"
              onClick={() => setIndex(i)}
              className={`tape group relative block w-full rounded-xl border-[3px] border-forest bg-white p-2 pb-3 text-left shadow-toon-sm transition duration-300 ease-smooth hover:rotate-0 hover:shadow-toon motion-safe:hover:-translate-y-1 ${["-rotate-1", "rotate-1", "rotate-0", "rotate-[1.5deg]"][i % 4]}`}
            >
              <span className="block overflow-hidden rounded-lg bg-forest/5">
              <Image
                src={it.src}
                alt={it.alt}
                width={it.width}
                height={it.height}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition duration-700 ease-smooth group-hover:scale-[1.05]"
              />
              </span>
              <span className="mt-2.5 block px-1 text-center font-display text-sm font-bold leading-snug text-forest sm:text-[0.95rem]">{it.title}</span>
              <span className="sr-only">Open larger image: {it.title}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === dialogRef.current && setIndex(null)}
        aria-label={current?.title}
        className="m-auto max-h-[92vh] w-[min(92vw,1000px)] rounded-blob bg-white p-0 backdrop:bg-forest/80 backdrop:backdrop-blur-sm"
      >
        {current ? (
          <figure className="flex max-h-[92vh] flex-col">
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
              <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="92vw" className="max-h-[78vh] w-auto object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 p-4">
              <span>
                <span className="block font-display font-semibold text-forest">{current.title}</span>
                <span className="block text-sm text-ink-muted">{current.tags.map((t) => filterLabels[t] ?? t).join(" · ")}</span>
              </span>
              <span className="flex shrink-0 gap-2">
                <button type="button" onClick={() => step(-1)} className="btn-soft btn-sm" aria-label="Previous image">
                  ←
                </button>
                <button type="button" onClick={() => step(1)} className="btn-soft btn-sm" aria-label="Next image">
                  →
                </button>
                <button type="button" onClick={() => setIndex(null)} className="btn-primary btn-sm" autoFocus>
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </div>
  );
}
