"use client";

import Image from "next/image";
import { useState } from "react";

/** Loads the YouTube player only after a click (privacy-enhanced domain). */
export default function VideoFacade({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-blob bg-black shadow-lift">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full">
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-90 transition group-hover:opacity-100" unoptimized />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-forest shadow-lift transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" aria-hidden><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
          <span className="sr-only">Play video: {title} (no sound plays until you start it)</span>
        </button>
      )}
    </div>
  );
}
