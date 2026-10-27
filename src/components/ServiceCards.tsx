"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import type { SiteImage } from "@/lib/site-images";
import Paw from "./Paw";

// Styled like convention badges; the trait lines come from each style's landing page.
const services = [
  {
    key: "kemono",
    title: "Kemono Fursuits",
    header: "bg-lavender",
    tilt: "lg:-rotate-2",
    body: "Anime-inspired faces with big glossy eyes, soft rounded features and doll-like charm.",
    traits: ["Anime eyes", "Soft, rounded face", "Hair & wigs"],
    href: "/kemono-fursuits/",
    image: "/media/work/kemono-lavender-wolf-fursuit-head-1.webp",
    alt: "Kemono-style white and lavender wolf fursuit head with purple stripes, big violet anime eyes and an orange chest mark, front view",
    w: 1067,
    h: 1600,
  },
  {
    key: "toony",
    title: "Toony Fursuits",
    header: "bg-blush",
    tilt: "lg:translate-y-6",
    body: "Bold shapes, bright colours and big personality. Expressive cartoon characters made huggable.",
    traits: ["Expressive eyes", "Exaggerated features", "Bright colour blocks"],
    href: "/toony-fursuits/",
    image: "/media/work/toony-teal-ear-husky-fursuit-head-1.webp",
    alt: "Toony-style black and white husky fursuit head with teal ears, lime cheek fluff, blue and yellow anime eyes and a studded bell collar, front view",
    w: 1067,
    h: 1600,
  },
  {
    key: "custom",
    title: "Custom Fursuits",
    header: "bg-mint",
    tilt: "lg:rotate-2",
    body: "Any species, any style. Heads, partials and fullsuits patterned around your reference sheet.",
    traits: ["Any species", "Your markings", "Made to fit"],
    href: "/fursuit-commission/",
    image: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-1.webp",
    alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, full-body front view",
    w: 900,
    h: 1600,
  },
];

/** `images` comes from the server (Admin > Site images slots H4–H6); built-in photos are the fallback. */
export default function ServiceCards({ images }: { images?: Partial<Record<"kemono" | "toony" | "custom", SiteImage>> }) {
  return (
    <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-7">
      {services.map((s, i) => (
        <li key={s.key} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
          <Link
            href={s.href}
            onClick={() => track("service_selection", { service: s.key, location: "home_style_cards" })}
            className={`group toon toon-hover relative flex h-full flex-col ${s.tilt}`}
          >
            {/* Lanyard clip */}
            <span aria-hidden className="absolute -top-7 left-1/2 h-10 w-5 -translate-x-1/2 rounded-full border-[3px] border-forest bg-white" />
            <div className={`rounded-t-[1.7rem] border-b-[3px] border-forest px-6 pb-3 pt-6 text-center ${s.header}`}>
              <span aria-hidden className="mx-auto mb-2 block h-2.5 w-12 rounded-full border-2 border-forest bg-white" />
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-forest">Style badge</p>
              <h3 className="mt-0.5 text-[1.7rem] font-bold leading-tight">{s.title}</h3>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="overflow-hidden rounded-2xl border-[3px] border-forest bg-black">
                <Image src={images?.[s.key as "kemono"]?.src ?? s.image} alt={images?.[s.key as "kemono"]?.alt ?? s.alt} width={images?.[s.key as "kemono"]?.width ?? s.w} height={images?.[s.key as "kemono"]?.height ?? s.h} sizes="(min-width: 768px) 30vw, 90vw" className="img-zoom aspect-square w-full object-cover object-[50%_30%]" />
              </div>
              <p className="mt-4 flex-1 text-ink-muted">{s.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.traits.map((t) => (
                  <li key={t} className="chip gap-1 bg-white">
                    <Paw className="h-3 w-3 text-mint-deep" />
                    {t}
                  </li>
                ))}
              </ul>
              <span className="mt-5 flex items-center justify-between border-t-[3px] border-dashed border-forest/20 pt-4 font-display font-bold text-forest">
                Explore {s.title}
                <span aria-hidden className="transition-transform duration-300 ease-smooth group-hover:translate-x-1.5">→</span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
