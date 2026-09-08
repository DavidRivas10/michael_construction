import { NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/db";
import { notifyNewLead } from "@/lib/notify";
import { getSession } from "@/lib/auth";

// Palabras que marcan un lead como urgente para disparar el aviso reforzado.
const URGENT_WORDS = ["hoy", "urgente", "emergencia", "lo antes posible", "ya mismo"];

export async function POST(request) {
  const body = await request.json();

  if (!body.nombre || !body.telefono) {
    return NextResponse.json(
      { error: "Nombre y teléfono son obligatorios." },
      { status: 400 }
    );
  }

  const texto = `${body.mensaje || ""} ${body.tipoTrabajo || ""}`.toLowerCase();
  const urgente = URGENT_WORDS.some((w) => texto.includes(w));

  const lead = createLead({ ...body, urgente });
  await notifyNewLead(lead);

  return NextResponse.json({ ok: true, lead }, { status: 201 });
}

export async function GET() {
  if (!getSession()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json({ leads: listLeads() });
}
