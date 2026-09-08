"use client";

import { useState } from "react";

export default function ServicesAdmin({ services: initial }) {
  const [services, setServices] = useState(initial);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      {services.map((s, idx) => (
        <ServiceCard key={s.id} service={s} onSaved={(updated) => {
          const copy = [...services];
          copy[idx] = updated;
          setServices(copy);
        }} />
      ))}
    </div>
  );
}

function ServiceCard({ service, onSaved }) {
  const [title, setTitle] = useState(service.title);
  const [shortDesc, setShortDesc] = useState(service.shortDesc);
  const [items, setItems] = useState(service.items.join("\n"));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch(`/api/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        shortDesc,
        items: items.split("\n").map((s) => s.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    onSaved(data.service);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="border border-line bg-white p-6">
      <label className="mb-3 block">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Título</div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-[3px] border border-line px-3.5 py-2.5 text-sm font-bold outline-none focus:border-ink"
        />
      </label>
      <label className="mb-3 block">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Descripción corta</div>
        <textarea
          rows={2}
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          className="w-full rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </label>
      <label className="mb-4 block">
        <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">Qué incluye (una línea por punto)</div>
        <textarea
          rows={4}
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="w-full rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
        />
      </label>
      <button onClick={handleSave} disabled={saving} className="btn-primary text-sm disabled:opacity-60">
        {saving ? "Guardando…" : "Guardar servicio"}
      </button>
      {saved && <span className="ml-3 text-sm font-semibold text-ink">Guardado ✓</span>}
    </div>
  );
}
