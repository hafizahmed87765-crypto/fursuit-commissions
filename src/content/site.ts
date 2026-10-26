// Single source of truth for business facts shown on the site.
//
// Every value here was taken from FursuitCommissions.com's own published
// copy (About, Terms, quote form, homepage FAQ) as of Oct 2026. Anything
// marked `CONFIRM` could not be verified and is either hidden or worded
// conservatively until the owner confirms it. See docs/CONTENT-TODO.md.

export const site = {
  name: "FursuitCommissions.com",
  shortName: "Fursuit Commissions",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fursuitcommissions.com").replace(/\/$/, ""),
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
  // From the Terms of Service contact line. (The live Contact page only shows
  // template placeholders: info@example.com, +123 456 7890, a NY address.)
  email: "info@fursuitcommissions.com" as string | null,
  socials: [
    { name: "Instagram", href: "https://www.instagram.com/fursuitcommissions" },
    { name: "Facebook", href: "https://www.facebook.com/FursuitCommissions" },
    { name: "YouTube", href: "https://www.youtube.com/@fursuit87765" },
  ],
  // Commission invoices — Terms → Payments: "PayPal, Stripe, and other
  // approved processors". The shop checkout itself only has Stripe (card)
  // enabled (verified via the WooCommerce Store API, Oct 2026); see
  // src/content/payments.ts.
  paymentMethods: ["PayPal", "Stripe"],
};

export const policies = {
  minimumAge: 18,
  warrantyMonths: 6,
  shipsWorldwide: true,
  deposit: "Orders under $500 are paid in full upfront. Orders over $500 start with a 50% non-refundable deposit, with the balance due before shipping.",
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
        { label: "Repairs & Refurbishment", href: "/fursuit-repairs/", note: "Assessment for existing suits" },
      ],
    },
    { label: "Gallery", href: "/gallery/" },
    { label: "Our Process", href: "/order-process/" },
    { label: "Payment Plans", href: "/payment-plans/" },
    { label: "Shop", href: "/shop/" },
    {
      label: "More",
      href: "/about-us/",
      children: [
        { label: "About", href: "/about-us/" },
        { label: "Contact", href: "/contact-us/" },
        { label: "Reference Sheets", href: "/furry-ref-sheet-commissions/" },
      ],
    },
  ],
  cta: { label: "Get a Custom Quote", href: "/get-a-quote/" },
};

// Coverage / commission options. `from` prices come from the live
// WooCommerce "made to order" listings (quote-only products). Options without
// a listed price show "Quote" — no invented prices.
export const commissionOptions = [
  {
    key: "fullsuit",
    title: "Fullsuits",
    blurb: "Head, body, hand paws, feet paws and tail, built as one matching character, sized to your measurements.",
    from: null as number | null,
    image: "/media/products/full-body-grey-wolf-fursuit-mascot-45deg-nhkkc9k-ea4fba.webp",
  },
  {
    key: "partial",
    title: "Partials",
    blurb: "Head, hand paws and tail (feet paws optional). The most popular way to start with a full character look.",
    from: null,
    image: "/media/products/d5i2aruztncs9v6p9m1vag-2k-87d944.webp",
  },
  {
    key: "head",
    title: "Fursuit heads",
    blurb: "Foam-carved or resin-based heads with your choice of eyes, expression and fur. The centrepiece of any suit.",
    from: null,
    image: "/media/products/hhlllkogqqme4yepjyr-tg-2k-a0ef2a.webp",
  },
  {
    key: "hand-paws",
    title: "Hand paws",
    blurb: "Made to order in your character's colours, with paw-pad and claw options.",
    from: 200,
    href: "/product/custom-furry-hand-paws-made-to-order/",
    image: "/media/products/whatsapp-image-2025-12-14-at-12-31-08-pm-b446b0.webp",
  },
  {
    key: "feet-paws",
    title: "Feet paws",
    blurb: "Indoor or outdoor soles, sized to your measurements and matched to your suit.",
    from: 300,
    href: "/product/custom-furry-feet-paws-made-to-order/",
    image: "/media/products/whatsapp-image-2025-12-14-at-12-35-31-pm-0a11c0.webp",
  },
  {
    key: "tail",
    title: "Tails",
    blurb: "Custom shape, length and markings, with a belt loop or clip attachment.",
    from: 150,
    href: "/product/custom-furry-tail-made-to-order/",
    image: "/media/products/whatsapp-image-2025-12-14-at-12-37-12-pm-519091.webp",
  },
  {
    key: "neon",
    title: "Character neon sign",
    blurb: "A neon light of your fursona, made to order from your reference.",
    from: 250,
    href: "/product/custom-furry-neon-light-made-to-order/",
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
    image: "/media/gallery/assets-task-01k07cz82zf7zb7scm5rpcy2xj-175259525-ca3c05.webp",
  },
  {
    title: "Receive your quote",
    body: "We review your design and reply with a personalised quote and estimated timeline.",
    image: "/media/gallery/assets-task-01k07cswaze1g8v5q84mw4nfjp-175259507-e8b541.webp",
  },
  {
    title: "Confirm & pay deposit",
    body: "Approve the specifications and terms. Orders over $500 start with a 50% deposit; smaller orders are paid upfront.",
    image: "/media/gallery/assets-task-01k07cjg1bfy8skbzyx2n5s9bj-175259483-a8e498.webp",
  },
  {
    title: "Measurements & approvals",
    body: "For bodysuits and paws we ask for your measurements so the suit fits you. Design details are confirmed with you as we go.",
    image: "/media/gallery/assets-task-01k079yvh3fkbv22amabz7s1v7-175259209-4f8af9.webp",
  },
  {
    title: "Build with WIP updates",
    body: "Your suit is patterned, foam-carved and hand-sewn. You get WIP photos at every major stage and can request revisions.",
    image: "/media/gallery/assets-task-01k079dyv3ecr8j7yfrt4evn4r-175259154-ad8448.webp",
  },
  {
    title: "Final approval",
    body: "You see the finished piece before it ships. Any remaining balance is due before shipping.",
    image: "/media/gallery/assets-task-01k0791b5ce6m9nrwt9xgh9515-175259113-09e0e2.webp",
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
