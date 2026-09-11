"use client";

import { useState, useMemo } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "reparacion", label: "Repairs" },
];

export default function PortfolioGrid({ items }) {
  const [filter, setFilter] = useState("all");

  // Un proyecto sin ninguna foto (antes/después) no se muestra nunca en el
  // sitio público — solo sirve para confundir al visitante con una tarjeta
  // vacía. Se sigue viendo en /admin/portafolio para poder completarlo o
  // eliminarlo.
  const withPhotos = useMemo(() => items.filter((i) => i.beforeUrl || i.afterUrl), [items]);

  const filtered = useMemo(
    () => (filter === "all" ? withPhotos : withPhotos.filter((i) => i.category === filter)),
    [withPhotos, filter]
  );

  return (
    <div>
      <div className="mb-9 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-[3px] border px-4 py-2 text-sm font-bold transition ${
              filter === f.id
                ? "border-ink bg-ink text-white"
                : "border-line text-ink-soft hover:border-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line py-16 text-center text-ink-faint">
          No projects in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="animate-[fadeIn_.25s_ease] transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(20,23,28,0.35)]"
            >
              <BeforeAfterSlider title={p.title} location={p.location} beforeUrl={p.beforeUrl} afterUrl={p.afterUrl} />
              {p.description && (
                <p className="mt-2 px-0.5 text-[13px] leading-relaxed text-ink-faint">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
