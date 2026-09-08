import { NextResponse } from "next/server";
import { createLead, listLeads, updateLead } from "@/lib/db";
import { notifyNewLead } from "@/lib/notify";
import { getSession } from "@/lib/auth";
import { validateLead } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Words that flag a lead as possibly urgent — combined with the explicit
// "esUrgente" checkbox from the form. A word match alone no longer triggers
// an automatic call; see lib/notify.js for the full urgency scoring.
const URGENT_WORDS = ["today", "urgent", "emergency", "asap", "right away", "flooding", "burst pipe"];

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`leads:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  }

  const body = await request.json();
  const { valid, errors, clean } = validateLead(body);
  if (!valid) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const texto = `${clean.mensaje} ${body.tipoTrabajo || ""}`.toLowerCase();
  const hasUrgentWord = URGENT_WORDS.some((w) => texto.includes(w));
  const urgente = hasUrgentWord && !!body.confirmaUrgencia;

  const lead = await createLead({ ...body, ...clean, urgente, hasUrgentWord });
  const notifyResult = await notifyNewLead(lead);
  const updatedLead = (await updateLead(lead.id, { notified: notifyResult })) || lead;

  return NextResponse.json({ ok: true, lead: updatedLead, notified: notifyResult }, { status: 201 });
}

export async function GET() {
  if (!getSession()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ leads: await listLeads() });
}
