"use client";

import { useEffect, useRef, useState } from "react";

// Fotos reales del carrusel principal. Coloca los archivos en /public/hero/
// con estos mismos nombres — cualquier imagen JPG/PNG normal sirve, no hace
// falta ningún tamaño exacto (se recortan automáticamente con object-cover).
const SLIDES = [
  { src: "/hero/painting-ceiling.jpg", caption: "Careful, clean prep on every job" },
  { src: "/hero/interior-living.jpg", caption: "Interior walls, clean edges" },
  { src: "/hero/exterior-house.jpg", caption: "Exterior painting, done right" },
];

// Nota: este componente ya no fija su propio "position" (antes tenía
// "relative" fijo en el className). Ahora se usa como fondo de foto
// completa detrás del titular del hero, así que quien lo usa decide si va
// "absolute inset-0" (para llenar un contenedor) — con "relative" fijo,
// pasar "absolute inset-0" desde afuera no funcionaba: la clase "relative"
// ganaba y el fondo no se estiraba para cubrir toda la sección.
export default function HeroCarousel({ className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reducedMotionRef.current) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map(({ src, caption }, i) => (
        <div
          key={caption}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption} className="hero-kenburns h-full w-full object-cover" />
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.caption}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}: ${s.caption}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-7 bg-gold" : "w-1.5 bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
