"use client";

import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default function PortfolioAdmin({ items: initial }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ title: "", category: "interior", location: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setItems((it) => [data.item, ...it]);
    setForm({ title: "", category: "interior", location: "" });
    setSaving(false);
  }

  async function handleDelete(id) {
    setItems((it) => it.filter((i) => i.id !== id));
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
      <form onSubmit={handleAdd} className="h-fit border border-line bg-white p-6">
        <div className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-faint">Agregar proyecto</div>
        <div className="flex flex-col gap-3">
          <input
            required
            placeholder="Título (ej: Sala de estar)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          >
            <option value="interior">Interior</option>
            <option value="exterior">Exterior</option>
            <option value="reparacion">Reparación</option>
          </select>
          <input
            placeholder="Ubicación (ej: [Your City], VA)"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="border border-dashed border-line bg-paper-2/50 p-4 text-center text-xs text-ink-faint">
            Subida de fotos reales se conecta aquí cuando esté lista una cuenta de almacenamiento (Supabase Storage / Cloudinary).
          </div>
          <button disabled={saving} className="btn-primary mt-1 justify-center text-sm disabled:opacity-60">
            {saving ? "Agregando…" : "Agregar al portafolio"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="relative">
            <BeforeAfterSlider title={p.title} location={p.location} height="h-48" />
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute right-2 top-2 z-20 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-red-700 shadow hover:bg-white"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
