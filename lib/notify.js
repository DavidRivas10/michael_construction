// ---------------------------------------------------------------------------
// Notifications to the business owner (email always; SMS/WhatsApp only for
// leads that justify it) plus a confirmation email to the customer.
//
// DEMO MODE: without real API keys, everything is logged to the server
// console instead of sent — so you can see exactly what would go out
// without spending or configuring anything yet.
//
// Rules (deliberately conservative — avoid spam, duplicate pings, and
// unnecessary Twilio cost):
//   - Every new lead → email to the business (always).
//   - Every new lead → confirmation email to the customer (always, if they
//     gave an email).
//   - SMS to the business → only when the lead is high-value (estimate
//     range above a threshold) OR the customer explicitly confirmed this is
//     an emergency (see the "confirmaUrgencia" checkbox in the lead form —
//     a stray word like "urgent" appearing in free text is NOT enough by
//     itself, that produced false positives in the previous version).
//   - Automatic voice call → only for confirmed emergencies. This is the
//     most disruptive channel and must stay rare and well-justified.
//
// To activate for real:
//   - Email:            set RESEND_API_KEY in .env.local        (https://resend.com)
//   - WhatsApp:          set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//                        TWILIO_WHATSAPP_FROM in .env.local      (https://twilio.com)
//   - Voice call (US):  additionally set TWILIO_VOICE_FROM (a Twilio phone
//                        number capable of voice, US format) and
//                        TWILIO_CALL_TO (the owner's real cell in E.164
//                        format, e.g. +15551234567 — required by Twilio,
//                        no dashes/parentheses/spaces).
// ---------------------------------------------------------------------------
import { getConfig } from "./db";

const HIGH_VALUE_THRESHOLD = 3000; // USD — estimate max above this qualifies for SMS

// TEMP: no custom domain verified in Resend yet, so we send from Resend's
// shared test address. In test mode Resend only delivers to the account's
// own verified email — fine for the owner-facing lead email, but customer
// confirmations to other addresses will fail until a real domain is added.
// Once the business domain is verified in Resend (Domains tab), replace
// these with e.g. "leads@michaelconstruction.com" / "hello@michaelconstruction.com".
const FROM_BUSINESS_EMAIL = "onboarding@resend.dev";
const FROM_CUSTOMER_EMAIL = "onboarding@resend.dev";

export async function notifyNewLead(lead) {
  const config = await getConfig();
  const summary = buildSummary(lead, config);
  const isHighValue = (lead.estimadoMax || 0) >= HIGH_VALUE_THRESHOLD;
  const isConfirmedEmergency = !!lead.urgente; // set only when hasUrgentWord AND user confirmed

  const results = await Promise.allSettled([
    sendBusinessEmail(config, summary, lead),
    sendCustomerConfirmation(config, lead),
    isHighValue || isConfirmedEmergency ? sendWhatsApp(config, summary, lead) : Promise.resolve({ skipped: true }),
    isConfirmedEmergency ? triggerUrgentCall(config, lead) : Promise.resolve({ skipped: true }),
  ]);

  return {
    businessEmail: outcomeOf(results[0]),
    customerEmail: outcomeOf(results[1]),
    sms: outcomeOf(results[2]),
    call: outcomeOf(results[3]),
  };
}

function outcomeOf(settledResult) {
  if (settledResult.status === "fulfilled") return settledResult.value?.skipped ? "skipped" : "sent";
  return "failed";
}

function buildSummary(lead, config) {
  const rango =
    lead.estimadoMin && lead.estimadoMax ? `$${lead.estimadoMin}–$${lead.estimadoMax}` : "not calculated";
  return [
    `New lead — ${config.businessName}`,
    `Name: ${lead.nombre}`,
    `Phone: ${lead.telefono}`,
    `Service: ${lead.tipoTrabajo || "not specified"}`,
    `Source: ${lead.canalOrigen}`,
    `Estimate: ${rango}`,
    lead.urgente ? "⚠ Confirmed emergency" : null,
    `Message: ${lead.mensaje || "(none)"}`,
    `View in dashboard: /admin/leads/${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendBusinessEmail(config, summary, lead) {
  if (!process.env.RESEND_API_KEY) {
    console.log("\n[DEMO · business email NOT sent — missing RESEND_API_KEY]\n" + summary + "\n");
    return { skipped: false };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM_BUSINESS_EMAIL,
    to: config.notifyEmail,
    replyTo: lead.email || undefined,
    subject: `New lead: ${lead.nombre} (${lead.canalOrigen})`,
    text: summary,
  });
  return { skipped: false };
}

async function sendCustomerConfirmation(config, lead) {
  if (!lead.email) return { skipped: true };
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[DEMO · customer confirmation NOT sent to ${lead.email} — missing RESEND_API_KEY]\n`);
    return { skipped: false };
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: `${config.businessName} <${FROM_CUSTOMER_EMAIL}>`,
    to: lead.email,
    subject: `Thanks for contacting ${config.businessName}`,
    text: `Hi ${lead.nombre},\n\nThanks for reaching out to ${config.businessName}. We received your project request and a member of our team will review the details and get back to you soon.\n\n${config.businessName}\n${config.phone}`,
  });
  return { skipped: false };
}

async function sendWhatsApp(config, summary, lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    console.log("\n[DEMO · WhatsApp NOT sent — Twilio not configured]\n" + summary + "\n");
    return { skipped: false };
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: `whatsapp:${from}`,
      To: `whatsapp:${config.whatsapp}`,
      Body: summary,
    }),
  });
  return { skipped: false };
}

async function triggerUrgentCall(config, lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_VOICE_FROM;
  const to = process.env.TWILIO_CALL_TO;
  if (!sid || !token || !from || !to) {
    console.log(`\n[DEMO · emergency call NOT triggered — Twilio Voice not configured] Lead ${lead.id}\n`);
    return { skipped: false };
  }

  const message = `Emergency lead alert from ${config.businessName}. ${escapeForSpeech(
    lead.nombre
  )} needs urgent help with ${escapeForSpeech(lead.tipoTrabajo || "a repair")}. Call them back at ${spellOutPhone(
    lead.telefono
  )}.`;
  const twiml = `<Response><Say voice="alice" language="en-US">${escapeXml(message)}</Say></Response>`;

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ From: from, To: to, Twiml: twiml }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Twilio Voice call failed (${res.status}): ${detail}`);
  }
  return { skipped: false };
}

// Twilio's <Say> reads digits more reliably when they're space-separated.
function spellOutPhone(phone) {
  return String(phone || "").replace(/\D/g, "").split("").join(" ");
}

function escapeForSpeech(text) {
  return String(text || "").replace(/[<>&]/g, "");
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}