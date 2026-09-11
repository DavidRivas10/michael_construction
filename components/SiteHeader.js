"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconPhone, IconWhatsapp } from "./Icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// v4 — header oscuro permanente en vez de la franja clara que se ocultaba al
// hacer scroll. Es el patrón que se repite en las plantillas de referencia
// de construcción/reparación: barra de utilidad delgada arriba (teléfono +
// disponibilidad) y debajo una barra principal en azul-negro con el logo en
// blanco, nav en gris claro, y un botón sólido naranja de "Get a Quote"
// siempre visible — no solo en desktop. Al hacer scroll no se oculta nada,
// solo se comprime un poco el padding vertical.
export default function SiteHeader({ config }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
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
    <header className="sticky top-0 z-40 bg-charcoal shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="hidden border-b border-white/10 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[12px] font-semibold tracking-wide text-white/60">
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
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold transition-transform duration-300 group-hover:-rotate-[8deg] group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0C12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M6 21V9l6-5 6 5v12" />
              <path d="M10 21v-6h4v6" />
            </svg>
          </span>
          <div className="font-display text-xl font-bold uppercase leading-none tracking-wide text-white">
            {config.businessName}
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] font-bold uppercase tracking-wide text-white/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${config.phone}`} className="hidden items-center gap-2 text-sm font-bold text-white/85 lg:flex">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25">
              <IconPhone className="h-4 w-4" />
            </span>
            {config.phone}
          </a>
          <Link href="/estimate" className="btn-primary hidden text-xs sm:inline-flex">
            Get a Quote
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/25 text-white md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-charcoal-soft px-6 py-4 md:hidden">
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
  );
}
