"use client";

import { useState } from "react";
import { IconStar } from "./Icons";

export default function TestimonialsAdmin({ reviews: initial }) {
  const [reviews, setReviews] = useState(initial);
  const [form, setForm] = useState({ author: "", rating: 5, text: "", neighborhood: "" });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const pending = reviews.filter((r) => !r.isApproved);
  const published = reviews.filter((r) => r.isApproved);

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

  async function handleApprove(id) {
    setBusyId(id);
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    if (res.ok) {
      setReviews((r) => r.map((x) => (x.id === id ? { ...x, isApproved: true } : x)));
    } else {
      alert("No se pudo aprobar la reseña. Intenta de nuevo.");
    }
    setBusyId(null);
  }

  async function handleDelete(id) {
    const prev = reviews;
    setReviews((r) => r.filter((x) => x.id !== id));
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("No se pudo eliminar la reseña. Intenta de nuevo.");
      setReviews(prev);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {pending.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="font-display text-lg font-bold uppercase text-ink">Pendientes de aprobar</div>
            <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-charcoal">{pending.length}</span>
          </div>
          <p className="mb-4 text-[13px] text-ink-faint">
            Estas reseñas las escribieron visitantes directamente en el sitio. No aparecen públicamente hasta que
            les des clic a "Aprobar".
          </p>
          <div className="flex flex-col gap-3">
            {pending.map((r) => (
              <div key={r.id} className="flex items-start justify-between gap-4 border border-gold/50 bg-gold-soft/40 p-5">
                <div>
                  <div className="mb-1.5 flex gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-3.5 w-3.5" />)}
                  </div>
                  <p className="mb-2 text-[14px] italic text-ink-soft">"{r.text}"</p>
                  <div className="text-sm font-bold text-ink">
                    {r.author} {r.neighborhood && <span className="font-normal text-ink-faint">— {r.neighborhood}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <button
                    onClick={() => handleApprove(r.id)}
                    disabled={busyId === r.id}
                    className="rounded-[3px] bg-ink px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {busyId === r.id ? "Aprobando…" : "Aprobar"}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-xs font-bold text-red-700 hover:underline">
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <p className="text-[11px] leading-relaxed text-ink-faint">
              Lo que agregues aquí se publica de inmediato, sin pasar por aprobación (es Michael quien lo está
              escribiendo directamente).
            </p>
          </div>
        </form>

        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-faint">
            Publicados ({published.length})
          </div>
          <div className="flex flex-col gap-4">
            {published.map((r) => (
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
            {published.length === 0 && (
              <div className="rounded-sm border border-dashed border-line py-10 text-center text-sm text-ink-faint">
                Todavía no hay testimonios publicados.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
