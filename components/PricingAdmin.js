"use client";

import { useState } from "react";

const CONDITION_LABELS = { good: "Good", fair: "Fair", poor: "Poor" };

export default function PricingAdmin({ pricing: initial }) {
  const [rules, setRules] = useState(initial);
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  function updateRule(serviceId, patch) {
    setRules((rs) => rs.map((r) => (r.serviceId === serviceId ? { ...r, ...patch } : r)));
  }

  function updateTier(serviceId, tierId, field, value) {
    setRules((rs) =>
      rs.map((r) =>
        r.serviceId === serviceId
          ? { ...r, tiers: { ...r.tiers, [tierId]: { ...r.tiers[tierId], [field]: Number(value) } } }
          : r
      )
    );
  }

  function updateAddOnPrice(serviceId, addOnId, value) {
    setRules((rs) =>
      rs.map((r) =>
        r.serviceId === serviceId
          ? { ...r, addOns: r.addOns.map((a) => (a.id === addOnId ? { ...a, price: Number(value) } : a)) }
          : r
      )
    );
  }

  async function saveRule(rule) {
    setSavingId(rule.serviceId);
    setSavedId(null);
    await fetch(`/api/pricing/${rule.serviceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
    setSavingId(null);
    setSavedId(rule.serviceId);
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="border border-line bg-paper-2 p-4 text-[13px] text-ink-soft">
        Estos números son exactamente los que el estimador público usa para calcular el rango de precio de cada
        cliente — cualquier cambio aquí se refleja de inmediato en el sitio, sin que nadie toque código.
      </div>

      {rules.map((rule) => (
        <div key={rule.serviceId} className="border border-line bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-lg font-bold uppercase text-ink">{rule.label}</div>
            <label className="flex items-center gap-2 text-xs font-bold text-ink-faint">
              <input
                type="checkbox"
                checked={rule.allowAutoEstimate}
                onChange={(e) => updateRule(rule.serviceId, { allowAutoEstimate: e.target.checked })}
              />
              Permite auto-estimado (si no, el cliente ve &quot;se requiere visita&quot;)
            </label>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            {Object.entries(rule.tiers).map(([tierId, tier]) => (
              <div key={tierId} className="border border-line p-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-faint">{tier.label}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-ink-faint">$</span>
                  <input
                    type="number"
                    value={tier.min}
                    onChange={(e) => updateTier(rule.serviceId, tierId, "min", e.target.value)}
                    className="w-full rounded-[3px] border border-line px-2 py-1.5 text-sm outline-none focus:border-ink"
                  />
                  <span className="text-xs text-ink-faint">–</span>
                  <input
                    type="number"
                    value={tier.max}
                    onChange={(e) => updateTier(rule.serviceId, tierId, "max", e.target.value)}
                    className="w-full rounded-[3px] border border-line px-2 py-1.5 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
            {Object.entries(rule.conditionMultipliers || {}).map(([cond, factor]) => (
              <div key={cond} className="flex items-center justify-between border border-line px-3 py-2">
                <span className="text-ink-faint">{CONDITION_LABELS[cond] || cond}</span>
                <span className="font-bold text-ink">×{factor}</span>
              </div>
            ))}
          </div>

          {rule.addOns?.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">Add-ons</div>
              <div className="flex flex-col gap-2">
                {rule.addOns.map((a) => (
                  <div key={a.id} className="flex items-center justify-between border border-line px-3 py-2 text-sm">
                    <span className="text-ink">{a.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-ink-faint">+$</span>
                      <input
                        type="number"
                        value={a.price}
                        onChange={(e) => updateAddOnPrice(rule.serviceId, a.id, e.target.value)}
                        className="w-20 rounded-[3px] border border-line px-2 py-1 text-sm outline-none focus:border-ink"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => saveRule(rule)}
            disabled={savingId === rule.serviceId}
            className="btn-primary text-sm disabled:opacity-60"
          >
            {savingId === rule.serviceId ? "Saving…" : "Save"}
          </button>
          {savedId === rule.serviceId && <span className="ml-3 text-sm font-semibold text-ink">Saved</span>}
        </div>
      ))}
    </div>
  );
}
