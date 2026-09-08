import { NextResponse } from "next/server";
import { listPricing } from "@/lib/db";

export const dynamic = "force-dynamic";

// Público a propósito: la tabla de precios es exactamente lo que el
// estimador ya revela en su desglose transparente — no hay nada que
// esconder aquí. Solo la escritura (PATCH en /api/pricing/[serviceId])
// requiere sesión de admin.
export async function GET() {
  return NextResponse.json({ pricing: await listPricing() });
}
