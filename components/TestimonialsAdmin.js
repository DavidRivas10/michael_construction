"use client";

import { useState } from "react";
import { IconStar } from "./Icons";

export default function TestimonialsAdmin({ reviews: initial }) {
  const [reviews, setReviews] = useState(initial);
  const [form, setForm] = useState({ author: "", rating: 5, text: "", neighborhood: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating: Number(form.rating) }),
    });
    const data = await res.json();
    setReviews((r) => [data.review, ...r]);
    setForm({ author: "", rating: 5, text: "", neighborhood: "" });
    setSaving(false);
  }

  async function handleDelete(id) {
    setReviews((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[340px_1fr]">
      <form onSubmit={handleAdd} className="h-fit border border-line bg-white p-6">
        <div className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-faint">Agregar testimonio</div>
        <div className="flex flex-col gap-3">
          <input
            required
            placeholder="Nombre del cliente"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <input
            placeholder="Barrio o ciudad (opcional)"
            value={form.neighborhood}
            onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <select
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          >
            {[5, 4, 3].map((n) => <option key={n} value={n}>{n} estrellas</option>)}
          </select>
          <textarea
            required
            rows={4}
            placeholder="Texto de la reseña"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
            className="rounded-[3px] border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <button disabled={saving} className="btn-primary mt-1 justify-center text-sm disabled:opacity-60">
            {saving ? "Agregando…" : "Agregar testimonio"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 border border-line bg-white p-5">
            <div>
              <div className="mb-1.5 flex gap-0.5 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-3.5 w-3.5" />)}
              </div>
              <p className="mb-2 text-[14px] italic text-ink-soft">"{r.text}"</p>
              <div className="text-sm font-bold text-ink">
                {r.author} {r.neighborhood && <span className="font-normal text-ink-faint">— {r.neighborhood}</span>}
              </div>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="shrink-0 text-xs font-bold text-red-700 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
