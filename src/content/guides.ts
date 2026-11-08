// Fursuit guides and studio blog posts, rendered at /guides/ and /guides/<slug>/.
// Studio-specific details (exact measurement form, care card) are always
// confirmed in each client's quote, so the guides stay general and accurate.

export type GuideSection = { heading: string; paragraphs?: string[]; list?: string[]; steps?: { title: string; body: string }[] };
export type Guide = {
  slug: string;
  kind: "Guide" | "Blog";
  title: string;
  metaTitle: string;
  description: string;
  published: string;
  readMinutes: number;
  image: { src: string; width: number; height: number; alt: string };
  intro: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-measure-for-a-fursuit",
    kind: "Guide",
    title: "How to measure yourself for a fursuit",
    metaTitle: "How to Measure for a Fursuit: Measurement Guide",
    description: "Step-by-step fursuit measurement guide: which body, head, hand and foot measurements a fursuit maker needs, how to take them accurately, and common mistakes to avoid.",
    published: "2026-11-08",
    readMinutes: 6,
    image: { src: "/media/work/tiger-journey-body-pattern.webp", width: 1050, height: 1400, alt: "Duct-tape dummy for a tiger fursuit bodysuit with measurements written on the torso and legs" },
    intro:
      "A fursuit is built around your body, so good measurements are the difference between a suit that moves with you and one that pulls, sags or overheats. Here is what a fursuit maker needs, how to measure yourself accurately at home, and the mistakes to avoid.",
    sections: [
      {
        heading: "What you need",
        list: ["A soft tape measure (not a metal one)", "A helper, if possible, for back and shoulder measurements", "Close-fitting clothes, the kind you would wear under your suit", "Your phone, to take reference photos of yourself standing straight"],
      },
      {
        heading: "Head measurements",
        paragraphs: ["The head is the most important fit. Too tight and it presses on your face; too loose and it slips and blocks your vision."],
        steps: [
          { title: "Head circumference", body: "Measure around the widest part of your head, just above your eyebrows and ears." },
          { title: "Forehead to chin", body: "Measure from your hairline down to the bottom of your chin." },
          { title: "Over the top", body: "Measure from the top of one ear, over the crown, to the top of the other ear." },
          { title: "Glasses", body: "If you wear glasses, tell your maker. The head needs extra room inside." },
        ],
      },
      {
        heading: "Body measurements for a fullsuit",
        steps: [
          { title: "Height", body: "Stand barefoot against a wall and measure from the floor to the top of your head." },
          { title: "Chest, waist and hips", body: "Measure around the fullest part of your chest, your natural waist and the widest part of your hips. Keep the tape level and snug, not tight." },
          { title: "Shoulder width", body: "Measure across your back from the tip of one shoulder to the other." },
          { title: "Arm length", body: "With your arm slightly bent, measure from the shoulder tip, over the elbow, to the wrist bone." },
          { title: "Inseam", body: "Measure from the crotch down the inside of your leg to the floor." },
          { title: "Torso loop", body: "Measure from the top of one shoulder, down the front, between your legs and up the back to the same shoulder. This one is easy to forget and very important." },
        ],
      },
      {
        heading: "Hands and feet",
        paragraphs: [
          "For hand paws, trace around your open hand on paper and measure around your palm at the knuckles. For feet paws, trace your foot in the shoes you plan to wear inside them and note your shoe size.",
          "Feet paws are usually built to go over a shoe, so measure the shoe as well as your foot.",
        ],
      },
      {
        heading: "Duct-tape dummies",
        paragraphs: [
          "For the best bodysuit fit, many makers work from a duct-tape dummy (DTD): a cast of your body made by wrapping you in plastic wrap and tape, then cutting it off and sealing it. It captures your exact shape in a way numbers cannot.",
          "If your commission needs one, we explain how to make and ship it when we send your quote.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        list: [
          "Measuring over thick clothes or pulling the tape tight",
          "Guessing instead of measuring, especially the torso loop",
          "Forgetting to mention glasses, hair length or a cooling vest",
          "Measuring months before the build if your size is likely to change",
        ],
      },
    ],
    faqs: [
      { q: "Do I need measurements for a fursuit head only?", a: "Yes. A head needs at least your head circumference, forehead-to-chin and over-the-top measurements, and you should mention glasses." },
      { q: "What if I measure wrong?", a: "Send photos of yourself taking each measurement. We check everything against your photos before cutting fur, and ask if something looks off." },
      { q: "Is a duct-tape dummy required?", a: "Not for every commission. We tell you in your quote whether your fullsuit or bodysuit needs one." },
    ],
    related: [
      { label: "Get a custom fursuit quote", href: "/get-a-quote/" },
      { label: "Fursuit prices", href: "/fursuit-prices/" },
      { label: "How a commission works", href: "/order-process/" },
    ],
  },
  {
    slug: "fursuit-care-and-cleaning",
    kind: "Guide",
    title: "How to clean and care for your fursuit",
    metaTitle: "Fursuit Care & Cleaning Guide: Wash, Dry & Store",
    description: "How to clean a fursuit safely: washing bodysuits and paws, refreshing a fursuit head without water damage, brushing faux fur, drying and storing your suit between cons.",
    published: "2026-11-08",
    readMinutes: 6,
    image: { src: "/media/work/tiger-journey-finished-studio.webp", width: 986, height: 1400, alt: "Finished tiger fursuit head and striped bodysuit with tail in the studio" },
    intro:
      "A well cared-for fursuit stays bright, soft and fresh for years. Fursuits are worn hard: sweat, con floors, food and long days all add up. This guide covers the basics for every part of your suit. Always check the care notes that come with your own suit first, as materials differ between builds.",
    sections: [
      {
        heading: "After every wear",
        list: [
          "Turn the head and bodysuit inside out and let them air dry completely before packing.",
          "Wipe the inside of the head with a cloth and a fabric-safe disinfectant spray.",
          "Spot clean any marks on the fur straight away, before they set.",
          "Brush the fur gently to remove tangles and debris.",
        ],
      },
      {
        heading: "Washing bodysuits, paws and tails",
        paragraphs: ["Fabric parts without foam or resin can usually be washed."],
        steps: [
          { title: "Hand wash in cool water", body: "Use cool water and a small amount of mild detergent. Hot water can damage faux fur fibres." },
          { title: "Squeeze, don't wring", body: "Press water out gently. Wringing stretches seams and mats the fur." },
          { title: "Air dry", body: "Hang to dry away from direct heat or sun. Never tumble dry on heat." },
          { title: "Brush when dry", body: "Brush the fur in the direction it lies to fluff it back up." },
        ],
      },
      {
        heading: "Caring for the fursuit head",
        paragraphs: [
          "Never soak or machine wash a fursuit head. Water can damage the base, glue, eyes and padding.",
          "Instead, spot clean the fur with a damp cloth, refresh the inside with a fabric-safe disinfectant spray, and let it air out on a head stand. A small fan inside the head helps it dry after a long day.",
        ],
      },
      {
        heading: "Brushing faux fur",
        paragraphs: ["Use a wide-tooth comb or a slicker brush made for pets or wigs. Brush gently from the tips toward the base, holding the fur close to the backing so you don't pull fibres out."],
      },
      {
        heading: "Storing your suit",
        list: [
          "Store the head on a stand or stuffed with soft fabric so it keeps its shape.",
          "Keep everything in a breathable bag or box in a cool, dry place, never sealed while damp.",
          "Keep the suit out of direct sunlight, which fades colours over time.",
        ],
      },
      {
        heading: "When to ask a professional",
        paragraphs: ["Split seams, worn fur, loose eyes or a head that has lost its shape are best fixed by a maker. Our repair service starts with a free assessment from photos."],
      },
    ],
    faqs: [
      { q: "Can I put my fursuit in the washing machine?", a: "Only fabric parts without foam or resin, and only if your care notes allow it, on a cold, gentle cycle inside a laundry bag. Hand washing is safest. Never machine wash a head." },
      { q: "How do I stop my fursuit head smelling?", a: "Air it out after every wear, use a fabric-safe disinfectant spray inside, and let it dry completely before storing." },
      { q: "Can you repair my fursuit?", a: "Yes. Send photos through our repair form and we will tell you what can realistically be done before you ship anything." },
    ],
    related: [
      { label: "Fursuit repairs", href: "/fursuit-repairs/" },
      { label: "Fursuit parts", href: "/fursuit-parts/" },
      { label: "Contact us", href: "/contact-us/" },
    ],
  },
  {
    slug: "kemono-vs-toony-fursuits",
    kind: "Guide",
    title: "Kemono vs Toony fursuits: what's the difference?",
    metaTitle: "Kemono vs Toony Fursuits: Styles Compared",
    description: "Kemono vs Toony fursuits explained: face shape, eyes, colours and personality of each style, which suits which character, and how style affects your fursuit commission.",
    published: "2026-11-08",
    readMinutes: 5,
    image: { src: "/media/work/kemono-blue-flame-horn-fullsuit-1.webp", width: 1255, height: 1600, alt: "Kemono-style blue and white fursuit with flame horns, seated with its striped tail curled round" },
    intro:
      "Kemono and Toony are the two most requested fursuit styles. Both are cartoon styles rather than realistic ones, but they feel very different. Here is how to tell them apart and choose the right one for your character.",
    sections: [
      {
        heading: "What is a Kemono fursuit?",
        paragraphs: [
          "Kemono suits take their look from anime and Japanese character design. They have large, glossy anime eyes, small muzzles and soft, rounded faces. The overall feel is cute and gentle, and Kemono heads are often paired with hair, accessories and pastel colours.",
        ],
      },
      {
        heading: "What is a Toony fursuit?",
        paragraphs: [
          "Toony suits lean into Western cartoon energy: big expressive eyes, exaggerated shapes, bold colour blocks and wide smiles. Toony heads are built to read clearly from across a con hall, with strong eyebrows and expressive faces.",
        ],
      },
      {
        heading: "Side by side",
        steps: [
          { title: "Eyes", body: "Kemono: large, glossy, anime-style. Toony: big and expressive, often with strong brows." },
          { title: "Face shape", body: "Kemono: round with a small muzzle. Toony: exaggerated, with a longer muzzle and wide smile." },
          { title: "Colours", body: "Kemono: often soft or pastel. Toony: bold, high-contrast colour blocks." },
          { title: "Feel", body: "Kemono: cute and gentle. Toony: playful and energetic." },
        ],
      },
      {
        heading: "Which style suits your character?",
        paragraphs: [
          "Look at how your character is drawn. Anime-styled art with big shiny eyes usually translates best to Kemono. Western cartoon art with bold shapes and expressions fits Toony. Plenty of characters work in either style, and some makers blend elements of both.",
          "Not sure? Send your ref sheet with your quote request and we will suggest the style that keeps your character recognisable.",
        ],
      },
    ],
    faqs: [
      { q: "Is a Kemono fursuit more expensive than a Toony one?", a: "Not by default. Price depends on coverage, markings and extras more than style. See our fursuit prices page for starting prices." },
      { q: "Can you mix Kemono and Toony features?", a: "Yes. Tell us which features you love and we will design the head around your character." },
    ],
    related: [
      { label: "Kemono fursuits", href: "/kemono-fursuits/" },
      { label: "Toony fursuits", href: "/toony-fursuits/" },
      { label: "Fursuit gallery", href: "/gallery/" },
    ],
  },
  {
    slug: "toony-tiger-fullsuit-ref-sheet-to-fursuit",
    kind: "Blog",
    title: "From ref sheet to fullsuit: building a toony tiger",
    metaTitle: "From Ref Sheet to Fursuit: A Toony Tiger Fullsuit Build",
    description: "Follow a real custom fursuit commission from reference sheet to finished toony tiger fullsuit: head base patterning, duct-tape dummy, striped bodysuit and delivery.",
    published: "2026-11-08",
    readMinutes: 4,
    image: { src: "/media/work/tiger-journey-delivered-front.webp", width: 1050, height: 1400, alt: "Finished toony tiger fullsuit worn by its owner, orange with black stripes and a yellow belly" },
    intro:
      "Every custom fursuit starts as a drawing. This toony tiger fullsuit is a good example of how a reference sheet becomes a suit you can wear, so here is the build, step by step.",
    sections: [
      {
        heading: "1. The reference sheet",
        paragraphs: ["The client sent a clear ref sheet with front, back and face views: an orange tiger with black stripes, a yellow belly, blonde hair, grey cheek fluff and black ears. A good ref sheet like this makes every later step easier, because we can check colours and markings against it at each stage."],
      },
      {
        heading: "2. Head base and patterning",
        paragraphs: ["We shaped the head base, wrapped it and drew on the seam lines, eye shape, brows and the forehead spot straight from the art. This pattern decides how the fur is cut, so it is where the character's expression is really made."],
      },
      {
        heading: "3. Bodysuit pattern on a duct-tape dummy",
        paragraphs: ["The bodysuit was patterned on a duct-tape dummy built to the client's measurements. Every stripe was drawn on by hand, front and back, so the markings line up across the seams once the fur is sewn."],
      },
      {
        heading: "4. Furring and finishing",
        paragraphs: ["Fur was cut from the pattern, sewn and trimmed. The finished head, bodysuit, paws and tail were checked together in the studio before shipping."],
      },
      {
        heading: "5. Delivered and worn",
        paragraphs: ["The suit arrived at the client's door ready to wear, matching the character they designed. Seeing a ref sheet walk around a room is why we do this."],
      },
    ],
    faqs: [
      { q: "How long does a custom fullsuit take?", a: "Production takes about 6 to 12 weeks on average, depending on complexity. Your quote includes an estimated timeline." },
      { q: "Will I see progress photos?", a: "Yes. You receive WIP photos at every major stage and can ask for changes before we move on." },
    ],
    related: [
      { label: "Toony fursuits", href: "/toony-fursuits/" },
      { label: "Fursuit prices", href: "/fursuit-prices/" },
      { label: "Start your commission", href: "/get-a-quote/" },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
