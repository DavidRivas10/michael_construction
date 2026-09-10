"use client";

import { useEffect, useRef, useState } from "react";
import { HeroArt, InteriorArt, RepairArt } from "./BrandArt";

const SLIDES = [
  { Art: HeroArt, caption: "Exterior painting, done right" },
  { Art: InteriorArt, caption: "Interior walls, clean edges" },
  { Art: RepairArt, caption: "Repairs before the paint goes on" },
];

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
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map(({ Art, caption }, i) => (
        <div
          key={caption}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Art className="h-full w-full" />
        </div>
      ))}

      {/* Reserve layout height using the first slide (they're all the same size) */}
      <div className="invisible">
        <HeroArt className="h-full w-full" />
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.caption}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}: ${s.caption}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-gold-dark" : "w-2 bg-ink/20 hover:bg-ink/35"
            }`}
          />
        ))}
      </div>
    </div>
  );
}