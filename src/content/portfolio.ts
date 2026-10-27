// Single-photo portfolio: paws, tails, bodysuits and builds in progress.
// Photos come from public/media/work (see scripts/import-work-photos.cjs).

export type PortfolioTag = "kemono" | "toony" | "fullsuit" | "partial" | "head" | "paws" | "tail" | "wip" | "other";

export type PortfolioItem = {
  id: string;
  title: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  tags: PortfolioTag[];
  caption?: string;
};

export const portfolio: PortfolioItem[] = [
  { id: "red-paw-pads", title: "Hand paws with red paw pads", src: "/media/work/toony-snow-leopard-partial-1.webp", width: 1200, height: 1600, tags: ["paws"], alt: "Toony-style grey snow leopard fursuit with black rosettes, pink eyes, glasses, a gold bell collar and white hand paws with red paw pads, showing the paw pads" },
  { id: "clawed-feet-paws", title: "Clawed digitigrade feet paws", src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-8.webp", width: 1200, height: 1600, tags: ["paws"], alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, feet paws with claws" },
  { id: "grey-feet-paws", title: "Grey feet paws with black toe beans", src: "/media/work/toony-red-streak-wolf-partial-4.webp", width: 1067, height: 1600, tags: ["paws"], alt: "Toony-style charcoal and white wolf fursuit with a red hair streak, red eye markings, red inner ears and matching feet paws, with the matching feet paws" },
  { id: "lavender-hand-paws", title: "Lavender hand paws", src: "/media/work/kemono-lavender-ram-partial-fursuit-6.webp", width: 1600, height: 1201, tags: ["paws","kemono"], alt: "Kemono-style grey and white fursuit with lavender curled horns, purple inner ears and sleepy anime eyes, matching hand paws with lavender paw pads" },
  { id: "blue-striped-tail", title: "Blue, red & gold striped tail", src: "/media/work/kemono-blue-flame-horn-fullsuit-4.webp", width: 1258, height: 1600, tags: ["tail"], alt: "Kemono-style blue and white fursuit with flame-shaped orange horns, amber anime eyes, a paw-print bandana and a long striped tail, the striped tail laid flat" },
  { id: "red-jagged-tail", title: "Red & white jagged tail", src: "/media/work/toony-red-black-white-fullsuit-2.webp", width: 1600, height: 1200, tags: ["tail"], alt: "Red, white and black fursuit with jagged red trim and black legs, the matching tail laid flat" },
  { id: "finned-tail", title: "Teal finned tail and bodysuit", src: "/media/work/toony-teal-diamond-bodysuit-1.webp", width: 1201, height: 1600, tags: ["tail","fullsuit"], alt: "Teal, white and black fursuit bodysuit with a diamond pattern, white feet paws and a finned tail, three-quarter view with the tail" },
  { id: "dragon-tail", title: "Blue swirl dragon tail", src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-6.webp", width: 1200, height: 1600, tags: ["tail","kemono"], alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, side view of the tail" },
  { id: "neon-fullsuit", title: "Neon wolf fullsuit", src: "/media/work/toony-neon-wolf-fullsuit-2.webp", width: 718, height: 1032, tags: ["fullsuit","toony"], alt: "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye, full-body pose" },
  { id: "tiger-bodysuit", title: "Orange tiger bodysuit", src: "/media/work/toony-orange-tiger-bodysuit-1.webp", width: 1059, height: 1600, tags: ["fullsuit"], alt: "Orange tiger fursuit bodysuit with black stripes, a yellow belly and attached hand and feet paws, front view" },
  { id: "dragon-fullsuit", title: "Blue & white dragon fullsuit", src: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-1.webp", width: 900, height: 1600, tags: ["fullsuit","kemono"], alt: "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws, full-body front view" },
  { id: "husky-head", title: "Black husky head with teal ears", src: "/media/work/toony-teal-ear-husky-fursuit-head-1.webp", width: 1067, height: 1600, tags: ["head","toony"], alt: "Toony-style black and white husky fursuit head with teal ears, lime cheek fluff, blue and yellow anime eyes and a studded bell collar, front view" },
  { id: "red-panda-head", title: "Red panda Kemono head", src: "/media/work/kemono-red-panda-fursuit-head-1.webp", width: 1067, height: 1600, tags: ["head","kemono"], alt: "Kemono-style red panda fursuit head with red and pink striped ears, ruby anime eyes and freckled white cheeks, front view" },
  { id: "wip-dtd", title: "Duct-tape dummy", src: "/media/work/fursuit-duct-tape-dummy-1.webp", width: 1200, height: 1600, tags: ["wip"], alt: "Duct-tape dummy for a custom fursuit bodysuit, with a feet paw base" },
  { id: "wip-tail-pattern", title: "Tail pattern on the dummy", src: "/media/work/fursuit-duct-tape-dummy-3.webp", width: 1080, height: 1440, tags: ["wip","tail"], alt: "Duct-tape dummy for a custom fursuit bodysuit, with the paper tail pattern" },
  { id: "wip-digi-padding", title: "Digitigrade leg padding", src: "/media/work/fursuit-duct-tape-dummy-4.webp", width: 1200, height: 1600, tags: ["wip","fullsuit"], alt: "Duct-tape dummy for a custom fursuit bodysuit, with digitigrade leg padding and a mesh bodysuit" },
  { id: "wip-head-pattern", title: "Head base patterning", src: "/media/work/fursuit-head-base-patterning-1.webp", width: 1600, height: 1600, tags: ["wip","head"], alt: "Fursuit head base, wrapped in film with seam lines drawn on, front view" },
  { id: "wip-3d-bases", title: "3D-modelled head bases", src: "/media/work/fursuit-head-base-patterning-3.webp", width: 1600, height: 1600, tags: ["wip","head"], alt: "Fursuit head base, 3D-modelled designs with an open-mouth jaw" },
  { id: "wip-crowned-fox", title: "Crowned fox before assembly", src: "/media/work/kemono-crowned-fox-fullsuit-2.webp", width: 1200, height: 1600, tags: ["wip","fullsuit"], alt: "Kemono-style crimson and grey fox fursuit with a teal crown marking, blue anime eyes and red-striped paws, with the digitigrade bodysuit before final assembly" },
  { id: "studio-fur", title: "Our faux fur stock", src: "/media/work/fursuit-studio-2.webp", width: 1079, height: 1431, tags: ["wip"], alt: "Our fursuit studio, with rolls of faux fur in every colour" },
  { id: "studio-printers", title: "3D printers for head bases", src: "/media/work/fursuit-studio-4.webp", width: 1079, height: 1448, tags: ["wip"], alt: "Our fursuit studio, with the 3D printers that make our head bases" },
];

export const filterLabels: Partial<Record<PortfolioTag, string>> = {
  kemono: "Kemono",
  toony: "Toony",
  fullsuit: "Fullsuit",
  head: "Heads",
  paws: "Paws",
  tail: "Tails",
  wip: "In progress",
};
