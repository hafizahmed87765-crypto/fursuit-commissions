// FAQ answers are written from the studio's Terms of Service and existing
// homepage FAQ. Keep them in sync with /terms-and-conditions/.

export type Faq = { q: string; a: string; link?: { href: string; label: string } };

export const generalFaqs: Faq[] = [
  {
    q: "What is a custom fursuit commission?",
    a: "A fursuit built from scratch to match your character or fursona. We pattern, carve and sew every part around your reference sheet, so no two suits are the same.",
  },
  {
    q: "What types of suits and parts can I order?",
    a: "Fullsuits, partials, fursuit heads, hand paws, feet paws and tails, in Kemono, Toony or custom styles. We also take repair assessments, and sell ready-made parts in our shop.",
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
  },
  {
    q: "How long does production take?",
    a: "It depends on complexity. On average a commission takes about 6–12 weeks, and you receive an estimated timeline with your quote.",
  },
  {
    q: "What payment arrangements are available?",
    a: "Orders under $500 are paid in full upfront. Orders over $500 start with a 50% non-refundable deposit and the balance is due before shipping. Payment plans may be available on select orders. We accept PayPal and Stripe.",
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
