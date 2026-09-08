// ---------------------------------------------------------------------------
// Estimador de precio. MODO DEMO: calcula un rango con una tabla de tarifas
// base transparente — no analiza las fotos todavía, pero el CÁLCULO que sí
// hace queda visible para el cliente (nada de número sacado de la nada).
//
// Para activar la versión real con IA (lee las fotos de verdad):
//   poner ANTHROPIC_API_KEY en .env.local y reemplazar `estimateMock`
//   por una llamada a la API de Claude con visión (ver comentario abajo).
// ---------------------------------------------------------------------------

const BASE_RATES = {
  interior: { label: "Pintura interior", small: [600, 950], medium: [1200, 1800], large: [2200, 3400] },
  exterior: { label: "Pintura exterior", small: [1400, 2100], medium: [2800, 4200], large: [4800, 7200] },
  reparacion: { label: "Reparación del hogar", small: [250, 500], medium: [600, 1200], large: [1400, 2600] },
};

const SIZE_LABELS = { small: "Pequeño", medium: "Mediano", large: "Grande" };

export async function getEstimate({ tipoTrabajo, tamano, condicion, hasPhotos }) {
  if (process.env.ANTHROPIC_API_KEY) {
    // return await estimateWithClaude({ tipoTrabajo, tamano, condicion, photos });
    // ↑ Aquí iría la llamada real: enviar las fotos + respuestas a la API de
    // Claude con visión, pidiendo que devuelva un rango de precio en JSON,
    // usando este mismo cálculo como piso de referencia.
  }
  return estimateMock({ tipoTrabajo, tamano, condicion });
}

function estimateMock({ tipoTrabajo, tamano, condicion }) {
  const table = BASE_RATES[tipoTrabajo] || BASE_RATES.interior;
  const [baseMin, baseMax] = table[tamano] || table.medium;

  const conditionFactor = condicion === "mala" ? 1.22 : condicion === "regular" ? 1.0 : 0.94;

  const min = Math.round(baseMin * conditionFactor);
  const max = Math.round(baseMax * conditionFactor);

  const breakdown = [
    { label: `Tarifa base — ${table.label}, tamaño ${SIZE_LABELS[tamano] || "mediano"}`, value: `$${baseMin.toLocaleString()}–$${baseMax.toLocaleString()}` },
    {
      label: `Ajuste por condición (${condicion})`,
      value: condicion === "mala" ? "+22%" : condicion === "regular" ? "sin cambio" : "−6%",
    },
  ];

  return {
    min,
    max,
    breakdown,
    isExample: true,
    note: "Estimado preliminar calculado con base en el tipo de trabajo, el tamaño y la condición que indicaste. Michael confirma el precio exacto, gratis, en la visita.",
  };
}
