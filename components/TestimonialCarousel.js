"use client";

import { useEffect, useRef, useState } from "react";
import { IconStar } from "./Icons";

// Iniciales dentro de un círculo dorado — el "avatar" que casi toda
// plantilla de reseñas usa junto a la cita, en vez de dejar el texto solo.
// No tenemos foto real del cliente, así que usamos sus iniciales en vez de
// una foto de stock genérica (que se vería falso).
function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft font-display text-lg font-bold text-gold-dark">
      {initials || "?"}
    </div>
  );
}

export default function TestimonialCarousel({ reviews }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fading, setFading] = useState(false);
  const timer = useRef(null);
  const fadeTimer = useRef(null);

  // Cambia de reseña con un breve crossfade (sale, cambia el texto, entra)
  // en vez de un corte instantáneo — igual que el resto de las plantillas
  // de referencia con testimonio único. Respeta prefers-reduced-motion
  // saltando directo al cambio.
  function goTo(next) {
    if (next === index) return;
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIndex(next);
      return;
    }
    setFading(true);
    clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setIndex(next);
      setFading(false);
    }, 220);
  }

  useEffect(() => () => clearTimeout(fadeTimer.current), []);

  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    timer.current = setInterval(() => {
      goTo((index + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, reviews.length, index]);

  if (reviews.length === 0) return null;
  const r = reviews[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tarjeta de cita única con comillas grandes decorativas de fondo —
          en vez del bloque de texto plano, es el patrón de "single
          testimonial card" de las plantillas de construcción de
          referencia. Flechas prev/next como círculos a los costados,
          fuera de la tarjeta, en vez de debajo. */}
      <div
        className={`testi-fade group relative overflow-hidden rounded-sm border border-line bg-white px-8 py-12 text-center shadow-[0_30px_60px_-40px_rgba(15,17,21,0.25)] sm:px-16 sm:py-14 ${
          fading ? "is-out" : ""
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute -left-3 -top-6 h-28 w-28 text-gold/10 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 sm:h-36 sm:w-36"
          fill="currentColor"
        >
          <path d="M27 30C15 34 8 44 8 58c0 12 8 20 18 20 9 0 16-7 16-16 0-8-6-14-13-14-2 0-3 0-4 1 1-9 7-15 15-18l-13-1zm48 0c-12 4-19 14-19 28 0 12 8 20 18 20 9 0 16-7 16-16 0-8-6-14-13-14-2 0-3 0-4 1 1-9 7-15 15-18l-13-1z" />
        </svg>

        <div className="relative mb-6 flex justify-center gap-0.5 text-gold">
          {Array.from({ length: r.rating }).map((_, i) => (
            <IconStar key={i} className="h-4 w-4" />
          ))}
        </div>
        <p className="relative mb-8 text-xl leading-relaxed text-ink sm:text-2xl">&ldquo;{r.text}&rdquo;</p>
        <div className="relative flex items-center justify-center gap-3">
          <Avatar name={r.author} />
          <div className="text-left">
            <div className="text-sm font-bold text-ink">{r.author}</div>
            <div className="text-xs text-ink-faint">{r.neighborhood}</div>
          </div>
        </div>
      </div>

      {reviews.length > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={() => goTo((index - 1 + reviews.length) % reviews.length)}
            className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition hover:scale-110 hover:border-gold hover:text-gold active:scale-95 sm:flex"
          >
            ‹
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => goTo((index + 1) % reviews.length)}
            className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 translate-x-5 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition hover:scale-110 hover:border-gold hover:text-gold active:scale-95 sm:flex"
          >
            ›
          </button>
        </>
      )}

      <div className="mt-7 flex items-center justify-center gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            aria-label={`Ver reseña ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all hover:bg-gold-soft ${
              i === index ? "w-6 bg-gold" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
