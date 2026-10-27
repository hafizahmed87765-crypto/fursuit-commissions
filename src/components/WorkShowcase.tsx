"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { WorkProduct } from "@/content/work";

type Filter = "all" | "kemono" | "toony" | "suits" | "workshop";
const filterDefs: { key: Filter; label: string; test: (p: WorkProduct) => boolean }[] = [
  { key: "all", label: "All characters", test: () => true },
  { key: "kemono", label: "Kemono", test: (p) => p.style === "kemono" },
  { key: "toony", label: "Toony", test: (p) => p.style === "toony" },
  { key: "suits", label: "Fullsuits & partials", test: (p) => p.tags.includes("fullsuit") || p.tags.includes("partial") },
  { key: "workshop", label: "Workshop", test: (p) => p.style === "workshop" },
];

const styleLabel = { kemono: "Kemono", toony: "Toony", workshop: "Workshop" } as const;

/**
 * Character cards, each a swipeable photo slider (CSS scroll-snap, no library).
 * Speed: only each card's cover photo loads up front; the next photo loads on
 * hover/focus, and the rest load as the customer swipes. One shared <dialog>
 * shows the photos large.
 */
export default function WorkShowcase({ products, filters = false }: { products: WorkProduct[]; filters?: boolean }) {
  const available = filterDefs.filter((f) => f.key === "all" || products.some(f.test));
  const [filter, setFilter] = useState<Filter>("all");
  const shown = products.filter(filterDefs.find((f) => f.key === filter)!.test);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<{ p: WorkProduct; i: number } | null>(null);
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const step = (dir: 1 | -1) => setOpen((o) => (o ? { p: o.p, i: (o.i + dir + o.p.photos.length) % o.p.photos.length } : o));
  const photo = open?.p.photos[open.i];

  return (
    <div>
      {filters && available.length > 2 ? (
        <div role="group" aria-label="Filter by style" className="-mx-4 mb-10 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {available.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`btn-sm btn shrink-0 ${filter === f.key ? "bg-forest text-white shadow-toon-sm" : "bg-white text-forest hover:bg-mint-light"}`}
            >
              {f.label}
              <span className={`text-xs ${filter === f.key ? "text-mint-light" : "text-ink-muted"}`}>{products.filter(f.test).length}</span>
            </button>
          ))}
        </div>
      ) : null}

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <li key={p.slug}>
            <WorkCard p={p} onOpen={(i) => setOpen({ p, i })} />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => e.target === dialogRef.current && setOpen(null)}
        aria-label={open?.p.title}
        className="m-auto max-h-[92vh] w-[min(92vw,900px)] rounded-blob bg-white p-0 backdrop:bg-forest/80 backdrop:backdrop-blur-sm"
      >
        {open && photo ? (
          <figure className="flex max-h-[92vh] flex-col">
            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-black">
              <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(min-width: 980px) 900px, 92vw" className="max-h-[76vh] w-auto object-contain" />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 p-4">
              <span className="min-w-0">
                <span className="block font-display font-semibold text-forest">{open.p.title}</span>
                <span className="block text-sm text-ink-muted">
                  Photo {open.i + 1} of {open.p.photos.length}
                </span>
              </span>
              <span className="flex shrink-0 gap-2">
                {open.p.photos.length > 1 ? (
                  <>
                    <button type="button" onClick={() => step(-1)} className="btn-soft btn-sm" aria-label="Previous photo">←</button>
                    <button type="button" onClick={() => step(1)} className="btn-soft btn-sm" aria-label="Next photo">→</button>
                  </>
                ) : null}
                <button type="button" onClick={() => setOpen(null)} className="btn-primary btn-sm" autoFocus>
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

function WorkCard({ p, onOpen }: { p: WorkProduct; onOpen: (i: number) => void }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  // Highest slide allowed to load: -1 until the customer shows interest.
  const [reach, setReach] = useState(-1);
  const count = p.photos.length;
  const warm = () => setReach((r) => Math.max(r, 0));

  const go = (n: number) => {
    const t = track.current;
    if (!t) return;
    const next = (n + count) % count;
    setReach((r) => Math.max(r, next));
    t.scrollTo({ left: next * t.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const i = Math.round(t.scrollLeft / t.clientWidth);
    setIndex(i);
    setReach((r) => Math.max(r, i));
  };

  return (
    <article
      data-reveal
      onPointerEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      className="group flex h-full flex-col overflow-hidden rounded-xl border-[3px] border-forest bg-white shadow-toon-sm transition duration-300 ease-smooth hover:shadow-toon motion-safe:hover:-translate-y-1"
      aria-roledescription="carousel"
      aria-label={p.title}
    >
      <div className="relative">
        <div ref={track} onScroll={onScroll} className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-forest/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {p.photos.map((ph, i) => (
            <button
              key={ph.src}
              type="button"
              onClick={() => onOpen(i)}
              className="relative h-full w-full shrink-0 snap-center"
              aria-roledescription="slide"
              aria-label={`Photo ${i + 1} of ${count}, open larger`}
            >
              {i <= Math.max(0, reach + 1) ? (
                <Image src={ph.src} alt={ph.alt} fill sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover" />
              ) : null}
            </button>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-forest bg-white/90 font-bold text-forest shadow-toon-sm transition hover:bg-mint-light sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
              ‹
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 border-forest bg-white/90 font-bold text-forest shadow-toon-sm transition hover:bg-mint-light sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100">
              ›
            </button>
            <span className="absolute right-2 top-2 rounded-full bg-forest/85 px-2.5 py-0.5 text-xs font-bold text-white" aria-hidden>
              {index + 1}/{count}
            </span>
            <span className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden>
              {p.photos.slice(0, 10).map((ph, i) => (
                <span key={ph.src} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </span>
          </>
        ) : null}
        {p.style !== "workshop" ? (
          <span className="absolute left-2 top-2 rounded-full border-2 border-forest bg-mint px-2.5 py-0.5 text-xs font-bold text-forest">{styleLabel[p.style]}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-bold leading-snug text-forest">{p.title}</h3>
        {p.note ? <p className="mt-1 text-sm text-ink-muted">{p.note}</p> : null}
        <p className="mt-auto pt-2 text-xs font-semibold text-ink-muted">{count > 1 ? `${count} photos · swipe or tap to enlarge` : "Tap to enlarge"}</p>
      </div>
    </article>
  );
}
