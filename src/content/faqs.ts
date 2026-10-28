// FAQ answers are written from the studio's Terms of Service and existing
// homepage FAQ. Keep them in sync with /terms-and-conditions/.

export type Faq = { q: string; a: string; link?: { href: string; label: string } };

export const generalFaqs: Faq[] = [
  {
    q: "What is a custom fursuit commission?",
    a: "A fursuit built from scratch to match your character or fursona. We pattern, carve and sew every part around your reference sheet, so no two suits are the same.",
  },
  {
    q: "Is a fursuit the same as a furry costume?",
    a: "Yes. \"Fursuit\" is the furry community's word for a custom furry costume: a wearable version of an animal or anthropomorphic character. Ours are made to order around your own character rather than sold off the shelf.",
    link: { href: "/furry-costumes/", label: "About our custom furry costumes" },
  },
  {
    q: "What types of suits and parts can I order?",
    a: "Fullsuits, partials, fursuit heads, hand paws, feet paws and tails, in Kemono, Toony or custom styles. We also take repair assessments.",
    link: { href: "/fursuit-commission/", label: "Compare coverage options" },
  },
  {
    q: "How do I request a quote?",
    a: "Fill in the quote form with your character details, references and budget. Quotes are free, and submitting the form does not commit you to anything.",
    link: { href: "/get-a-quote/", label: "Open the quote form" },
  },
  {
    q: "What if I don't have a reference sheet?",
    a: "A clear reference sheet is required before production starts, but you don't need one to ask for a quote. Our artists can draw one for you from your descriptions and sketches.",
    link: { href: "/furry-ref-sheet-commissions/", label: "Reference sheet commissions" },
  },
  {
    q: "How are prices determined?",
    a: "By coverage (head, partial or fullsuit), design complexity, markings, materials and extras. Every quote is an estimate based on your design; final pricing may adjust slightly once details are confirmed.",
    link: { href: "/fursuit-prices/", label: "Fursuit commission prices explained" },
  },
  {
    q: "Do you make digitigrade and plantigrade fursuits?",
    a: "Yes. Plantigrade bodysuits follow human-like legs; digitigrade bodysuits add padding for an animal leg shape. Choose your leg style in the quote form, or pick \"Not sure\" and we'll talk it through.",
    link: { href: "/fursuit-commission/", label: "Fullsuit and partial options" },
  },
  {
    q: "How long does production take?",
    a: "It depends on complexity. On average a commission takes about 6 to 12 weeks, and you receive an estimated timeline with your quote.",
  },
  {
    q: "What payment arrangements are available?",
    a: "Orders under $500 are paid in full upfront. Orders over $500 need an upfront, non-refundable payment to start, with the balance due before shipping. Payment plans may be available on select orders. We accept PayPal and Stripe.",
    link: { href: "/payment-plans/", label: "How deposits and payment plans work" },
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. Import duties, taxes and customs fees are the buyer's responsibility, and we recommend shipping insurance.",
  },
  {
    q: "What happens after I submit my commission request?",
    a: "We review your references and reply by email with questions or a quote and estimated timeline. Submitting a request does not reserve a slot until the quote is accepted and payment is received.",
    link: { href: "/order-process/", label: "See the full process" },
  },
  {
    q: "Do I need to be 18 to commission?",
    a: "Yes. Clients must be 18 or older; minors need verifiable parent or guardian approval and involvement throughout the order.",
  },
];

