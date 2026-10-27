import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = { title: string; description: string; path: string; image?: string; noindex?: boolean };

export function pageMeta({ title, description, path, image, noindex }: PageMeta): Metadata {
  const url = `${site.url}${path}`;
  // Default preview is Admin > Site images slot P8, served via a redirect route.
  const og = image ?? "/share-image/P8/";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website", images: [{ url: og }] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${site.url}${c.path}` })),
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${site.url}${path}`,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: site.name, url: site.url },
  };
}
