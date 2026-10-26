"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import Logo from "./Logo";

type Item = (typeof nav.primary)[number];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path fill="currentColor" d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}

function DesktopItem({ item, active }: { item: Item; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const children = "children" in item ? item.children : undefined;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const base = `inline-flex min-h-[44px] items-center gap-1 whitespace-nowrap rounded-full px-3.5 font-display font-semibold transition hover:bg-mint-light ${active ? "text-forest bg-mint-light/70" : "text-forest/85"}`;

  if (!children) {
    return (
      <li>
        <Link href={item.href} className={base} aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
      </li>
    );
  }
  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className={base} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        {item.label}
        <Chevron open={open} />
      </button>
      <div className={`absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2 transition duration-200 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        <ul className="card p-2">
          {children.map((c) => (
            <li key={c.href}>
              <Link href={c.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 transition hover:bg-mint-wash">
                <span className="block font-display font-semibold text-forest">{c.label}</span>
                {"note" in c ? <span className="block text-sm text-ink-muted">{String(c.note)}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const f = Array.from(panel.querySelectorAll<HTMLElement>("a,button"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${scrolled ? "shadow-card" : ""}`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.primary.map((item) => (
              <DesktopItem key={item.label} item={item} active={isActive(item.href)} />
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href={nav.cta.href} className="btn-primary btn-sm hidden whitespace-nowrap sm:inline-flex">
            {nav.cta.label}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest hover:bg-mint-light xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-white transition duration-300 xl:hidden ${menuOpen ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"}`}
      >
        <nav aria-label="Mobile" className="container-x pb-32 pt-4">
          <ul className="divide-y divide-forest/10">
            {nav.primary.map((item) => (
              <li key={item.label} className="py-3">
                {"children" in item && item.children ? (
                  <>
                    <p className="px-2 pb-1 font-display text-sm font-semibold uppercase tracking-wider text-mint-deep">{item.label}</p>
                    <ul>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex min-h-[48px] items-center rounded-xl px-2 font-display text-lg font-semibold text-forest hover:bg-mint-wash">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="flex min-h-[48px] items-center rounded-xl px-2 font-display text-lg font-semibold text-forest hover:bg-mint-wash">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="fixed inset-x-0 bottom-0 border-t border-forest/10 bg-white p-4">
          <Link href={nav.cta.href} className="btn-primary w-full">
            {nav.cta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
