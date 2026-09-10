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
    const fadeTimer = setTimeout(() => setFading(true), 1300);
    const removeTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("mc_intro_shown", "1");
      } catch {
        /* no-op */
      }
    }, 1650);

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
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-gold/10 blur-3xl animate-[introGlow_1.6s_ease-out_forwards]" />

      <div className="flex flex-col items-center gap-4">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B8862E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[introIcon_0.6s_ease-out_forwards]"
          style={{ opacity: 0, transform: "translateY(6px) scale(0.9)" }}
        >
          <path d="M3 21h18" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="animate-[introDraw_0.5s_0.15s_ease-out_forwards]" />
          <path d="M6 21V9l6-5 6 5v12" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="animate-[introDraw_0.6s_0.2s_ease-out_forwards]" />
          <path d="M10 21v-6h4v6" pathLength="1" strokeDasharray="1" strokeDashoffset="1" className="animate-[introDraw_0.4s_0.55s_ease-out_forwards]" />
        </svg>
        <div
          className="font-display text-xl font-bold uppercase tracking-wide text-white animate-[introIcon_0.5s_0.3s_ease-out_forwards]"
          style={{ opacity: 0, transform: "translateY(6px)" }}
        >
          {businessName}
        </div>
        <div className="h-[2px] w-16 overflow-hidden bg-white/15">
          <div className="h-full w-full origin-left scale-x-0 animate-[introBar_0.7s_0.55s_ease-out_forwards] bg-gold" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes introBar {
          to { transform: scaleX(1); }
        }
        @keyframes introIcon {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes introDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes introGlow {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="animate-["] { animation: none !important; opacity: 1 !important; transform: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
    </div>
  );
}