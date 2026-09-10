"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconPhone, IconWhatsapp } from "./Icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function SiteHeader({ config }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappLink = buildWhatsAppLink(config.whatsapp);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/estimate", label: "AI Estimate" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`bg-charcoal text-white transition-all ${
          scrolled ? "max-h-0 overflow-hidden opacity-0" : "max-h-12 py-2"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-[11.5px] font-semibold tracking-wide sm:text-[12.5px]">
          <div className="flex gap-5 opacity-80">
            <span>Free estimates</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Same-day response</span>
          </div>
          <div className="flex items-center gap-4">
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 opacity-90"
              >
                <IconWhatsapp className="h-3 w-3" />
                WhatsApp
              </a>
            )}
            <a href={`tel:${config.phone}`} className="flex items-center gap-1.5 opacity-90">
              <IconPhone className="h-3 w-3" />
              {config.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-paper/95 backdrop-blur">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B8862E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M6 21V9l6-5 6 5v12" />
              <path d="M10 21v-6h4v6" />
            </svg>
            <div className="font-display text-xl font-bold uppercase leading-none tracking-wide text-ink">
              {config.businessName}
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[14px] font-bold text-ink md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gold-dark">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/estimate" className="btn-primary hidden text-xs sm:inline-flex">
              Free Estimate
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-line md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-line bg-paper px-6 py-4 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-2 py-2.5 text-[15px] font-bold text-ink hover:bg-paper-2"
              >
                {l.label}
              </Link>
            ))}
            <a href={`tel:${config.phone}`} className="mt-2 rounded-sm px-2 py-2.5 text-[15px] font-bold text-gold-dark">
              {config.phone}
            </a>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm px-2 py-2.5 text-[15px] font-bold text-gold-dark"
              >
                <IconWhatsapp className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}