"use client";

import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default function PortfolioAdmin({ items: initial }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ title: "", category: "interior", location: "" });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = new FormData();
    body.append("title", form.title);
    body.append("category", form.category);
    body.append("location", form.location);
    if (beforeFile) body.append("beforeFile", beforeFile);
    if (afterFile) body.append("afterFile", afterFile);

    const res = await fetch("/api/portfolio", { method: "POST", body });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "No se pudo agregar el proyecto.");
      setSaving(false);
      return;
    }

    setItems((it) => [data.item, ...it]);
    setForm({ title: "", category: "interior", location: "" });
    setBeforeFile(null);
    setAfterFile(null);
    e.target.reset();
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
            placeholder="Ubicación (ej: Tu ciudad, VA)"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />

          <label className="block">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Foto "antes"</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
              className="block w-full text-xs file:mr-3 file:rounded-[3px] file:border-0 file:bg-paper-2 file:px-3 file:py-2 file:text-xs file:font-bold"
            />
          </label>
          <label className="block">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Foto "después"</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
              className="block w-full text-xs file:mr-3 file:rounded-[3px] file:border-0 file:bg-paper-2 file:px-3 file:py-2 file:text-xs file:font-bold"
            />
          </label>
          <p className="text-[11px] leading-relaxed text-ink-faint">
            Puedes subir solo una foto o ambas — cada una debe pesar menos de 8MB (JPG o PNG).
          </p>

          {error && <p className="text-xs font-semibold text-red-700">{error}</p>}

          <button disabled={saving} className="btn-primary mt-1 justify-center text-sm disabled:opacity-60">
            {saving ? "Subiendo…" : "Agregar al portafolio"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="relative">
            <BeforeAfterSlider
              title={p.title}
              location={p.location}
              beforeUrl={p.beforeUrl}
              afterUrl={p.afterUrl}
              height="h-48"
            />
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