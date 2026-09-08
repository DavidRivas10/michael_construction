"use client";

import { useState } from "react";

export default function LeadForm({
  canalOrigen = "formulario",
  prefill = {},
  compact = false,
  ctaLabel = "Enviar solicitud",
}) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoTrabajo: "",
    mensaje: "",
    ...prefill,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, canalOrigen }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-line bg-gold-soft p-6 text-center">
        <div className="mb-1 font-display text-xl font-bold uppercase text-ink">¡Recibido!</div>
        <p className="text-sm text-ink-soft">
          Michael revisa cada solicitud personalmente y te contacta muy pronto por teléfono o WhatsApp.
        </p>
      </div>
    );
  }

  const fieldClass =
    "rounded-[3px] border border-line px-4 py-3 text-[15px] outline-none transition focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <input
        required
        placeholder="Nombre completo"
        value={form.nombre}
        onChange={(e) => update("nombre", e.target.value)}
        className={fieldClass}
      />
      <input
        required
        placeholder="Teléfono"
        value={form.telefono}
        onChange={(e) => update("telefono", e.target.value)}
        className={fieldClass}
      />
      {!compact && (
        <>
          <select
            value={form.tipoTrabajo}
            onChange={(e) => update("tipoTrabajo", e.target.value)}
            className={`${fieldClass} text-ink-soft`}
          >
            <option value="">¿Qué necesitas?</option>
            <option value="interior">Pintura interior</option>
            <option value="exterior">Pintura exterior</option>
            <option value="reparacion">Reparación del hogar</option>
          </select>
          <textarea
            placeholder="Cuéntanos brevemente del proyecto (opcional)"
            value={form.mensaje}
            onChange={(e) => update("mensaje", e.target.value)}
            rows={3}
            className={fieldClass}
          />
        </>
      )}
      <button type="submit" disabled={status === "sending"} className="btn-primary mt-1 justify-center disabled:opacity-60">
        {status === "sending" ? "Enviando…" : ctaLabel}
      </button>
      {status === "error" && (
        <div className="text-sm font-semibold text-red-600">
          Algo falló al enviar. Intenta de nuevo o llámanos directamente.
        </div>
      )}
    </form>
  );
}
