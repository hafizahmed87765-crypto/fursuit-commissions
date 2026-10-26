// Curated portfolio. Images come from the studio's existing WordPress
// gallery / WIP page and commission service pages (synced into
// public/media by `npm run sync`). Tags are only applied where the photo
// makes the style or coverage obvious.
//
// CONFIRM: most WIP photos were uploaded with Taobao/Alibaba CDN filenames
// (O1CN01…). Confirm they show the studio's own work before launch.

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
  { id: "calico-kig", title: "Calico cat Kig head", src: "/media/products/whatsapp-image-2025-12-14-at-12-27-58-pm-f42ae7.webp", width: 1280, height: 1262, tags: ["kemono", "head"], alt: "Kemono-style calico cat fursuit head with large blue anime eyes and pink inner ears, worn with a pale blue top" },
  { id: "tiger-kemono", title: "Tiger Kemono head", src: "/media/gallery/whatsapp-image-2025-07-14-at-04-09-57-7e24860f-7f8288.webp", width: 1513, height: 1008, tags: ["kemono", "head"], alt: "Orange and black striped tiger fursuit head with violet anime eyes and a small open smile" },
  { id: "dragon-head", title: "Horned purple dragon head", src: "/media/gallery/o1cn01pcmuzy1cnocobexva-4611686018427385509-0-am-7fa10f.webp", width: 1200, height: 1600, tags: ["toony", "head"], alt: "Purple and turquoise horned dragon fursuit head with expressive cyan eyebrows, on a head stand" },
  { id: "dragon-side", title: "Dragon head, side view", src: "/media/gallery/o1cn01runzzt1cnocongldw-4611686018427385509-0-am-a45ae9.webp", width: 1200, height: 1600, tags: ["toony", "head"], alt: "Side view of the purple dragon fursuit head showing black horns and a long turquoise hair tuft" },
  { id: "pink-fullsuit", title: "Pink & white fullsuit", src: "/media/gallery/o1cn01tyheih1cnocozjamh-4611686018427385509-0-am-66696d.webp", width: 1200, height: 1600, tags: ["fullsuit"], alt: "White fursuit bodysuit with soft pink and blue markings and feet paws, hanging on a stand in the workshop" },
  { id: "feet-paws", title: "Navy feet paws", src: "/media/products/whatsapp-image-2025-12-14-at-12-35-31-pm-0a11c0.webp", width: 1280, height: 1241, tags: ["paws"], alt: "Pair of navy blue and white fursuit feet paws with pink bean-shaped toe pads" },
  { id: "hand-paws", title: "Brown & black hand paws", src: "/media/products/whatsapp-image-2025-12-14-at-12-31-08-pm-b446b0.webp", width: 1280, height: 1108, tags: ["paws"], alt: "Brown and black fursuit hand paws with pink paw pads" },
  { id: "fox-tail", title: "Golden fox tail", src: "/media/products/whatsapp-image-2025-12-14-at-12-37-12-pm-519091.webp", width: 1280, height: 1267, tags: ["tail"], alt: "Long fluffy golden-orange fox tail with a cream tip" },
  { id: "neon", title: "Character neon sign", src: "/media/products/whatsapp-image-2025-12-14-at-12-39-50-pm-1a4bc4.webp", width: 960, height: 1280, tags: ["other"], alt: "Neon light sign outlining a horned fursona's face in blue, pink and yellow tubes" },
  { id: "wip-tiger-body", title: "Tiger bodysuit in progress", src: "/media/gallery/o1cn01lptcuc1cnobh57si4-4611686018427385509-0-am-6ca55d.webp", width: 1200, height: 1600, tags: ["wip", "fullsuit"], alt: "Orange tiger bodysuit with black stripes and white paws, partly assembled on a dress form" },
  { id: "wip-tape", title: "Duct-tape head pattern", src: "/media/gallery/o1cn016idzzr1cnobaqlqwi-4611686018427385509-0-am-f82eb1.webp", width: 1600, height: 1600, tags: ["wip", "head"], alt: "Clear tape pattern over a foam head base with tiger stripe lines marked in black" },
  { id: "wip-base", title: "Resin head base", src: "/media/gallery/o1cn01bvcrw61cnoaqqcpah-4611686018427385509-0-am-afe8ea.webp", width: 1205, height: 1600, tags: ["wip", "head"], alt: "White resin fursuit head base held up before fur is applied" },
  { id: "wip-canine", title: "Black canine head, furring", src: "/media/gallery/o1cn01w9dus01cnocoqzhzm-4611686018427385509-0-am-4bf73a.webp", width: 1200, height: 1600, tags: ["wip", "head"], alt: "Black canine fursuit head mid-way through furring, eyes not yet installed" },
  { id: "wip-fur-cut", title: "Cut fur pieces", src: "/media/gallery/o1cn01dgqmih1cnoblos5ug-4611686018427385509-0-am-9ac3b9.webp", width: 1200, height: 1600, tags: ["wip"], alt: "Orange and black faux fur pieces cut from a pattern and laid out on a work table" },
  { id: "wip-tails", title: "Tail fur samples", src: "/media/gallery/o1cn01i8wft21cnob1qdzdb-4611686018427385509-0-am-61d617.webp", width: 1080, height: 741, tags: ["wip", "tail"], alt: "Row of faux fur tail samples in yellow, mauve, orange and red" },
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
