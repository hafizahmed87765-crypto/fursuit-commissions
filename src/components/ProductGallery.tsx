"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/products";

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [i, setI] = useState(0);
  const current = images[i];
  if (!current) return null;
  return (
    <div>
      <div className="overflow-hidden rounded-blob bg-black">
        <Image key={current.src} src={current.src} alt={current.alt || `${name} — image ${i + 1}`} width={current.width} height={current.height} priority sizes="(min-width:1024px) 50vw, 100vw" className="aspect-square w-full animate-reveal object-contain" />
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((img, idx) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show image ${idx + 1} of ${images.length}`}
                aria-current={idx === i}
                className={`block h-20 w-20 overflow-hidden rounded-xl bg-black ring-2 transition ${idx === i ? "ring-forest" : "ring-transparent hover:ring-mint"}`}
              >
                <Image src={img.src} alt="" width={80} height={80} sizes="80px" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
