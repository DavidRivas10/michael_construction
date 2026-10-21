import { NextResponse } from "next/server";
import { pingDatabase } from "@/lib/db";

// Sin esto Next.js genera la respuesta una sola vez en el build y el cron
// recibiría esa copia fija sin tocar nunca la base de datos.
export const dynamic = "force-dynamic";

// Llamado una vez al día por el cron de Vercel (ver vercel.json). Supabase
// pausa los proyectos del plan gratis tras ~7 días sin actividad; esta
// consulta mínima cuenta como actividad y evita esa pausa.
// Si CRON_SECRET está definido en Vercel, Vercel lo manda automáticamente
// como "Authorization: Bearer <CRON_SECRET>" y aquí se exige.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    await pingDatabase();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[keepalive]", err.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
