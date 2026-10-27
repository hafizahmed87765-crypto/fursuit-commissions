// Permanent redirects from the old WordPress URLs. Pages that only existed as
// duplicates, drafts or injected spam, and the discontinued cosplay/plush
// services, are answered with 410 in src/proxy.ts.
const legacyRedirects = [
  // Duplicate homes
  ["/home-2", "/"],
  ["/home222", "/"],
  ["/kemono-fursuit-commission", "/kemono-fursuits/"],
  // Galleries
  ["/gallery-fursuit-commision", "/gallery/"],
  ["/gallery222", "/gallery/"],
  ["/wip", "/gallery/"],
  // Process pages
  ["/order-process-f", "/order-process/"],
  // Quote forms (the WordPress site had seven)
  ["/fs-get-a-quote", "/get-a-quote/"],
  ["/gq222", "/get-a-quote/"],
  ["/request-quote", "/get-a-quote/"],
  ["/quote-form-page", "/get-a-quote/"],
  ["/real-q-form", "/get-a-quote/"],
  // Reference sheets
  ["/plush-reference-sheet", "/furry-ref-sheet-commissions/"],
  ["/furry-art-reference-sheet", "/furry-ref-sheet-commissions/"],
  // Misc
  ["/store333", "/fursuit-parts/"],
  ["/shop/:path*", "/fursuit-parts/"],
  ["/thankyou", "/"],
  ["/contact-list", "/contact-us/"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  // Room for several photos per gallery upload (each is capped at 10 MB server-side).
  experimental: { serverActions: { bodySizeLimit: "60mb" } },
  images: {
    formats: ["image/avif", "image/webp"],
    // Admin-uploaded gallery photos are served from Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  async redirects() {
    const rules = legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
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
