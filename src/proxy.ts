import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// 410 Gone tells search engines a URL was removed on purpose, so they drop it
// faster than a 404. Two groups:
//  - SPAM: the old WordPress install was injected with thousands of casino
//    posts under /blog/ plus junk pages and sitemaps.
//  - RETIRED: cosplay and plush commissions are no longer offered. These URLs
//    were in the old sitemap; there is no equivalent page to redirect to, and
//    redirecting a discontinued service elsewhere would be a soft 404.
const SPAM = [/^\/blogs?(\/|$)/, /^\/(sample-page|11-2|12-2)\/?$/, /^\/(post|page|mailpoet_page|cartflows_step|elementor-hf|wpm-testimonial)-sitemap\d*\.xml$/, /^\/sitemap_index\.xml$/];
const REMOVED_COMMERCE = [/^\/product\//, /^\/product-category\//, /^\/cart\/?$/, /^\/checkout\/?$/, /^\/my-account\/?$/];
const RETIRED = /^\/(cosplay-suit-commission|custom-plush-commission|gallery-cosplay-commission|gallery-plush-commission|csc-order-process-cosplay|custom-plush-order-process|csc-get-a-quote|cpc-get-a-quote)\/?$/;

const retiredPage = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>This service is no longer offered | FursuitCommissions.com</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#F1F8F5;color:#21463F;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}main{max-width:560px;background:#fff;border-radius:2rem;padding:40px;box-shadow:0 8px 24px -12px rgb(33 70 63/.25)}h1{margin:0 0 12px;font-size:1.9rem}p{color:#46625C;line-height:1.6}a{display:inline-block;margin:8px 8px 0 0;padding:12px 20px;border-radius:999px;font-weight:600;text-decoration:none}a.p{background:#21463F;color:#fff}a.s{border:2px solid #21463F;color:#21463F}</style></head>
<body><main><h1>We no longer offer this service</h1><p>FursuitCommissions.com now focuses on custom fursuits, Kemono and Toony suits, fursuit parts and repairs.</p>
<a class="p" href="/fursuit-commission/">Custom fursuits</a><a class="s" href="/fursuit-parts/">Fursuit parts</a><a class="s" href="/">Home</a></main></body></html>`;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (RETIRED.test(pathname)) {
    return new NextResponse(retiredPage, { status: 410, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } });
  }
  if (SPAM.some((re) => re.test(pathname))) {
    return new NextResponse("410 Gone. This page has been permanently removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  if (REMOVED_COMMERCE.some((re) => re.test(pathname))) {
    return new NextResponse("410 Gone. The online shop has been removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request: req });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        response = NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  return supabase.auth.getClaims().then(() => response);
}

export const config = {
  matcher: [
    "/blog/:path*",
    "/blogs/:path*",
    "/blog",
    "/blogs",
    "/sample-page/",
    "/11-2/",
    "/12-2/",
    "/:file(.*sitemap.*\\.xml)",
    "/product/:path*",
    "/product-category/:path*",
    "/cart/",
    "/checkout/",
    "/my-account/",
    "/admin/:path*",
    "/api/admin/:path*",
    "/:slug(cosplay-suit-commission|custom-plush-commission|gallery-cosplay-commission|gallery-plush-commission|csc-order-process-cosplay|custom-plush-order-process|csc-get-a-quote|cpc-get-a-quote)",
    "/:slug(cosplay-suit-commission|custom-plush-commission|gallery-cosplay-commission|gallery-plush-commission|csc-order-process-cosplay|custom-plush-order-process|csc-get-a-quote|cpc-get-a-quote)/",
  ],
};
