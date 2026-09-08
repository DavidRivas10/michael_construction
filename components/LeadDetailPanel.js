"use client";

import { useState } from "react";
import { IconPhone } from "./Icons";

const ESTADOS = ["nuevo", "contactado", "agendado", "cerrado"];

export default function LeadDetailPanel({ lead: initialLead }) {
  const [lead, setLead] = useState(initialLead);
  const [notas, setNotas] = useState(initialLead.notasInternas || "");
  const [saving, setSaving] = useState(false);

  async function save(partial) {
    setSaving(true);
    const res = await fetch(`/api/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    const data = await res.json();
    setLead(data.lead);
    setSaving(false);
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
      <div className="border border-line bg-white p-7">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-display text-xl font-bold uppercase text-ink">
              {lead.nombre}
              {lead.urgente && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">URGENTE</span>
              )}
            </div>
            <a href={`tel:${lead.telefono}`} className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gold-dark">
              <IconPhone className="h-3.5 w-3.5" /> {lead.telefono}
            </a>
          </div>
          <div className="text-xs text-ink-faint">{new Date(lead.createdAt).toLocaleString("en-US")}</div>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
          <Field label="Canal" value={lead.canalOrigen} />
          <Field label="Tipo de trabajo" value={lead.tipoTrabajo || "—"} />
          <Field label="Estimado con IA" value={lead.estimadoMin ? `$${lead.estimadoMin}–$${lead.estimadoMax}` : "No calculado"} />
          <Field label="Correo" value={lead.email || "—"} />
        </dl>

        {lead.mensaje && <div className="mt-5 bg-paper-2 p-4 text-sm text-ink">{lead.mensaje}</div>}
      </div>

      <div className="flex flex-col gap-5">
        <div className="border border-line bg-white p-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-faint">Estado</div>
          <div className="flex flex-col gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e}
                onClick={() => save({ estado: e })}
                className={`rounded-[3px] border px-3 py-2 text-left text-sm font-bold capitalize transition ${
                  lead.estado === e ? "border-ink bg-paper-2 text-ink" : "border-line text-ink-faint"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-line bg-white p-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-faint">Notas internas</div>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
            className="w-full rounded-[3px] border border-line p-3 text-sm outline-none focus:border-ink"
            placeholder="Ej: llamó, agendó visita para el jueves…"
          />
          <button
            onClick={() => save({ notasInternas: notas })}
            disabled={saving}
            className="btn-primary mt-3 w-full justify-center text-sm disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar nota"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1 font-semibold capitalize text-ink">{value}</div>
    </div>
  );
}
