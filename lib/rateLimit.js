// ---------------------------------------------------------------------------
// Rate limiting simple, en memoria, por IP. Suficiente para una sola
// instancia (o tráfico moderado en Vercel con funciones "warm"). Si el
// sitio escala a múltiples regiones/alto tráfico, esto debe migrar a un
// store compartido (Upstash Redis es la opción estándar en Vercel) —
// documentado aquí para no fingir que esto es infinitamente escalable.
// ---------------------------------------------------------------------------
const buckets = new Map();

export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now - entry.start > windowMs) {
    buckets.set(key, { start: now, count: 1 });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, retryAfterMs: windowMs - (now - entry.start) };
  }
  return { allowed: true, remaining: limit - entry.count };
}

export function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
