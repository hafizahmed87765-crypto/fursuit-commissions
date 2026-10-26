import { NextResponse, type NextRequest } from "next/server";

// The old WordPress install was injected with thousands of casino spam posts
// under /blog/ plus a handful of junk pages. Answering 410 Gone tells search
// engines to drop them faster than a 404 would.
const GONE = [/^\/blog(\/|$)/, /^\/blogs(\/|$)/, /^\/(sample-page|11-2|12-2)\/?$/, /^\/(post|page|mailpoet_page|cartflows_step|elementor-hf|wpm-testimonial)-sitemap\d*\.xml$/, /^\/sitemap_index\.xml$/];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (GONE.some((re) => re.test(pathname))) {
    return new NextResponse("410 Gone — this page has been permanently removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/:path*", "/blogs/:path*", "/blog", "/blogs", "/sample-page/", "/11-2/", "/12-2/", "/:file(.*sitemap.*\\.xml)"],
};
