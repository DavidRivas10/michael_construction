"use client";

import { useRef, useState, useCallback } from "react";

// Comparador antes/después arrastrable de verdad (puntero + touch).
// Usa bloques de textura como placeholder hasta que haya fotos reales —
// solo hay que reemplazar los dos <div> marcados por <img>.
export default function BeforeAfterSlider({ title, location, beforeLabel = "BEFORE", afterLabel = "AFTER", height = "h-64" }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef(null);

  const updateFromClientX = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(96, Math.max(4, pct)));
  }, []);

  function onPointerDown(e) {
    setDragging(true);
    updateFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    updateFromClientX(e.clientX ?? e.touches?.[0]?.clientX);
  }
  function onPointerUp() {
    setDragging(false);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowLeft") { setPos((p) => Math.max(4, p - 5)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPos((p) => Math.min(96, p + 5)); e.preventDefault(); }
  }

  return (
    <div className="group overflow-hidden rounded-sm border border-line bg-white">
      <div
        ref={ref}
        className={`relative ${height} w-full cursor-ew-resize select-none overflow-hidden`}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        {/* AFTER (fondo completo) */}
        <div className="placeholder-photo absolute inset-0 flex items-end justify-start bg-[#e9ddc4] p-3">
          <span className="rounded-sm bg-charcoal/80 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
            {afterLabel}
          </span>
        </div>

        {/* BEFORE (recortado según el arrastre) */}
        <div
          className="placeholder-photo absolute inset-y-0 left-0 flex items-end justify-start overflow-hidden bg-[#cfd3cb] p-3 grayscale"
          style={{ width: `${pos}%` }}
        >
          <span className="rounded-sm bg-charcoal/80 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
            {beforeLabel}
          </span>
        </div>

        {/* Handle */}
        <div
          className="absolute inset-y-0 z-10 w-[3px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${pos}%`, transform: "translateX(-1.5px)" }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Before/after comparison${title ? ` — ${title}` : ""}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKeyDown}
            className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14171C" strokeWidth="2" strokeLinecap="round">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {(title || location) && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-bold text-ink">{title}</div>
          <div className="text-[13px] text-ink-faint">{location}</div>
        </div>
      )}
    </div>
  );
}
