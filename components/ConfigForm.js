"use client";

import { useState } from "react";

const CONTENT_FIELDS = [
  { key: "heroHeadline", label: "Título principal del inicio" },
  { key: "heroSubheadline", label: "Subtítulo del inicio", area: true },
];

const CONTACT_FIELDS = [
  { key: "businessName", label: "Nombre del negocio" },
  { key: "phone", label: "Teléfono" },
  { key: "smsPhone", label: "Teléfono para mensajes de texto (formato internacional, ej. +14347609139)" },
  { key: "email", label: "Correo de contacto" },
  { key: "serviceArea", label: "Zona de servicio" },
  { key: "licenseState", label: "Estado de la licencia" },
  { key: "notifyEmail", label: "Correo donde llegan los leads" },
];

export default function ConfigForm({ config: initial }) {
  const [config, setConfig] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    setConfig(data.config);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
      <FieldGroup title="Textos del inicio" fields={CONTENT_FIELDS} config={config} setConfig={setConfig} />
      <FieldGroup title="Datos de contacto" fields={CONTACT_FIELDS} config={config} setConfig={setConfig} />

      <div className="md:col-span-2">
        <button disabled={saving} className="btn-primary text-sm disabled:opacity-60">
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {saved && <span className="ml-4 text-sm font-semibold text-ink">Guardado — ya se ve así en el sitio.</span>}
      </div>
    </form>
  );
}

function FieldGroup({ title, fields, config, setConfig }) {
  return (
    <div className="h-fit border border-line bg-white p-6">
      <div className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-faint">{title}</div>
      <div className="flex flex-col gap-4">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink-faint">{f.label}</div>
            {f.area ? (
              <textarea
                rows={3}
                value={config[f.key] || ""}
                onChange={(e) => setConfig((c) => ({ ...c, [f.key]: e.target.value }))}
                className="w-full rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            ) : (
              <input
                value={config[f.key] || ""}
                onChange={(e) => setConfig((c) => ({ ...c, [f.key]: e.target.value }))}
                className="w-full rounded-[3px] border border-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
