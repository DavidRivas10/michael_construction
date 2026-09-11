// ---------------------------------------------------------------------------
// Configurable pricing engine. Prices come exclusively from the "pricing"
// table in Supabase (editable by the owner in /admin/pricing) — never from
// AI, never hardcoded
// here. Claude Vision (when ANTHROPIC_API_KEY is set) may only extract
// observations from photos to help pre-fill the form; it never determines
// a price. If it's absent, times out, or the image is unclear, the estimator
// keeps working exactly the same from manual answers alone.
// ---------------------------------------------------------------------------
import { getPricingForService } from "./db";

export async function getEstimate({ tipoTrabajo, tamano, condicion, addOns = [], hasPhotos }) {
  const rule = await getPricingForService(tipoTrabajo);
  if (!rule) {
    return {
      error: true,
      note: "We don't have pricing configured for that service yet — an on-site estimate is required.",
    };
  }

  let aiObservations = null;
  if (hasPhotos && process.env.ANTHROPIC_API_KEY) {
    // aiObservations = await analyzePhotosWithClaude(photos);
    // ↑ Placeholder for the real call: Claude Vision returns *observations*
    // only (surface type, visible damage, suggested size) — never a price.
    // Those observations would pre-fill tamano/condicion suggestions in the
    // wizard UI; the calculation below is unaffected either way.
  }

  if (!rule.allowAutoEstimate || rule.pricingModel === "manual_quote") {
    return {
      requiresOnSiteVisit: true,
      note: "An on-site estimate is required for this project. Michael will confirm exact pricing at the visit — free of charge.",
      aiObservations,
    };
  }

  const result = calculateByModel(rule, { tamano, condicion, addOns });
  return { ...result, isExample: true, aiObservations, disclaimer: rule.disclaimer };
}

function calculateByModel(rule, { tamano, condicion, addOns }) {
  switch (rule.pricingModel) {
    case "tiered":
      return calculateTiered(rule, tamano, condicion, addOns);
    case "fixed":
      return calculateFixed(rule, addOns);
    default:
      return calculateTiered(rule, tamano, condicion, addOns);
  }
}

function calculateTiered(rule, tamano, condicion, addOns) {
  const tier = rule.tiers[tamano] || rule.tiers.medium;
  const factor = rule.conditionMultipliers?.[condicion] ?? 1.0;

  let min = Math.round(tier.min * factor);
  let max = Math.round(tier.max * factor);

  const breakdown = [
    { label: `Base rate — ${rule.label}, ${tier.label}`, value: `$${tier.min.toLocaleString()}–$${tier.max.toLocaleString()}` },
    {
      label: `Condition adjustment (${condicion})`,
      value: factor > 1 ? `+${Math.round((factor - 1) * 100)}%` : factor < 1 ? `−${Math.round((1 - factor) * 100)}%` : "no change",
    },
  ];

  const selectedAddOns = (rule.addOns || []).filter((a) => addOns.includes(a.id));
  for (const addOn of selectedAddOns) {
    min += addOn.price;
    max += addOn.price;
    breakdown.push({ label: addOn.label, value: `+$${addOn.price.toLocaleString()}` });
  }

  min = Math.max(min, rule.minimumPrice || 0);
  max = Math.max(max, rule.minimumPrice || 0);

  return { min, max, breakdown };
}

function calculateFixed(rule, addOns) {
  let min = rule.basePrice;
  let max = rule.basePrice;
  const breakdown = [{ label: `Base price — ${rule.label}`, value: `$${rule.basePrice.toLocaleString()}` }];

  const selectedAddOns = (rule.addOns || []).filter((a) => addOns.includes(a.id));
  for (const addOn of selectedAddOns) {
    min += addOn.price;
    max += addOn.price;
    breakdown.push({ label: addOn.label, value: `+$${addOn.price.toLocaleString()}` });
  }

  return { min, max, breakdown };
}
