// Single source of truth for business facts shown on the site.
//
// Every value here was taken from FursuitCommissions.com's own published
// copy (About, Terms, quote form, homepage FAQ) as of Oct 2026. Anything
// marked `CONFIRM` could not be verified and is either hidden or worded
// conservatively until the owner confirms it. See docs/CONTENT-TODO.md.

export const site = {
  name: "FursuitCommissions.com",
  shortName: "Fursuit Commissions",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.fursuitcommissions.com").replace(/\/$/, ""),
  description:
    "Custom fursuits, Kemono suits and Toony suits, handmade to your character. Heads, partials, fullsuits, paws and tails, plus repair assessments. Shipping worldwide.",
  // Shown in the announcement bar. Set `enabled: false` to hide it, or change
  // the status when slots close. Never add a countdown or fake slot count.
  announcement: {
    enabled: true,
    status: "open" as "open" | "closed" | "waitlist",
    text: "Commissions are open. Quotes are free and every build is made to order.",
    link: { href: "/get-a-quote/", label: "Request a quote" },
  },
  // The studio's Hostinger mailbox; form submissions are delivered here too (OWNER_EMAIL).
  email: "hello@fursuitcommissions.com" as string | null,
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/fursuitcommissions_/" },
    { name: "Facebook", href: "https://www.facebook.com/FursuitCommissions" },
    { name: "TikTok", href: "https://www.tiktok.com/@fursuitcommission2" },
  ],
  // Commission invoices — Terms → Payments: PayPal and Stripe.
  paymentMethods: ["PayPal", "Stripe"],
};

export const policies = {
  minimumAge: 18,
  warrantyMonths: 6,
  shipsWorldwide: true,
  deposit: "Orders under $500 are paid in full upfront. Orders over $500 need an upfront, non-refundable payment to start, with the balance due before shipping.",
  paymentPlans: "Payment plans may be available on select orders and may include a small processing fee. Ask when you request your quote.",
  // Homepage FAQ: "On average, it takes about 6–12 weeks".
  typicalProduction: "about 6–12 weeks on average",
};

export type ServiceKey = "custom" | "kemono" | "toony" | "repair";

export const nav = {
  primary: [
    {
      label: "Fursuits",
      href: "/fursuit-commission/",
      children: [
        { label: "Custom Fursuits", href: "/fursuit-commission/", note: "Heads, partials and fullsuits" },
        { label: "Kemono Suits", href: "/kemono-fursuits/", note: "Anime-inspired, big-eyed builds" },
        { label: "Toony Suits", href: "/toony-fursuits/", note: "Bold, expressive cartoon style" },
        { label: "Fursuit Parts", href: "/fursuit-parts/", note: "Paws, tails, heads & ears" },
        { label: "Furry Costumes", href: "/furry-costumes/", note: "Custom furry costumes explained" },
        { label: "Furry Mascot Costumes", href: "/furry-mascot-costumes/", note: "Handmade mascot suits" },
        { label: "Repairs & Refurbishment", href: "/fursuit-repairs/", note: "Assessment for existing suits" },
      ],
    },
    { label: "Gallery", href: "/gallery/" },
    { label: "Our Process", href: "/order-process/" },
    { label: "Prices", href: "/fursuit-prices/" },
    {
      label: "More",
      href: "/about-us/",
      children: [
        { label: "Payment Plans", href: "/payment-plans/" },
        { label: "About", href: "/about-us/" },
        { label: "Contact", href: "/contact-us/" },
        { label: "Reference Sheets", href: "/furry-ref-sheet-commissions/" },
      ],
    },
  ],
  cta: { label: "Get a Custom Quote", href: "/get-a-quote/" },
};

// Coverage and commission options shown on the site.
export const commissionOptions = [
  {
    key: "fullsuit",
    title: "Fullsuits",
    blurb: "Head, body, hand paws, feet paws and tail, built as one matching character, sized to your measurements.",
    from: null as number | null,
    image: "/media/work/toony-neon-wolf-fullsuit-2.webp",
  },
  {
    key: "partial",
    title: "Partials",
    blurb: "Head, hand paws and tail (feet paws optional). The most popular way to start with a full character look.",
    from: null,
    image: "/media/work/kemono-grey-horned-dragon-partial-1.webp",
  },
  {
    key: "head",
    title: "Fursuit heads",
    blurb: "Foam-carved or resin-based heads with your choice of eyes, expression and fur. The centrepiece of any suit.",
    from: null,
    image: "/media/work/toony-navy-fox-glasses-fursuit-head-1.webp",
  },
  {
    key: "hand-paws",
    title: "Hand paws",
    blurb: "Made to order in your character's colours, with paw-pad and claw options.",
    from: 200,
    href: "/get-a-quote/?coverage=parts",
    image: "/media/work/toony-snow-leopard-partial-1.webp",
  },
  {
    key: "feet-paws",
    title: "Feet paws",
    blurb: "Indoor or outdoor soles, sized to your measurements and matched to your suit.",
    from: 300,
    href: "/get-a-quote/?coverage=parts",
    image: "/media/work/kemono-blue-dragon-digitigrade-fullsuit-8.webp",
  },
  {
    key: "tail",
    title: "Tails",
    blurb: "Custom shape, length and markings, with a belt loop or clip attachment.",
    from: 150,
    href: "/get-a-quote/?coverage=parts",
    image: "/media/work/kemono-blue-flame-horn-fullsuit-4.webp",
  },
  {
    key: "neon",
    title: "Character neon sign",
    blurb: "A neon light of your fursona, made to order from your reference.",
    from: 250,
    href: "/get-a-quote/?coverage=parts",
    image: "/media/products/whatsapp-image-2025-12-14-at-12-39-50-pm-1a4bc4.webp",
  },
] as const;

