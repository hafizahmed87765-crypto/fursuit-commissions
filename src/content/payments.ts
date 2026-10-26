// Payment plan content for /payment-plans/.
//
// Sources (Oct 2026):
// - Terms of Service (May 14, 2026): deposit rule, balance due before
//   shipping, "payment plans may be available on select orders and may
//   include a small processing fee", refunds/cancellations, PayPal + Stripe.
// - Live WooCommerce Store API: the only enabled shop checkout gateway is
//   `stripe` (card). PayPal is NOT enabled at shop checkout.
//
// Values set to `null` are NOT published by the business yet. The page shows
// neutral "confirmed in your written quote" wording for them instead of
// inventing numbers. Fill them in to publish specifics (see docs/CONTENT-TODO.md).

export const paymentPlanConfig = {
  /** e.g. "Up to 3 instalments". CONFIRM with owner. */
  maxInstalments: null as string | null,
  /** e.g. "Every 30 days". CONFIRM with owner. */
  instalmentInterval: null as string | null,
  /** Terms say "may include a small processing fee". Exact fee: CONFIRM. */
  processingFee: null as string | null,
  /** Minimum order value for a plan. CONFIRM (deposit rule starts at $500). */
  minimumOrder: null as string | null,
  /** What happens if an instalment is late. CONFIRM. */
  latePaymentPolicy: null as string | null,
};

export const depositRules = [
  { label: "Orders under $500", value: "Paid in full upfront", body: "Work begins once full payment is received and your design is approved." },
  { label: "Orders over $500", value: "50% deposit to start", body: "A 50% non-refundable deposit starts work; the remaining balance is due before shipping." },
];

/** How commission invoices can be paid, per the Terms of Service. */
export const commissionPaymentMethods = ["PayPal", "Stripe (card)"];
/** Gateways actually enabled on the WooCommerce shop checkout. */
export const shopCheckoutMethods = ["Card payments via Stripe"];

export const paymentTimeline = [
  { title: "Request a quote", body: "Tell us about your character and tick “Interested in a payment plan” on the quote form." },
  { title: "Receive your quote", body: "Your written quote states the total price and, if a plan is offered for your order, its schedule and any processing fee." },
  { title: "Pay to start", body: "Under $500: pay in full. Over $500: pay the 50% non-refundable deposit. Work begins once payment is received and the design is approved." },
  { title: "Production", body: "We build your suit with WIP updates. Any agreed instalments are paid on the dates set in your quote." },
  { title: "Balance before shipping", body: "Full payment must be cleared before your order ships — no exceptions." },
];

export const paymentFaqs = [
  {
    q: "How much is the deposit?",
    a: "Orders over $500 start with a 50% non-refundable deposit. Orders under $500 are paid in full before work begins.",
  },
  {
    q: "Can I pay the rest in instalments?",
    a: "Payment plans may be available on select orders. Ask on your quote request; if a plan is possible for your commission, the schedule is set out in your written quote before you pay anything.",
  },
  {
    q: "Is there a fee for a payment plan?",
    a: "A payment plan may include a small processing fee. Any fee is stated in your quote, so you'll know the full cost before agreeing.",
  },
  {
    q: "When is the final balance due?",
    a: "The remaining balance must be paid and cleared before your order ships.",
  },
  {
    q: "Can I get a refund on my deposit?",
    a: "No. Deposits are non-refundable under all circumstances, and no refunds are given once work has begun (materials bought or cutting/construction started).",
  },
  {
    q: "What if I need to cancel mid-production?",
    a: "If you cancel during production, any completed work becomes the property of FursuitCommissions.com and may be sold as a premade item. Payments already made are not refunded.",
  },
  {
    q: "What happens if I miss a payment?",
    a: "Contact us as soon as you can. How late instalments are handled is agreed in writing with your payment plan; your order cannot ship until the full balance has cleared.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Commission payments are accepted via PayPal and Stripe. Ready-made shop items are paid by card at checkout through Stripe. If you need to spread the cost, ask about a payment plan on your quote request.",
  },
];
