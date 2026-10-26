"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";

const services = [
  {
    key: "custom",
    title: "Custom Fursuits",
    body: "Any species, any style. Heads, partials and fullsuits patterned around your reference sheet.",
    href: "/fursuit-commission/",
    image: "/media/gallery/o1cn01tyheih1cnocozjamh-4611686018427385509-0-am-66696d.webp",
    alt: "White and pink fursuit bodysuit with feet paws on a workshop stand",
    w: 1200,
    h: 1600,
    tint: "bg-mint-light",
  },
  {
    key: "kemono",
    title: "Kemono Suits",
    body: "Anime-inspired faces with big glossy eyes, soft rounded features and doll-like charm.",
    href: "/kemono-fursuits/",
    image: "/media/products/d4rgsjpqqlgpcmy7fobjpa-2k-da7833.webp",
    alt: "White and pink Kemono bunny suit with large blue anime eyes",
    w: 1024,
    h: 1024,
    tint: "bg-lavender-soft",
  },
  {
    key: "toony",
    title: "Toony Suits",
    body: "Bold shapes, bright colours and big personality. Expressive cartoon characters made huggable.",
    href: "/toony-fursuits/",
    image: "/media/products/hhlllkogqqme4yepjyr-tg-2k-a0ef2a.webp",
    alt: "Toony grey and white wolf fursuit head with big blue eyes",
    w: 896,
    h: 1200,
    tint: "bg-petal",
  },
];

export default function ServiceCards() {
  return (
    <ul className="mt-10 grid gap-6 md:grid-cols-3">
      {services.map((s, i) => (
        <li key={s.key} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
          <Link
            href={s.href}
            onClick={() => track("service_selection", { service: s.key, location: "home_style_cards" })}
            className={`group flex h-full flex-col overflow-hidden rounded-blob ${s.tint} ring-1 ring-forest/5 transition duration-300 hover:shadow-lift motion-safe:hover:-translate-y-1`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <Image src={s.image} alt={s.alt} width={s.w} height={s.h} sizes="(min-width: 768px) 33vw, 100vw" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 flex-1 text-ink-muted">{s.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-display font-semibold text-forest">
                Explore {s.title}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
