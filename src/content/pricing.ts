// Starting prices per commission package, set by the owner (Nov 2026).
// Every build is still quoted to the character; these are the "from" prices.

export type CoveragePart = "head" | "hands" | "feet" | "tail" | "body";
export type PricePlan = {
  key: string;
  title: string;
  from: number;
  badge?: string;
  tagline: string;
  includes: string[];
  parts: CoveragePart[];
  coverage: string;
};

export const coverageLabels: Record<CoveragePart, string> = { head: "Head", hands: "Hand paws", feet: "Feet paws", tail: "Tail", body: "Bodysuit" };

export const pricePlans: PricePlan[] = [
  {
    key: "head",
    title: "Fursuit head",
    from: 700,
    badge: "Entry tier",
    tagline: "Start with the face.",
    includes: ["Custom head base", "Eyes, brows and markings", "Padded, breathable lining"],
    parts: ["head"],
    coverage: "head",
  },
  {
    key: "mini-partial",
    title: "Mini partial",
    from: 1000,
    tagline: "The classic con setup.",
    includes: ["Fursuit head", "Hand paws", "Tail"],
    parts: ["head", "hands", "tail"],
    coverage: "partial",
  },
  {
    key: "partial",
    title: "Partial",
    from: 1200,
    badge: "Most popular",
    tagline: "A mini partial plus feet paws.",
    includes: ["Fursuit head", "Hand and feet paws", "Tail"],
    parts: ["head", "hands", "feet", "tail"],
    coverage: "partial",
  },
  {
    key: "fullsuit",
    title: "Fullsuit",
    from: 1600,
    tagline: "Your character, head to tail.",
    includes: ["Head, hand and feet paws", "Bodysuit made to measure", "Tail, plantigrade or digitigrade"],
    parts: ["head", "hands", "feet", "tail", "body"],
    coverage: "fullsuit",
  },
];

/** Starting price by commission option key (fullsuit, partial, head). */
export const planFrom: Record<string, number> = { head: 700, partial: 1000, fullsuit: 1600 };

/** What every customer can expect from support. */
export const supportPromises = [
  { title: "Reply within 12 hours", body: "Our customer support team gets back to every message and quote request within 12 hours." },
  { title: "Fast, free quote", body: "Send your ref sheet and we send a clear, itemised quote quickly. No obligation." },
  { title: "Instalment plans", body: "Spread the cost with weekly or biweekly payments on eligible orders." },
];

/** How an instalment plan is structured (amounts and dates are set in each quote). */
export const instalmentSteps = [
  { title: "Upfront payment", body: "Orders over $500 start with an upfront payment, set in your quote, to reserve your slot and begin work." },
  { title: "Weekly or biweekly", body: "Pay the rest in weekly or biweekly instalments while we build, on the dates listed in your quote." },
  { title: "Balance before shipping", body: "The final instalment clears before your suit ships, so there is nothing left to pay on delivery." },
];
