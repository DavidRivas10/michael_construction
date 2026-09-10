"use client";

import { useState } from "react";

export default function LeadForm({
  canalOrigen = "formulario",
  prefill = {},
  compact = false,
  ctaLabel = "Send Request",
  showUrgencyCheckbox = false,
}) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoTrabajo: "",
    mensaje: "",
    confirmaUrgencia: false,
    website: "", // honeypot — hidden from real users, left blank
    ...prefill,
  });
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, canalOrigen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message !== "failed" ? err.message : "");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border border-line bg-gold-soft p-6 text-center">
        <div className="mb-1 font-display text-xl font-bold uppercase text-ink">Got it!</div>
        <p className="text-sm text-ink-soft">
          Michael reviews every request personally and will reach out soon by phone or text.
        </p>
      </div>
    );
  }

  const fieldClass =
    "rounded-[3px] border border-line px-4 py-3 text-[15px] outline-none transition focus:border-ink";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {/* Honeypot — hidden from real visitors via CSS, catches simple bots.
          autoComplete="new-password" is a deliberate trick: it's the one
          value that reliably stops Chrome from autofilling this field with
          saved address/name data (plain "off" is ignored by Chrome for this
          purpose), which was previously flagging real visitors as spam. */}
      <input
        type="text"
        name="hp_company"
        tabIndex={-1}
        autoComplete="new-password"
        value={form.website}
        onChange={(e) => update("website", e.target.value)}
        className="absolute h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <input
        required
        placeholder="Full name"
        value={form.nombre}
        onChange={(e) => update("nombre", e.target.value)}
        className={fieldClass}
      />
      <input
        required
        placeholder="Phone number"
        value={form.telefono}
        onChange={(e) => update("telefono", e.target.value)}
        className={fieldClass}
      />
      {!compact && (
        <>
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldClass}
          />
          <select
            value={form.tipoTrabajo}
            onChange={(e) => update("tipoTrabajo", e.target.value)}
            className={`${fieldClass} text-ink-soft`}
          >
            <option value="">What do you need?</option>
            <option value="interior">Interior painting</option>
            <option value="exterior">Exterior painting</option>
            <option value="reparacion">Home repairs</option>
          </select>
          <textarea
            placeholder="Tell us briefly about the project (optional)"
            value={form.mensaje}
            onChange={(e) => update("mensaje", e.target.value)}
            rows={3}
            className={fieldClass}
          />
        </>
      )}
      {showUrgencyCheckbox && (
        <label className="flex items-start gap-2.5 text-[13px] text-ink-soft">
          <input
            type="checkbox"
            checked={form.confirmaUrgencia}
            onChange={(e) => update("confirmaUrgencia", e.target.checked)}
            className="mt-0.5"
          />
          This is an emergency (active leak, safety issue) — text/call me right away.
        </label>
      )}
      <button type="submit" disabled={status === "sending"} className="btn-primary mt-1 justify-center disabled:opacity-60">
        {status === "sending" ? "Sending…" : ctaLabel}
      </button>
      {status === "error" && (
        <div className="text-sm font-semibold text-red-600">
          {errorMsg || "Something went wrong. Please try again or call us directly."}
        </div>
      )}
    </form>
  );
}