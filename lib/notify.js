// ---------------------------------------------------------------------------
// Notificaciones al dueño (correo, WhatsApp/SMS, llamada).
// MODO DEMO: si no hay API keys reales en el entorno, todo se registra en la
// consola del servidor en vez de enviarse — así puedes ver exactamente qué
// se habría mandado, sin gastar ni configurar nada todavía.
//
// Para activar de verdad:
//   - Correo:    poner RESEND_API_KEY en .env.local  (https://resend.com)
//   - WhatsApp/SMS/Llamada: poner TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
//     TWILIO_WHATSAPP_FROM en .env.local              (https://twilio.com)
// ---------------------------------------------------------------------------
import { getConfig } from "./db";

export async function notifyNewLead(lead) {
  const config = getConfig();
  const summary = buildSummary(lead, config);

  await Promise.allSettled([
    sendEmail(config, summary, lead),
    sendWhatsApp(config, summary, lead),
    lead.urgente ? triggerUrgentCall(config, lead) : Promise.resolve(),
  ]);
}

function buildSummary(lead, config) {
  const rango =
    lead.estimadoMin && lead.estimadoMax
      ? `$${lead.estimadoMin}–$${lead.estimadoMax}`
      : "sin calcular";
  return [
    `Nuevo lead de ${config.businessName}`,
    `Nombre: ${lead.nombre}`,
    `Teléfono: ${lead.telefono}`,
    `Tipo de trabajo: ${lead.tipoTrabajo || "no especificado"}`,
    `Canal: ${lead.canalOrigen}`,
    `Estimado IA: ${rango}`,
    lead.urgente ? "⚠ Marcado como URGENTE" : null,
    `Mensaje: ${lead.mensaje || "(sin mensaje)"}`,
    `Ver en el panel: /admin/leads/${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(config, summary, lead) {
  if (!process.env.RESEND_API_KEY) {
    console.log("\n[DEMO · correo NO enviado — falta RESEND_API_KEY]\n" + summary + "\n");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "leads@michaelconstruction.com",
    to: config.notifyEmail,
    subject: `Nuevo lead: ${lead.nombre} (${lead.canalOrigen})`,
    text: summary,
  });
}

async function sendWhatsApp(config, summary, lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    console.log("\n[DEMO · WhatsApp NO enviado — falta configurar Twilio]\n" + summary + "\n");
    return;
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
}

async function triggerUrgentCall(config, lead) {
  console.log(`\n[DEMO · llamada urgente NO disparada — falta configurar Twilio Voice] Lead ${lead.id}\n`);
  // En producción: llamar a Twilio Voice con un TwiML que lea el resumen del lead.
}
