// ---------------------------------------------------------------------------
// Builds a wa.me deep link. wa.me requires digits only (no "+", spaces,
// dashes or parentheses), and ignores a leading "+" if present anyway — we
// strip everything non-numeric to be safe across however the number was
// typed in the admin config screen.
// ---------------------------------------------------------------------------
export function buildWhatsAppLink(whatsapp, message = "Hi! I'd like to get a quote for my project.") {
  if (!whatsapp) return null;
  const digits = String(whatsapp).replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}