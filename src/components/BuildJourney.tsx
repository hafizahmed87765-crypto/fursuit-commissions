import Image from "next/image";
import Paw from "./Paw";

type Shot = { src: string; w: number; h: number; alt: string };
const w = (name: string, width: number, height: number, alt: string): Shot => ({ src: `/media/work/${name}.webp`, w: width, h: height, alt });

const refSheet = w("tiger-journey-ref-sheet", 1600, 1069, "Toony tiger fursuit reference sheet: orange body with black stripes, yellow belly, blonde hair, grey cheek fluff and black ears, front, back and face views");
const finished = w("tiger-journey-delivered-front", 1050, 1400, "Finished toony tiger fullsuit worn by its owner at home, orange with black stripes, a yellow belly, blonde hair and grey cheek fluff");

// One real commission, from ref sheet to delivery.
const steps: { title: string; body: string; main: Shot; extra: Shot[]; contain?: boolean }[] = [
  {
    title: "Reference sheet",
    body: "It starts with the client's ref sheet: colours, stripes, hair, cheek fluff and expressions. Every later step is checked against it.",
    main: refSheet,
    extra: [],
    contain: true,
  },
  {
    title: "Head base & patterning",
    body: "We shape the head base, wrap it and draw the seam lines, eye shape, brows and forehead spot straight from the art.",
    main: w("tiger-journey-head-base", 957, 1200, "Toony tiger fursuit head base wrapped in film, with seam lines, eye shape, brows and forehead spot drawn on"),
    extra: [w("tiger-journey-head-base-side", 1030, 1197, "Side view of the tiger head base pattern with a foam ear attached")],
  },
  {
    title: "Bodysuit pattern",
    body: "A duct-tape dummy made to the client's measurements becomes the bodysuit pattern, with every stripe placed by hand.",
    main: w("tiger-journey-body-pattern", 1050, 1400, "Duct-tape dummy for the tiger bodysuit with the belly panel, stripes and measurements drawn on, and a furred hand paw"),
    extra: [
      w("tiger-journey-body-pattern-side", 1050, 1400, "Side view of the tiger bodysuit dummy with stripes and a paper tail pattern"),
      w("tiger-journey-body-pattern-back", 1050, 1400, "Back view of the tiger bodysuit dummy with stripes marked on the back and legs"),
    ],
  },
  {
    title: "Furred & finished",
    body: "Fur is cut from the pattern, sewn and trimmed. The finished head, bodysuit and tail are checked in the studio before shipping.",
    main: w("tiger-journey-finished-studio", 986, 1400, "Finished tiger fursuit head and striped bodysuit with tail together in the studio before shipping"),
    extra: [],
  },
  {
    title: "Delivered & worn",
    body: "The suit arrives at the client's door, ready to wear, matching the character they designed.",
    main: finished,
    extra: [
      w("tiger-journey-delivered-pose", 1050, 1400, "Owner in the tiger fullsuit posing with paws at the cheeks"),
      w("tiger-journey-delivered-paws", 1050, 1400, "Owner wearing the tiger fullsuit with hand paws raised"),
      w("tiger-journey-delivered-side", 1050, 1400, "Side view of the worn tiger fullsuit showing the striped back and tail"),
    ],
  },
];

/** Ref sheet → WIP → finished fursuit, shown as one commission's real journey. */
export default function BuildJourney() {
  return (
    <div>
      {/* Side-by-side: the art and the finished suit */}
      <div className="mt-10 grid items-center gap-4 md:grid-cols-[1.4fr_auto_1fr]" data-reveal>
        <figure className="toon overflow-hidden p-2">
          <Image src={refSheet.src} alt={refSheet.alt} width={refSheet.w} height={refSheet.h} sizes="(min-width: 768px) 55vw, 100vw" className="w-full rounded-xl" />
          <figcaption className="px-2 pb-1 pt-2 font-display font-bold text-forest">The ref sheet</figcaption>
        </figure>
        <span aria-hidden className="mx-auto grid h-14 w-14 rotate-90 place-items-center rounded-full border-[3px] border-forest bg-mint font-display text-2xl font-bold text-forest shadow-toon-sm md:rotate-0">
          →
        </span>
        <figure className="toon overflow-hidden p-2">
          <Image src={finished.src} alt={finished.alt} width={finished.w} height={finished.h} sizes="(min-width: 768px) 35vw, 100vw" className="aspect-[4/5] w-full rounded-xl object-cover object-[50%_30%]" />
          <figcaption className="px-2 pb-1 pt-2 font-display font-bold text-forest">The finished fursuit</figcaption>
        </figure>
      </div>

      {/* Step by step */}
      <ol className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {steps.map((s, i) => (
          <li key={s.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className="toon flex w-[78%] shrink-0 snap-start flex-col overflow-hidden sm:w-[45%] lg:w-auto">
            <div className="relative">
              <Image src={s.main.src} alt={s.main.alt} width={s.main.w} height={s.main.h} sizes="(min-width: 1024px) 19vw, (min-width: 640px) 45vw, 78vw" className={`aspect-[4/5] w-full ${s.contain ? "bg-[#7ad94b] object-contain" : "object-cover"}`} />
              <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border-[3px] border-forest bg-white font-display font-bold text-forest">{i + 1}</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Paw className="h-4 w-4 text-mint-deep" />
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-muted">{s.body}</p>
              {s.extra.length ? (
                <div className="mt-auto flex gap-2 pt-3">
                  {s.extra.map((x) => (
                    <Image key={x.src} src={x.src} alt={x.alt} width={x.w} height={x.h} sizes="80px" className="h-16 w-14 rounded-lg border-2 border-forest/20 object-cover" />
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
