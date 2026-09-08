"use client";

import { useState, useMemo } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "reparacion", label: "Reparaciones" },
];

export default function PortfolioGrid({ items }) {
  const [filter, setFilter] = useState("todos");

  const filtered = useMemo(
    () => (filter === "todos" ? items : items.filter((i) => i.category === filter)),
    [items, filter]
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
          Aún no hay proyectos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="animate-[fadeIn_.25s_ease]">
              <BeforeAfterSlider title={p.title} location={p.location} />
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
