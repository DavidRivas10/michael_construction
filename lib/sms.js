// ---------------------------------------------------------------------------
// Builds an "sms:" deep link so the button opens the phone's native texting
// app. The business's customers mostly don't use WhatsApp, so we dropped
// the wa.me link (see git history) in favor of plain SMS.
//
// "?&body=" is a widely-used cross-platform trick: iOS Messages expects
// "&body=", most Android SMS apps expect "?body=" -- sending both prefixes
// satisfies either without user-agent sniffing.
// ---------------------------------------------------------------------------
export function buildSmsLink(phone, message = "Hi! I'd like to get a quote for my project.") {
  if (!phone) return null;
  const digits = String(phone).replace(/[^\d+]/g, "");
  if (!digits) return null;
  return `sms:${digits}?&body=${encodeURIComponent(message)}`;
}
