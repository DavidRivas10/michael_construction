// ---------------------------------------------------------------------------
// Server-side validation for public form endpoints. Deliberately small and
// dependency-free (a full Zod schema is easy to swap in later without
// touching callers) — but every public POST route runs data through this
// before it's trusted, since the client-side form validation can always be
// bypassed.
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-.\s]{7,20}$/;

export function validateLead(body) {
  const errors = [];
  const nombre = String(body.nombre || "").trim();
  const telefono = String(body.telefono || "").trim();
  const email = String(body.email || "").trim();
  const mensaje = String(body.mensaje || "").trim();

  if (!nombre || nombre.length < 2) errors.push("Name is required.");
  if (nombre.length > 120) errors.push("Name is too long.");
  if (!telefono || !PHONE_RE.test(telefono)) errors.push("A valid phone number is required.");
  if (email && !EMAIL_RE.test(email)) errors.push("Email address looks invalid.");
  if (mensaje.length > 2000) errors.push("Message is too long.");

  // Honeypot: campo oculto que un humano nunca llena; si viene con
  // contenido, es casi seguro un bot.
  if (body.website) errors.push("Spam detected.");

  return { valid: errors.length === 0, errors, clean: { nombre, telefono, email, mensaje } };
}

export function validateEstimateInput(body) {
  const VALID_TIPOS = ["interior", "exterior", "reparacion"];
  const VALID_TAMANOS = ["small", "medium", "large"];
  const VALID_CONDICIONES = ["good", "fair", "poor"];

  const errors = [];
  if (!VALID_TIPOS.includes(body.tipoTrabajo)) errors.push("Invalid service type.");
  if (!VALID_TAMANOS.includes(body.tamano)) errors.push("Invalid project size.");
  if (!VALID_CONDICIONES.includes(body.condicion)) errors.push("Invalid condition.");

  return { valid: errors.length === 0, errors };
}
