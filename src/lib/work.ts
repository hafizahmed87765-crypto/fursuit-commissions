import { work, type WorkProduct, type WorkStyle } from "@/content/work";

/** Finished characters (no workshop shots). */
export const characters = work.filter((p) => p.style !== "workshop");

export const workByStyle = (style: WorkStyle) => work.filter((p) => p.style === style);

/** Alternates Kemono and Toony so a short list shows both styles. */
export function featuredWork(n: number): WorkProduct[] {
  const k = workByStyle("kemono"), t = workByStyle("toony");
  const out: WorkProduct[] = [];
  for (let i = 0; out.length < n && (i < k.length || i < t.length); i++) {
    if (k[i]) out.push(k[i]);
    if (t[i] && out.length < n) out.push(t[i]);
  }
  return out;
}