// Budget ranges from the live WPForms quote form, plus "Under $1,000" so
// heads, paws and tails (listed from $150) have a fitting option.
export const budgetRanges = ["Under $1,000", "$1,000 – $2,000", "$2,000 – $3,000", "$3,000+", "Not sure yet"];

export const processSteps = [
  {
    title: "Share your character",
    body: "Send your reference sheet and tell us what you want made. No ref sheet? Our artists can draw one first.",
    image: "/media/work/fursuit-head-base-patterning-3.webp",
  },
  {
    title: "Receive your quote",
    body: "We review your design and reply with a personalised quote and estimated timeline.",
    image: "/media/work/fursuit-studio-2.webp",
  },
  {
    title: "Confirm & pay deposit",
    body: "Approve the specifications and terms. Orders over $500 start with an upfront payment; smaller orders are paid in full.",
    image: "/media/work/fursuit-studio-4.webp",
  },
  {
    title: "Measurements & approvals",
    body: "For bodysuits and paws we ask for your measurements so the suit fits you. Design details are confirmed with you as we go.",
    image: "/media/work/fursuit-duct-tape-dummy-1.webp",
  },
  {
    title: "Build with WIP updates",
    body: "Your suit is patterned, foam-carved and hand-sewn. You get WIP photos at every major stage and can request revisions.",
    image: "/media/work/fursuit-head-base-patterning-1.webp",
  },
  {
    title: "Final approval",
    body: "You see the finished piece before it ships. Any remaining balance is due before shipping.",
    image: "/media/work/toony-neon-wolf-fullsuit-1.webp",
  },
  {
    title: "Shipping & aftercare",
    body: "We ship worldwide with tracking details and care guidance. Commissions include a 6-month limited warranty.",
    image: null,
  },
];

// Differentiators: each is a practice stated in the studio's own About page
// or Terms, not a generic claim.
export const differentiators = [
  { title: "One-on-one communication", body: "You talk with the makers directly, from first quote to delivery." },
  { title: "WIP photos at every stage", body: "Tape pattern, foam base, fur and finishing. You see it before we move on." },
  { title: "Revisions while we build", body: "Changes are welcome during production, so the result matches your character." },
  { title: "Built from scratch", body: "No templates. Every commission is patterned around your reference sheet." },
  { title: "6-month limited warranty", body: "Seam failures and structural foam issues on commissions are covered for six months." },
  { title: "Worldwide shipping", body: "We ship to the furry community wherever you are, with tracking." },
];

export const commissionReasons = [
  {
    title: "Make your character wearable",
    body: "Bring your reference sheet, colours and personality into a suit designed around your character.",
  },
  {
    title: "Choose the coverage that suits you",
    body: "Start with a head, choose a partial, or plan a fullsuit. You can also commission individual paws or a tail.",
  },
  {
    title: "Be part of the creative process",
    body: "See work-in-progress photos at major stages and confirm design details as your commission takes shape.",
  },
];

export const repairServices = [
  // CONFIRM: listed because the owner asked for a repair page; confirm which
  // of these the workshop actually takes on.
  { title: "Seam & stitching repairs", body: "Split seams, torn liners, loose zippers and detached parts." },
  { title: "Fur replacement & patching", body: "Matted, stained or bald areas re-furred or patched to match." },
  { title: "Head refurbishment", body: "Foam reshaping, new eyes, re-shaving and loose-part fixes." },
  { title: "Alterations & refits", body: "Resizing bodysuits, paws or tails to fit a new wearer." },
];

export type Review = { name: string; quote: string; confirmed: boolean; service?: string };

// CONFIRM: these four testimonials appear on the live homepage but could not
// be verified. They only render once `confirmed` is set to true by the owner.
export const reviews: Review[] = [
  { name: "Tobey Bryan", confirmed: false, quote: "I couldn't be happier with my fursuit! The team really brought my vision to life, and the quality is just amazing. I had a blast customizing everything from the fur to the accessories, and they kept me updated every step of the way." },
  { name: "Jessica M.", confirmed: false, quote: "My custom fursuit exceeded my expectations. The level of detail was incredible. They worked with me closely to create exactly what I envisioned." },
  { name: "Maria Mak", confirmed: false, service: "Kemono", quote: "I've always wanted a Kemono fursuit, and they made it happen! The design is exactly how I imagined, with beautiful, vibrant details that truly make my character stand out." },
  { name: "Jackma Kalin", confirmed: false, service: "Kemono", quote: "I've always dreamed of a Kemono fursuit, and they brought it to life perfectly! I'm thrilled with the result and will definitely return for future commissions!" },
];

// Published on the studio's own YouTube channel.
export const videoReview = { id: "on0vNOX-IWo", title: "Client review — thaakvu" };
