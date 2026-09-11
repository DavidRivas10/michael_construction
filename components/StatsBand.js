"use client";

import { useEffect, useRef, useState } from "react";
import { IconClipboard, IconStar, IconClock, IconCheck } from "./Icons";

// Franja de estadísticas con dos efectos: los círculos de íconos aparecen
// con un pequeño rebote (no todos a la vez — cada uno con un poco de
// retraso) y los números reales (años, calificación, cantidad de reseñas)
// cuentan hacia arriba, ambos disparados por IntersectionObserver cuando la
// sección entra en pantalla — no antes, no al cargar la página entera.
function useCountUp(target, { decimals = 0, duration = 1400, active }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current || target == null) return;
    started.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const start = performance.now();
    let raf;
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return decimals ? value.toFixed(decimals) : Math.round(value);
}

function Ring({ children, delay, active }) {
  return (
    <span
      className={`stat-ring flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold ${active ? "is-visible" : ""}`}
      style={{ transitionDelay: active ? `${delay}ms` : "0ms" }}
    >
      {children}
    </span>
  );
}

export default function StatsBand({ yearsInBusiness, avgRating, reviewCount }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const years = useCountUp(Number(yearsInBusiness) || 0, { active });
  const rating = useCountUp(avgRating ? Number(avgRating) : 0, { decimals: 1, active: active && !!avgRating });
  const count = useCountUp(reviewCount || 0, { active: active && !!avgRating });

  return (
    <section ref={ref} className="bg-charcoal py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-6 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
        <div className="flex flex-col items-center gap-3 text-center sm:px-6">
          <Ring delay={50} active={active}><IconClipboard className="h-6 w-6" /></Ring>
          <div className="font-display text-4xl font-black text-white">{years}+</div>
          <div className="text-[12.5px] font-bold uppercase tracking-wide text-white/55">Years in business</div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center sm:px-6">
          <Ring delay={150} active={active}><IconStar className="h-6 w-6" /></Ring>
          {avgRating ? (
            <>
              <div className="font-display text-4xl font-black text-white">{rating}<span className="text-xl text-white/50">/5</span></div>
              <div className="text-[12.5px] font-bold uppercase tracking-wide text-white/55">
                From {count} review{reviewCount !== 1 ? "s" : ""}
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-4xl font-black text-white">100%</div>
              <div className="text-[12.5px] font-bold uppercase tracking-wide text-white/55">No-pressure estimates</div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 text-center sm:px-6">
          <Ring delay={250} active={active}><IconClock className="h-6 w-6" /></Ring>
          <div className="font-display text-4xl font-black text-white">Same-day</div>
          <div className="text-[12.5px] font-bold uppercase tracking-wide text-white/55">Response, most requests</div>
        </div>

        <div className="flex flex-col items-center gap-3 text-center sm:px-6">
          <Ring delay={350} active={active}><IconCheck className="h-6 w-6" /></Ring>
          <div className="font-display text-4xl font-black text-white">Licensed</div>
          <div className="text-[12.5px] font-bold uppercase tracking-wide text-white/55">&amp; fully insured</div>
        </div>
      </div>
    </section>
  );
}