export const repairFaqs: Faq[] = [
  {
    q: "Can you repair a suit made by another maker?",
    a: "Send us photos and we'll assess it. Whether we can take it on depends on the construction, materials and damage; we'll tell you honestly if it's not something we can fix well.",
  },
  {
    q: "What information do you need for a repair assessment?",
    a: "Clear photos of the whole piece and close-ups of each problem area, the original maker if known, the suit's age and history, and what you'd like fixed.",
  },
  {
    q: "Does submitting the form mean my repair is accepted?",
    a: "No. The form requests an assessment. We confirm whether we can take the job and send a quote before anything is shipped to us.",
  },
  {
    q: "Is my commission covered by warranty?",
    a: "Commissions from us include a 6-month limited warranty from delivery, covering manufacturing defects such as seam failures or structural foam issues. It does not cover wear and tear, washing damage or misuse. Shipping both ways is the buyer's responsibility.",
    link: { href: "/terms-and-conditions/", label: "Warranty terms" },
  },
  {
    q: "How should I care for my suit?",
    a: "Air-dry the head and parts after every wear, brush fur gently with a pet slicker brush, and spot-clean rather than machine-wash unless your maker says otherwise. Store it somewhere cool, dry and out of direct sunlight.",
  },
];

// Questions for the furry costume and furry mascot pages. Answers only state
// what the studio already publishes; mascot work outside personal characters
// is confirmed per quote (see docs/CONTENT-TODO.md).
export const costumeFaqs: Faq[] = [
  {
    q: "What is a custom furry costume?",
    a: "A furry costume (or fursuit) is a wearable version of an animal or anthropomorphic character. A custom one is patterned from your reference sheet, so the head, markings, colours and paws match your character instead of a stock design.",
  },
  {
    q: "What parts can a furry costume include?",
    a: "A fursuit head, hand paws, feet paws, a tail and a bodysuit. A head with hand paws and a tail is a partial; adding the bodysuit and feet paws makes a fullsuit. Parts can also be ordered on their own.",
    link: { href: "/fursuit-parts/", label: "Fursuit parts" },
  },
  {
    q: "What are your furry costumes made from?",
    a: "Heads are foam-carved or resin-based, then patterned and furred by hand. Bodysuits, paws and tails are cut from faux fur and hand-sewn to your markings. Your quote lists the build details for your design.",
  },
  {
    q: "Will the costume fit me?",
    a: "Bodysuits and paws are sized to the measurements you send after approving your quote, so the costume is made for your body rather than a standard size.",
    link: { href: "/order-process/", label: "Measurements in the commission process" },
  },
];

export const mascotFaqs: Faq[] = [
  {
    q: "What is the difference between a furry mascot and a fursuit?",
    a: "The words overlap. \"Mascot costume\" usually means a character worn to represent a team, brand or event, while a fursuit is usually a personal character. We build both the same way: handmade around a character design, with a fitted bodysuit and paws.",
  },
  {
    q: "Can you make a mascot costume for a club, stream or event?",
    a: "Tell us about the character and how it will be used in your quote request. Mascot-style requests are reviewed individually, and we'll confirm whether the design suits our handmade fursuit process before quoting.",
    link: { href: "/get-a-quote/", label: "Request a mascot quote" },
  },
  {
    q: "Do I need a finished character design?",
    a: "A clear reference sheet is needed before production. If your mascot only exists as a logo, sketch or description, our artists can draw a reference sheet first.",
    link: { href: "/furry-ref-sheet-commissions/", label: "Reference sheet commissions" },
  },
];

export const pricingFaqs: Faq[] = [
  {
    q: "How much does a custom fursuit cost?",
    a: "It depends on coverage and design. Parts have published starting prices; heads, partials and fullsuits are quoted individually because markings, style and extras change the work involved. Quotes are free and don't commit you to anything.",
    link: { href: "/get-a-quote/", label: "Get a free fursuit quote" },
  },
  {
    q: "Why don't you list a fixed price for fullsuits?",
    a: "Two fullsuits can differ hugely in work: a two-colour plantigrade suit and a heavily marked digitigrade suit are not the same build. Quoting from your reference keeps the price tied to your actual character.",
  },
  {
    q: "Is shipping included in the price?",
    a: "Shipping and insurance are included in your final quote. Import duties, taxes and customs fees are paid by the buyer.",
  },
  {
    q: "Can I spread the cost?",
    a: "Orders under $500 are paid in full upfront. Larger orders start with an upfront, non-refundable payment, and payment plans may be available on select orders.",
    link: { href: "/payment-plans/", label: "Deposits and payment plans" },
  },
];
