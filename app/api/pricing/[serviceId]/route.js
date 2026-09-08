import { NextResponse } from "next/server";
import { updatePricingForService } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const rule = await updatePricingForService(params.serviceId, body);
  if (!rule) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ rule });
}
