// Permanent redirects from the old WordPress URLs. Pages that only existed as
// duplicates, drafts or injected spam are answered with 410 in src/proxy.ts.
const legacyRedirects = [
  // Duplicate homes
  ["/home-2", "/"],
  ["/home222", "/"],
  ["/kemono-fursuit-commission", "/kemono-fursuits/"],
  // Galleries
  ["/gallery-fursuit-commision", "/gallery/"],
  ["/gallery222", "/gallery/"],
  ["/wip", "/gallery/"],
  ["/gallery-cosplay-commission", "/cosplay-suit-commission/"],
  ["/gallery-plush-commission", "/custom-plush-commission/"],
  // Process pages
  ["/order-process-f", "/order-process/"],
  ["/csc-order-process-cosplay", "/order-process/"],
  ["/custom-plush-order-process", "/order-process/"],
  // Quote forms (the WordPress site had seven)
  ["/fs-get-a-quote", "/get-a-quote/"],
  ["/gq222", "/get-a-quote/"],
  ["/request-quote", "/get-a-quote/"],
  ["/quote-form-page", "/get-a-quote/"],
  ["/real-q-form", "/get-a-quote/"],
  ["/csc-get-a-quote", "/get-a-quote/?service=cosplay"],
  ["/cpc-get-a-quote", "/get-a-quote/?service=plush"],
  // Reference sheets
  ["/plush-reference-sheet", "/furry-ref-sheet-commissions/"],
  ["/furry-art-reference-sheet", "/furry-ref-sheet-commissions/"],
  // Misc
  ["/store333", "/shop/"],
  ["/thankyou", "/"],
  ["/contact-list", "/contact-us/"],
];

const woo = (process.env.NEXT_PUBLIC_WOO_ORIGIN || "").replace(/\/$/, "");
const siteHost = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    const rules = legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
    // Cart, checkout and account live in WooCommerce. Only hand off when the
    // shop origin is a different host, otherwise this would loop.
    if (woo && woo !== siteHost) {
      for (const p of ["cart", "checkout", "my-account"]) {
        rules.push({ source: `/${p}/:path*`, destination: `${woo}/${p}/:path*`, permanent: false });
      }
    }
    return rules;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
