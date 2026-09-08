"use client";

import { useEffect, useRef, useState } from "react";
import { IconStar } from "./Icons";

export default function TestimonialCarousel({ reviews }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused, reviews.length]);

  if (reviews.length === 0) return null;
  const r = reviews[index];

  return (
    <div
      className="relative mx-auto max-w-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="rounded-sm border border-line bg-white px-9 py-10 text-center">
        <div className="mb-4 flex justify-center gap-0.5 text-gold">
          {Array.from({ length: r.rating }).map((_, i) => (
            <IconStar key={i} className="h-4 w-4" />
          ))}
        </div>
        <p className="mb-5 text-lg italic leading-relaxed text-ink">&ldquo;{r.text}&rdquo;</p>
        <div className="text-sm font-bold text-ink">{r.author}</div>
        <div className="text-xs text-ink-faint">{r.neighborhood}</div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          aria-label="Anterior"
          onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-ink hover:text-ink"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              aria-label={`Ver reseña ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
        <button
          aria-label="Siguiente"
          onClick={() => setIndex((i) => (i + 1) % reviews.length)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft hover:border-ink hover:text-ink"
        >
          ›
        </button>
      </div>
    </div>
  );
}
