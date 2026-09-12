"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconPhone, IconWhatsapp } from "./Icons";
import { LogoMark } from "./LogoMark";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// v5 — el header ahora tiene dos estados reales en vez de un fondo oscuro
// fijo: transparente sobre la foto del hero (logo blanco, sin caja
// alrededor) y sólido/"glass" en cuanto se hace scroll (fondo azul-marino
// con blur, sombra delicada, mejor contraste). `overHero` lo activa una
// página con hero de foto a pantalla completa (el home); el resto de
// páginas nace directo en su estado sólido, y en ese caso el propio header
// reserva su alto con un spacer para no tapar el contenido de abajo (es
// "fixed", no "sticky", para poder flotar sobre el hero sin ocupar espacio
// ahí).
export default function SiteHeader({ config, overHero = false }) {
  const [scrolled, setScrolled] = useState(!overHero);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overHero) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  const transparent = overHero && !scrolled;
  const whatsappLink = buildWhatsAppLink(config.whatsapp);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/estimate", label: "AI Estimate" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "bg-navy-dark/95 shadow-[0_8px_30px_-12px_rgba(10,15,28,0.55)] backdrop-blur-md"
        }`}
      >
        <div
          className={`hidden overflow-hidden border-b transition-all duration-500 sm:block ${
            transparent ? "max-h-10 border-white/15 opacity-100" : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[12px] font-semibold tracking-wide text-white/70">
            <div className="flex gap-5">
              <span>Mon–Sat, 7am–6pm</span>
              <span>·</span>
              <span>Free estimates, same-day response</span>
            </div>
            <div className="flex items-center gap-5">
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                  <IconWhatsapp className="h-3 w-3" />
                  WhatsApp
                </a>
              )}
              <a href={`tel:${config.phone}`} className="flex items-center gap-1.5 hover:text-white">
                <IconPhone className="h-3 w-3" />
                {config.phone}
              </a>
            </div>
          </div>
        </div>

        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-[1.02]">
            <LogoMark variant="light" size={scrolled ? "sm" : "md"} className="transition-all duration-500" />
          </Link>

          <nav className="hidden items-center gap-8 text-[13.5px] font-bold uppercase tracking-wide text-white/85 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${config.phone}`} className="hidden items-center gap-2 text-sm font-bold text-white/90 lg:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30">
                <IconPhone className="h-4 w-4" />
              </span>
              {config.phone}
            </a>
            <Link href="/estimate" className="btn-primary !hidden text-xs sm:!inline-flex">
              Get a Quote
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/30 text-white md:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-white/10 bg-navy-dark px-6 py-4 md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-sm px-2 py-2.5 text-[15px] font-bold text-white hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <a href={`tel:${config.phone}`} className="mt-2 flex items-center gap-1.5 rounded-sm px-2 py-2.5 text-[15px] font-bold text-gold">
              <IconPhone className="h-4 w-4" />
              {config.phone}
            </a>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm px-2 py-2.5 text-[15px] font-bold text-gold"
              >
                <IconWhatsapp className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
          </nav>
        )}
      </header>

      {/* Spacer — solo en páginas sin hero de foto, para que el header
          "fixed" no tape el contenido. En el home (overHero) no hace
          falta: el propio hero tiene padding-top suficiente para dejar
          lugar al header transparente. */}
      {!overHero && <div className="h-[76px]" />}
    </>
  );
}
