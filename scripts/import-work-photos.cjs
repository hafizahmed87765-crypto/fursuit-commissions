/**
 * One-off importer for the studio's character photos.
 * Usage: node scripts/import-work-photos.cjs <folder-with-numbered-photos>
 *
 * Resizes every photo to max 1600 px (long edge), strips metadata, saves it as
 * WebP under public/media/work/ with an SEO file name, and regenerates
 * src/content/work.ts. next/image then serves smaller sizes per device.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const src = process.argv[2];
if (!src) throw new Error("Pass the folder with the numbered photos");
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "media", "work");

// [slug, title, style, tags, description, [[photoNumber, view], ...]] — first photo is the cover.
const products = [
  // ---------- Kemono ----------
  ["kemono-blue-flame-horn-fullsuit", "Blue flame-horned fullsuit", "kemono", ["kemono", "fullsuit"],
    "Kemono-style blue and white fursuit with flame-shaped orange horns, amber anime eyes, a paw-print bandana and a long striped tail",
    [[233, "seated with the tail curled round"], [230, "seated three-quarter view"], [218, "head with hand and feet paws"], [228, "the striped tail laid flat"]]],
  ["kemono-red-panda-fursuit-head", "Red panda Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style red panda fursuit head with red and pink striped ears, ruby anime eyes and freckled white cheeks",
    [[198, "front view"], [182, "three-quarter view"], [187, "with black glasses"], [189, "with glasses, close-up"]]],
  ["kemono-grey-horned-dragon-partial", "Grey horned dragon with paws", "kemono", ["kemono", "partial", "head", "paws"],
    "Kemono-style grey and white horned dragon fursuit with coral ears, red-tipped horns, golden anime eyes and a paw-print bandana",
    [[178, "front view with hand and feet paws"], [194, "three-quarter view"], [190, "side view"], [183, "side view showing the fluffy cheeks"]]],
  ["kemono-black-white-flame-horn-partial", "Black & white flame-horned partial", "kemono", ["kemono", "partial", "head", "paws"],
    "Kemono-style black and white fursuit with golden flame horns, blue anime eyes, red cheek marks and clawed hand paws",
    [[229, "front view"], [231, "three-quarter view"], [235, "side view"]]],
  ["kemono-blue-dragon-digitigrade-fullsuit", "Blue & white dragon fullsuit", "kemono", ["kemono", "fullsuit", "paws", "tail"],
    "Kemono-style white and sky-blue horned dragon fullsuit with blue swirl markings, a digitigrade bodysuit and clawed feet paws",
    [[154, "full-body front view"], [160, "waving"], [161, "three-quarter view"], [165, "posing"], [158, "back view of the bodysuit and tail"], [159, "side view of the tail"], [153, "close-up of the feet paws"], [155, "feet paws with claws"], [156, "feet paws from the front"]]],
  ["kemono-lavender-wolf-fursuit-head", "Lavender wolf Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style white and lavender wolf fursuit head with purple stripes, big violet anime eyes and an orange chest mark",
    [[166, "front view"], [163, "front close-up"], [170, "front view in daylight"], [172, "with glasses and a bell collar"]]],
  ["kemono-crowned-fox-fullsuit", "Crowned fox fullsuit", "kemono", ["kemono", "fullsuit", "wip"],
    "Kemono-style crimson and grey fox fursuit with a teal crown marking, blue anime eyes and red-striped paws",
    [[199, "head, hand paws and feet paws in the workshop"], [192, "with the digitigrade bodysuit before final assembly"]]],
  ["kemono-star-dragon-fursuit-head", "Star dragon Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style white dragon fursuit head with yellow and blue striped ears, sky-blue horns, large blue and gold anime eyes and a yellow star on the chest ruff",
    [[124, "front view on a head stand"], [126, "front view on the workbench"], [145, "front close-up"], [136, "three-quarter view"], [125, "wide view showing the long ears"], [144, "wide front view"], [147, "side view with the blue ribbon tie at the back"]]],
  ["kemono-green-dragon-fursuit-head", "Green dragon Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style green and white dragon fursuit head with yellow horns, brown spots, large orange anime eyes and a plush pink tongue",
    [[142, "front view"], [141, "front view on the workbench"], [149, "three-quarter view"], [131, "close-up of the face and tongue"], [148, "close-up of the eyes"], [146, "side close-up of the muzzle"]]],
  ["kemono-blue-horned-fursuit-head-swappable-eyes", "Blue-horned Kemono head with swappable eyes", "kemono", ["kemono", "head"],
    "Kemono-style tan and brown fursuit head with sky-blue horns, pink inner ears and a blue bandana",
    [[54, "front view with blue eyes"], [55, "three-quarter view"], [63, "three-quarter view from the right"], [92, "front close-up"], [93, "with closed happy eyes fitted"], [60, "with spiral eyes fitted"], [66, "with X eyes fitted"], [74, "with blank eyes fitted"]],
    "Comes with swappable eyes: blue, happy, spiral, X and blank."],
  ["kemono-red-black-dragon-partial-fursuit", "Red & black dragon Kemono partial", "kemono", ["kemono", "partial", "head", "paws"],
    "Kemono-style red and black dragon fursuit with black horns and wings, yellow ear tufts and pink anime eyes",
    [[43, "front view of the head"], [46, "three-quarter view of the head"], [35, "front view with wings"], [39, "seated with hand and feet paws"], [44, "seated on the workbench with paws"], [49, "seated three-quarter view with paws"]]],
  ["kemono-cream-fox-fursuit-head", "Cream fox Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style cream and white fox fursuit head with pink blush cheeks and a patterned bandana",
    [[45, "front view"], [48, "three-quarter view"], [57, "front view with angry eyes"], [75, "three-quarter view from the left"]]],
  ["kemono-pastel-rainbow-fox-fursuit-head", "Pastel rainbow fox Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style cream fox fursuit head with green, pink and lavender layered ears, pink face markings and big dark anime eyes",
    [[97, "front view"], [90, "three-quarter view"], [98, "front close-up"], [108, "close-up in daylight"], [83, "side view"], [50, "side view in the garden"]]],
  ["kemono-lavender-ram-partial-fursuit", "Lavender ram Kemono head & paws", "kemono", ["kemono", "partial", "head", "paws"],
    "Kemono-style grey and white fursuit with lavender curled horns, purple inner ears and sleepy anime eyes",
    [[94, "front view"], [96, "front view in daylight"], [62, "three-quarter view"], [105, "close-up of the left side"], [112, "close-up of the right side"], [104, "matching hand paws with lavender paw pads"]]],
  ["kemono-blue-white-fursuit-head", "Blue & white Kemono head", "kemono", ["kemono", "head"],
    "Kemono-style white fursuit head with blue ear tufts, a blue face and big round blue anime eyes", [[107, "front view"]]],
  ["kemono-sky-blue-cat-fursuit-head", "Sky-blue Kemono cat head", "kemono", ["kemono", "head"],
    "Kemono-style sky-blue and white cat fursuit head with a white forehead marking and large blue anime eyes", [[67, "front view"]]],
  ["kemono-fish-clip-fursuit-head", "White Kemono head with fish clip", "kemono", ["kemono", "head"],
    "Kemono-style white fursuit head with a blue face, pink blush cheeks and a fish hair clip", [[101, "front view"]]],

  // ---------- Toony ----------
  ["toony-neon-wolf-fullsuit", "Neon purple & lime wolf fullsuit", "toony", ["toony", "fullsuit"],
    "Toony-style purple, lime green and yellow wolf fullsuit with blue paws, a red X eye and a yellow exclamation eye",
    [[236, "waving a hand paw"], [226, "full-body pose"]]],
  ["toony-teal-ear-husky-fursuit-head", "Black husky with teal ears", "toony", ["toony", "head"],
    "Toony-style black and white husky fursuit head with teal ears, lime cheek fluff, blue and yellow anime eyes and a studded bell collar",
    [[216, "front view"], [204, "three-quarter view"], [213, "with black glasses"], [214, "with white glasses"]]],
  ["toony-snow-leopard-partial", "Snow leopard with red paws", "toony", ["toony", "partial", "head", "paws"],
    "Toony-style grey snow leopard fursuit with black rosettes, pink eyes, glasses, a gold bell collar and white hand paws with red paw pads",
    [[171, "showing the paw pads"], [176, "paws up"], [179, "paws up, close-up"], [173, "waving"], [180, "playful pose"]]],
  ["toony-red-streak-wolf-partial", "Black wolf with red streak", "toony", ["toony", "partial", "head", "paws"],
    "Toony-style charcoal and white wolf fursuit with a red hair streak, red eye markings, red inner ears and matching feet paws",
    [[227, "front view"], [211, "front view in daylight"], [221, "three-quarter view"], [222, "with the matching feet paws"]]],
  ["toony-four-eared-white-wolf-fursuit-head", "White wolf with four ears", "toony", ["toony", "head"],
    "Toony-style cream and black fursuit head with four ears, lime and lilac accents, rainbow-ring eyes and black glasses",
    [[217, "front view with glasses"], [201, "front view without glasses"], [220, "close-up"], [224, "on the floor"]]],
  ["toony-golden-fox-glasses-fursuit-head", "Golden fox with glasses", "toony", ["toony", "head"],
    "Toony-style golden and white fox fursuit head with brown ears, swirl brow markings, green anime eyes and a bell collar",
    [[197, "front view"], [174, "three-quarter view with glasses"], [177, "front view with glasses"], [188, "close-up with glasses"]]],
  ["toony-lilac-horned-hyena-fursuit-head", "Lilac horned hyena", "toony", ["toony", "head"],
    "Toony-style lilac and black hyena fursuit head with a spotted purple horn, violet anime eyes, glasses and a bell collar",
    [[185, "front view"], [184, "on the floor"], [186, "close-up"], [191, "with a studded collar"]]],
  ["toony-grey-wolf-glasses-fursuit-head", "Grey wolf with glasses", "toony", ["toony", "head"],
    "Toony-style grey and white wolf fursuit head with red eye markings, black glasses, a braided collar with a gold bell and an orange chest ruff",
    [[162, "front view"], [168, "three-quarter view"], [181, "close-up"]]],
  ["toony-green-mane-glasses-fursuit-head", "Green-maned beast with glasses", "toony", ["toony", "head"],
    "Toony-style white fursuit head with a dark green mane, small orange horns, red-rimmed glasses and a lime chest ruff",
    [[164, "front view"], [167, "three-quarter view"], [169, "three-quarter view from the left"], [175, "front close-up"]]],
  ["toony-navy-fox-glasses-fursuit-head", "Navy & orange fox with glasses", "toony", ["toony", "head"],
    "Toony-style navy and white fox fursuit head with orange inner ears, olive cheek tufts, magenta eyes and black glasses",
    [[225, "front view"], [210, "three-quarter view"], [212, "front close-up"]]],
  ["toony-red-black-white-fullsuit", "Red, white & black fullsuit", "toony", ["toony", "fullsuit", "tail"],
    "Red, white and black fursuit with jagged red trim and black legs",
    [[157, "back view of the bodysuit"], [152, "the matching tail laid flat"]]],
  ["toony-teal-diamond-bodysuit", "Teal diamond-pattern bodysuit", "toony", ["toony", "fullsuit", "tail"],
    "Teal, white and black fursuit bodysuit with a diamond pattern, white feet paws and a finned tail",
    [[219, "three-quarter view with the tail"], [234, "back view"]]],
  ["toony-orange-tiger-bodysuit", "Orange tiger bodysuit", "toony", ["toony", "fullsuit"],
    "Orange tiger fursuit bodysuit with black stripes, a yellow belly and attached hand and feet paws",
    [[232, "front view"]]],
  ["toony-blue-husky-fursuit-head", "Blue & white husky Toony head", "toony", ["toony", "head"],
    "Toony-style blue and white husky fursuit head with teal markings, sharp anime eyes and a blue chest stripe",
    [[9, "front view"], [8, "front view with a blue bandana"], [10, "front view in the workshop"], [22, "three-quarter view"], [41, "three-quarter view from the left"], [47, "close-up three-quarter view"]]],
  ["toony-sky-blue-wolf-fursuit-head", "Sky-blue wolf with gold freckles", "toony", ["toony", "head"],
    "Toony-style white and sky-blue wolf fursuit head with gold ear tips and freckles and big green anime eyes",
    [[12, "three-quarter view on the workbench"], [25, "front close-up"], [33, "on the sewing table in the workshop"], [27, "inside view of the padded head lining"]]],
  ["toony-blue-grey-wolf-fursuit-head", "Blue-grey wolf Toony head", "toony", ["toony", "head"],
    "Toony-style blue-grey wolf fursuit head with a dark mane, red eyes, an open smile and a printed bandana",
    [[16, "front view"], [13, "side view"], [19, "three-quarter view"], [21, "close-up of the smile"], [37, "front view from below"]]],
  ["toony-red-hair-grey-wolf-fursuit-head", "Grey wolf with red hair", "toony", ["toony", "head"],
    "Toony-style grey wolf fursuit head with spiky red hair, red cheek marks and a newspaper-print bandana",
    [[14, "front view"], [150, "three-quarter view with the tongue out"], [17, "three-quarter view"], [20, "front view from the left"], [26, "front close-up"]]],
  ["toony-black-orange-jackal-fursuit-head", "Black & orange jackal Toony head", "toony", ["toony", "head"],
    "Toony-style black jackal fursuit head with an orange muzzle, red markings, tall ears and an orange bandana",
    [[34, "front view"], [18, "three-quarter view"], [38, "three-quarter view from the right"]]],
  ["toony-cream-teal-dog-fullsuit", "Cream & teal dog fullsuit", "toony", ["toony", "fullsuit"],
    "Toony-style cream, grey and teal dog fullsuit with blue-tipped feet paws",
    [[24, "full-body view"], [23, "upper-body view with arms crossed"], [36, "head close-up with round glasses"]]],
  ["toony-snow-tiger-fursuit-head", "Snow tiger Toony head", "toony", ["toony", "head"],
    "Toony-style white tiger fursuit head with black stripes, gold eyes and a silver collar",
    [[28, "front view"], [30, "front view in daylight"], [40, "three-quarter view"], [42, "three-quarter view from the right"]]],
  ["toony-tan-wolf-teal-ears-fursuit-head", "Tan wolf with teal ears", "toony", ["toony", "head"],
    "Toony-style tan and brown wolf fursuit head with teal inner ears, purple accents and a plaid bandana",
    [[31, "front view"], [29, "three-quarter view"], [32, "close-up front view"]]],
  ["toony-border-collie-fursuit-head", "Black & white collie Toony head", "toony", ["toony", "head"],
    "Toony-style black and white border collie fursuit head with brown eyebrows and an orange bandana",
    [[52, "front close-up"], [51, "front view"], [53, "three-quarter view"], [72, "front view from below"], [77, "three-quarter close-up"], [100, "side close-up"]]],
  ["toony-purple-hyena-fursuit-head", "Purple hyena with odd eyes", "toony", ["toony", "head"],
    "Toony-style purple and black hyena fursuit head with blue streaks and odd orange and violet eyes",
    [[116, "front view"], [69, "front view in the workshop"], [64, "three-quarter view"], [95, "three-quarter view from the right"], [56, "front view from the left"], [70, "front view from below"], [81, "side view on the table"], [86, "front close-up"], [91, "side view"]]],
  ["toony-tiger-cub-fursuit-head", "Tan tiger cub head", "toony", ["toony", "head"],
    "Toony-style tan tiger fursuit head with bold black stripes",
    [[84, "front view"], [58, "three-quarter view"], [73, "side view"], [102, "front view in daylight"]]],
  ["toony-red-black-fox-fursuit-head", "Red, white & black fox head", "toony", ["toony", "head"],
    "Toony-style black and white fox fursuit head with red ears, red markings and a silver collar",
    [[61, "front view"], [59, "three-quarter view"], [80, "three-quarter view from the left"]]],
  ["toony-red-horned-fox-fursuit-head", "Red-horned fox Toony head", "toony", ["toony", "head"],
    "Toony-style black and tan fox fursuit head with red horns, an orange eye patch and a blue paisley bandana",
    [[65, "front view"], [68, "three-quarter view"], [89, "three-quarter view from the left"]]],
  ["toony-tan-fox-orange-streak-fursuit-head", "Tan fox with an orange streak", "toony", ["toony", "head"],
    "Toony-style tan and white fox fursuit head with an orange hair streak and odd red and blue eyes",
    [[78, "three-quarter view"], [79, "close-up of the blue eye"], [99, "close-up of the face"], [71, "front view"], [76, "front view from below"]]],
  ["toony-brown-jackal-fursuit-head", "Brown jackal with mint cheeks", "toony", ["toony", "head"],
    "Toony-style brown and grey jackal fursuit head with mint cheek tufts, pink inner ears and a sly smile",
    [[109, "three-quarter view in daylight"], [85, "front view"], [87, "three-quarter view"], [82, "front view with a bandana"], [88, "in progress on the head stand"]]],
  ["toony-heart-blaze-wolf-fursuit-head", "Grey wolf with blue heart blaze", "toony", ["toony", "head"],
    "Toony-style dark grey and white wolf fursuit head with a sky-blue heart-shaped blaze and lavender anime eyes",
    [[106, "front view"], [115, "front view in soft light"], [118, "three-quarter view"], [103, "side view"]]],
  ["toony-grey-indigo-wolf-fursuit-head", "Grey & indigo wolf Toony head", "toony", ["toony", "head"],
    "Toony-style grey and white wolf fursuit head with indigo cheek fluff, teal inner ears and blue anime eyes",
    [[117, "front view"], [114, "front view with narrowed eyes"], [110, "three-quarter view"], [111, "three-quarter close-up"], [120, "side view"], [123, "side view from the left"]]],
  ["toony-orange-fox-fursuit-head", "Orange fox Toony head", "toony", ["toony", "head"],
    "Toony-style orange and white fox fursuit head with yellow fluff, pink inner ears and violet anime eyes",
    [[122, "front view"], [113, "three-quarter view"], [127, "three-quarter view from the right"]]],
  ["toony-purple-mohawk-wolf-fursuit-head", "Black wolf with purple mohawk", "toony", ["toony", "head"],
    "Toony-style black and white wolf fursuit head with a purple mohawk, orange muzzle and inner ears and a pink scar",
    [[130, "front view"], [121, "three-quarter view"], [128, "three-quarter view from the left"], [129, "side profile"]]],
  ["toony-ice-blue-wolf-fursuit-head", "Ice-blue wolf Toony head", "toony", ["toony", "head"],
    "Toony-style ice-blue and white wolf fursuit head with mint ear tips and teal anime eyes",
    [[132, "front view"], [119, "three-quarter view"], [139, "side profile"], [135, "front and side views"]]],
  ["toony-crimson-fox-fursuit-head", "Crimson fox with golden ruff", "toony", ["toony", "head"],
    "Toony-style crimson and white fox fursuit head with a golden neck ruff and red anime eyes",
    [[137, "front view"], [138, "front view with narrowed eyes"], [133, "front view from above"], [134, "three-quarter view"], [140, "three-quarter view from the left"], [143, "three-quarter view with the tongue out"]]],

  // ---------- Workshop ----------
  ["fursuit-duct-tape-dummy", "Duct-tape dummies & patterns", "workshop", ["wip"],
    "Duct-tape dummy for a custom fursuit bodysuit",
    [[196, "with a feet paw base"], [207, "with a black feet paw"], [203, "with the paper tail pattern"], [215, "with digitigrade leg padding and a mesh bodysuit"]]],
  ["fursuit-head-base-patterning", "Head base patterning", "workshop", ["wip", "head"],
    "Fursuit head base",
    [[193, "wrapped in film with seam lines drawn on, front view"], [195, "wrapped in film with seam lines drawn on, three-quarter view"], [223, "3D-modelled designs with an open-mouth jaw"]]],
  ["fursuit-studio", "Inside our studio", "workshop", ["wip"],
    "Our fursuit studio",
    [[208, "with finished heads and 3D-printed head bases on the shelves"], [200, "with rolls of faux fur in every colour"], [209, "with the faux fur cabinet"], [206, "with the 3D printers that make our head bases"], [202, "with a finished husky head beside new head bases"]]],
  ["fursuit-workshop", "Inside our fursuit workshop", "workshop", ["wip"],
    "Our fursuit workshop",
    [[11, "with sewing machines and shelves of faux fur"], [15, "with finished fursuit heads lined up"]]],
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const byNum = Object.fromEntries(fs.readdirSync(src).map((f) => [path.parse(f).name, f]));
  const out = [];
  for (const [slug, title, style, tags, desc, photos, note] of products) {
    const items = [];
    for (let i = 0; i < photos.length; i++) {
      const [num, view] = photos[i];
      const file = byNum[String(num)];
      if (!file) throw new Error(`Missing photo ${num}`);
      const name = `${slug}-${i + 1}.webp`;
      const info = await sharp(path.join(src, file))
        .rotate()
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 74, effort: 5 })
        .toFile(path.join(outDir, name));
      items.push({ src: `/media/work/${name}`, width: info.width, height: info.height, alt: `${desc}, ${view}` });
    }
    out.push({ slug, title, style, tags, description: desc, ...(note ? { note } : {}), photos: items });
  }

  // 1200x630 social share collage (three heads side by side).
  const tiles = await Promise.all([216, 236, 198].map((n) => sharp(path.join(src, byNum[String(n)])).rotate().resize(400, 630, { fit: "cover", position: "attention" }).toBuffer()));
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#ffffff" } })
    .composite(tiles.map((input, i) => ({ input, left: i * 400, top: 0 })))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, "fursuit-commissions-share.jpg"));

  const ts = `// Generated by scripts/import-work-photos.cjs — edit the list there and re-run.
// Each entry is one character (one commission) with all of its photos; the
// first photo is the cover. Alt text = character description + camera angle.
import type { PortfolioTag } from "./portfolio";

export type WorkStyle = "kemono" | "toony" | "workshop";
export type WorkPhoto = { src: string; width: number; height: number; alt: string };
export type WorkProduct = { slug: string; title: string; style: WorkStyle; tags: PortfolioTag[]; description: string; note?: string; photos: WorkPhoto[] };

export const work: WorkProduct[] = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync(path.join(root, "src", "content", "work.ts"), ts);
  const bytes = fs.readdirSync(outDir).reduce((s, f) => s + fs.statSync(path.join(outDir, f)).size, 0);
  console.log(`${out.length} products, ${out.reduce((s, p) => s + p.photos.length, 0)} photos, ${(bytes / 1048576).toFixed(1)} MB`);
})();
