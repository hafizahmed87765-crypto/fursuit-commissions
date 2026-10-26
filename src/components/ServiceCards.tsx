"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import Paw from "./Paw";

// Styled like convention badges; the trait lines come from each style's landing page.
const services = [
  {
    key: "kemono",
    title: "Kemono Suits",
    header: "bg-lavender",
    tilt: "lg:-rotate-2",
    body: "Anime-inspired faces with big glossy eyes, soft rounded features and doll-like charm.",
    traits: ["Anime eyes", "Soft, rounded face", "Hair & wigs"],
    href: "/kemono-fursuits/",
    image: "/media/products/d4rgsjpqqlgpcmy7fobjpa-2k-da7833.webp",
    alt: "White and pink Kemono bunny suit with large blue anime eyes",
    w: 1024,
    h: 1024,
  },
  {
    key: "toony",
    title: "Toony Suits",
    header: "bg-blush",
    tilt: "lg:translate-y-6",
    body: "Bold shapes, bright colours and big personality. Expressive cartoon characters made huggable.",
    traits: ["Expressive eyes", "Exaggerated features", "Bright colour blocks"],
    href: "/toony-fursuits/",
    image: "/media/products/hhlllkogqqme4yepjyr-tg-2k-a0ef2a.webp",
    alt: "Toony grey and white wolf fursuit head with big blue eyes",
    w: 896,
    h: 1200,
  },
  {
    key: "custom",
    title: "Custom Fursuits",
    header: "bg-mint",
    tilt: "lg:rotate-2",
    body: "Any species, any style. Heads, partials and fullsuits patterned around your reference sheet.",
    traits: ["Any species", "Your markings", "Made to fit"],
    href: "/fursuit-commission/",
    image: "/media/gallery/o1cn01tyheih1cnocozjamh-4611686018427385509-0-am-66696d.webp",
    alt: "White and pink fursuit bodysuit with feet paws on a workshop stand",
    w: 1200,
    h: 1600,
  },
];

export default function ServiceCards() {
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
                <Image src={s.image} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 768px) 30vw, 90vw" className="img-zoom aspect-square w-full object-cover object-top" />
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
