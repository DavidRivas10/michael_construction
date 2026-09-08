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
//   - Email:    set RESEND_API_KEY in .env.local   (https://resend.com)
//   - WhatsApp/SMS/Call: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//     TWILIO_WHATSAPP_FROM in .env.local            (https://twilio.com)
// ---------------------------------------------------------------------------
import { getConfig } from "./db";

const HIGH_VALUE_THRESHOLD = 3000; // USD — estimate max above this qualifies for SMS

export async function notifyNewLead(lead) {
  const config = getConfig();
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
    from: "leads@michaelconstruction.com",
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
    from: `${config.businessName} <hello@michaelconstruction.com>`,
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
  console.log(`\n[DEMO · emergency call NOT triggered — Twilio Voice not configured] Lead ${lead.id}\n`);
  // In production: call Twilio Voice with TwiML that reads the lead summary.
  return { skipped: false };
}
