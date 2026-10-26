import Link from "next/link";
import { site } from "@/content/site";
import { categoryName, shopCategories } from "@/lib/products";
import Logo from "./Logo";

const columns = [
  {
    title: "Commissions",
    links: [
      { label: "Custom Fursuits", href: "/fursuit-commission/" },
      { label: "Kemono Suits", href: "/kemono-fursuits/" },
      { label: "Toony Suits", href: "/toony-fursuits/" },
      { label: "Fursuit Parts", href: "/fursuit-parts/" },
      { label: "Repairs & Refurbishment", href: "/fursuit-repairs/" },
      { label: "Payment Plans", href: "/payment-plans/" },
      { label: "Reference Sheets", href: "/furry-ref-sheet-commissions/" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Gallery", href: "/gallery/" },
      { label: "Our Process", href: "/order-process/" },
      { label: "FAQ", href: "/#faq" },
      { label: "About Us", href: "/about-us/" },
      { label: "Contact", href: "/contact-us/" },
      { label: "Get a Quote", href: "/get-a-quote/" },
    ],
  },
  {
    title: "Shop",
    links: [{ label: "All products", href: "/shop/" }].concat(
      shopCategories
        .filter((c) => c.count > 1)
        .slice(0, 5)
        .map((c) => ({ label: categoryName(c.slug), href: `/product-category/${c.slug}/` })),
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-mint-footer text-forest">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-forest/90">
            Handmade custom fursuits, Kemono and Toony suits, built around your character and shipped worldwide.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Social media">
            {site.socials.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener" className="btn-sm btn bg-white text-forest hover:bg-mint-light">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-forest">{col.title}</h2>
            <ul className="mt-4 space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-[36px] items-center text-forest/90 hover:text-forest hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-forest/10">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-forest/90 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Commissions: {site.paymentMethods.join(" & ")} · Shop: card via Stripe</span>
            <Link href="/payment-plans/" className="hover:underline">
              Payment plans
            </Link>
            <Link href="/terms-and-conditions/" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy-policy/" className="hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
