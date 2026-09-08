"use client";

import { useState } from "react";

export default function FaqAdmin({ items: initial }) {
  const [items, setItems] = useState(initial);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setItems((it) => [...it, data.item]);
    setForm({ question: "", answer: "" });
    setSaving(false);
  }

  async function handleDelete(id) {
    setItems((it) => it.filter((i) => i.id !== id));
    await fetch(`/api/faq/${id}`, { method: "DELETE" });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-3">
        {items.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-4 border border-line bg-white p-5">
            <div>
              <div className="mb-1 font-bold text-ink">{f.question}</div>
              <p className="text-[14px] text-ink-soft">{f.answer}</p>
            </div>
            <button onClick={() => handleDelete(f.id)} className="shrink-0 text-xs font-bold text-red-700 hover:underline">
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="border border-line bg-white p-6">
        <div className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-faint">Agregar pregunta</div>
        <div className="flex flex-col gap-3">
          <input
            required
            placeholder="Pregunta"
            value={form.question}
            onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
            className="rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          <textarea
            required
            rows={3}
            placeholder="Respuesta"
            value={form.answer}
            onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
            className="rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
          <button disabled={saving} className="btn-primary self-start text-sm disabled:opacity-60">
            {saving ? "Agregando…" : "Agregar pregunta"}
          </button>
        </div>
      </form>
    </div>
  );
}
