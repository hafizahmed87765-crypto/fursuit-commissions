import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { pricePlans } from "@/content/pricing";
import AnnouncementBar, { announcementScript } from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Consent from "@/components/Consent";
import RevealObserver from "@/components/RevealObserver";
import JsonLd from "@/components/JsonLd";

// Fredoka (rounded, echoes the logo wordmark) for headings, Nunito Sans for body.
const display = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = Nunito_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Custom Fursuit & Kemono Commissions | FursuitCommissions.com", template: "%s | FursuitCommissions.com" },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = { themeColor: "#A5D4C4", width: "device-width", initialScale: 1 };

// Site-wide structured data: the business (with its starting-price offers) and the website.
const orgId = `${site.url}/#org`;
const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": orgId,
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/logo.png`,
      description: "Handmade custom fursuits, Kemono and Toony suits, fursuit parts and repairs, made to order and shipped worldwide.",
      ...(site.email ? { email: site.email, contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.email, availableLanguage: "English" } } : {}),
      sameAs: site.socials.map((s) => s.href),
      makesOffer: pricePlans.map((p) => ({
        "@type": "Offer",
        name: p.title,
        description: p.includes.join("; "),
        url: `${site.url}/fursuit-prices/`,
        priceSpecification: { "@type": "PriceSpecification", minPrice: p.from, priceCurrency: "USD" },
      })),
    },
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: "en", publisher: { "@id": orgId } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so scroll-reveal never hides content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');" + announcementScript() }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only z-[100] rounded-xl bg-forest px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <AnnouncementBar />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Consent />
        <RevealObserver />
        <JsonLd data={orgLd} />
      </body>
    </html>
  );
}
