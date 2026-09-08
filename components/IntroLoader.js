"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Breve cortina de entrada — se muestra una vez por pestaña (sessionStorage),
// no en cada navegación interna (este componente vive en el layout raíz, que
// no se vuelve a montar entre páginas). Respeta prefers-reduced-motion:
// si el visitante lo tiene activado, no se muestra en absoluto.
export default function IntroLoader({ businessName }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // No mostrar en el panel admin — la cortina es para la experiencia del
    // visitante público, no para Michael entrando a trabajar.
    if (pathname?.startsWith("/admin")) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem("mc_intro_shown") === "1";
    } catch {
      // sessionStorage puede fallar en navegación privada — en ese caso
      // simplemente se muestra la intro (no es crítico).
    }

    if (prefersReduced || alreadyShown) return;

    setVisible(true);
    const fadeTimer = setTimeout(() => setFading(true), 900);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("mc_intro_shown", "1");
      } catch {
        /* no-op */
      }
    }, 1250);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-charcoal transition-opacity duration-[350ms] ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B8862E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M6 21V9l6-5 6 5v12" />
          <path d="M10 21v-6h4v6" />
        </svg>
        <div className="font-display text-xl font-bold uppercase tracking-wide text-white">{businessName}</div>
        <div className="h-[2px] w-16 overflow-hidden bg-white/15">
          <div className="h-full w-full origin-left scale-x-0 animate-[introBar_0.8s_ease-out_forwards] bg-gold" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes introBar {
          to { transform: scaleX(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[introBar_0\\.8s_ease-out_forwards\\] { animation: none; transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
