"use client";

import { useState } from "react";
import { IconCamera, IconBrush, IconHouse, IconWrench } from "./Icons";
import LeadForm from "./LeadForm";

const STEPS = ["Tipo de trabajo", "Tamaño y estado", "Tu estimado"];

const TIPOS = [
  { id: "interior", label: "Pintura interior", icon: IconBrush },
  { id: "exterior", label: "Pintura exterior", icon: IconHouse },
  { id: "reparacion", label: "Reparación", icon: IconWrench },
];

const TAMANOS = [
  { id: "small", label: "Pequeño", hint: "1 cuarto / sección puntual" },
  { id: "medium", label: "Mediano", hint: "Varios cuartos / fachada parcial" },
  { id: "large", label: "Grande", hint: "Casa completa" },
];

export default function EstimatorWizard() {
  const [step, setStep] = useState(0);
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [tamano, setTamano] = useState("");
  const [condicion, setCondicion] = useState("regular");
  const [photoCount, setPhotoCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState(null);

  async function goToResult() {
    setLoading(true);
    setStep(2);
    const res = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipoTrabajo, tamano, condicion, hasPhotos: photoCount > 0 }),
    });
    const data = await res.json();
    setEstimate(data);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-xl border border-line bg-white p-9 shadow-[0_20px_50px_rgba(20,23,28,0.06)]">
      <div className="mb-7 flex items-center gap-3">
        <div className="font-mono text-xs font-bold text-ink-faint">PASO {step + 1} DE 3</div>
        <div className="flex flex-1 gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-[3px] flex-1 transition-colors ${i <= step ? "bg-gold" : "bg-line"}`} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div>
          <h3 className="mb-1 font-display text-2xl font-bold uppercase text-ink">{STEPS[0]}</h3>
          <p className="mb-6 text-sm text-ink-soft">Elige la opción que mejor describa tu proyecto.</p>
          <div className="grid grid-cols-3 gap-3">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTipoTrabajo(t.id)}
                className={`flex flex-col items-center gap-2.5 border-2 p-4 text-center text-sm font-bold transition ${
                  tipoTrabajo === t.id
                    ? "border-ink bg-paper-2 text-ink"
                    : "border-line text-ink-soft hover:border-ink/40"
                }`}
              >
                <t.icon className="h-6 w-6" />
                {t.label}
              </button>
            ))}
          </div>
          <button
            disabled={!tipoTrabajo}
            onClick={() => setStep(1)}
            className="btn-primary mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-30"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="mb-1 font-display text-2xl font-bold uppercase text-ink">{STEPS[1]}</h3>
          <p className="mb-6 text-sm text-ink-soft">Esto ayuda a afinar el rango de precio.</p>

          <div className="mb-5 grid grid-cols-3 gap-3">
            {TAMANOS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTamano(t.id)}
                className={`border-2 p-3 text-center transition ${
                  tamano === t.id ? "border-ink bg-paper-2" : "border-line hover:border-ink/40"
                }`}
              >
                <div className="text-sm font-bold text-ink">{t.label}</div>
                <div className="mt-1 text-[11px] text-ink-faint">{t.hint}</div>
              </button>
            ))}
          </div>

          <div className="mb-6 flex gap-3">
            {["buena", "regular", "mala"].map((c) => (
              <button
                key={c}
                onClick={() => setCondicion(c)}
                className={`flex-1 border-2 py-2.5 text-sm font-bold capitalize transition ${
                  condicion === c ? "border-ink bg-paper-2 text-ink" : "border-line text-ink-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="mb-7 flex cursor-pointer items-center gap-4 border-[1.5px] border-dashed border-line bg-paper-2/50 p-5">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setPhotoCount(e.target.files?.length || 0)}
            />
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white">
              <IconCamera className="h-5 w-5 text-ink" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink">
                {photoCount > 0 ? `${photoCount} foto(s) seleccionada(s)` : "Sube 1–3 fotos (opcional)"}
              </div>
              <div className="text-xs text-ink-faint">Ayuda a afinar el precio desde el primer momento.</div>
            </div>
          </label>

          <div className="flex justify-between">
            <button onClick={() => setStep(0)} className="btn-ghost">← Atrás</button>
            <button disabled={!tamano} onClick={goToResult} className="btn-primary disabled:cursor-not-allowed disabled:opacity-30">
              Ver mi estimado
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          {loading || !estimate ? (
            <div className="py-14 text-center text-sm font-semibold text-ink-faint">Calculando tu estimado…</div>
          ) : (
            <>
              <h3 className="mb-1 font-display text-2xl font-bold uppercase text-ink">Tu rango estimado</h3>
              <p className="mb-5 text-sm text-ink-soft">{estimate.note}</p>

              <div className="mb-4 border border-line">
                {estimate.breakdown.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-line px-4 py-3 text-[13.5px] last:border-b-0"
                  >
                    <span className="text-ink-soft">{b.label}</span>
                    <span className="font-bold text-ink">{b.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-paper-2 px-4 py-4">
                  <span className="text-sm font-bold text-ink">Rango final</span>
                  <span className="font-display text-2xl font-bold text-gold-dark">
                    ${estimate.min.toLocaleString()}–${estimate.max.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-4 text-sm font-bold text-ink">
                Deja tus datos y Michael te confirma el precio exacto:
              </div>
              <LeadForm
                canalOrigen="estimador"
                compact
                ctaLabel="Confirmar y reservar visita gratis"
                prefill={{
                  tipoTrabajo,
                  mensaje: `Estimador IA — tamaño: ${tamano}, condición: ${condicion}`,
                  estimadoMin: estimate.min,
                  estimadoMax: estimate.max,
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
